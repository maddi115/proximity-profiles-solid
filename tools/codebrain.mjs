#!/usr/bin/env node

// codebrain.mjs - Smart Architecture Analyzer
// Analyzes codebase structure with direct code references
//
// Usage:
//   node tools/codebrain.mjs tree src           # Smart architecture view
//   node tools/codebrain.mjs map <file> [depth] # Dependency tree
//   node tools/codebrain.mjs full <file> [depth] # Full code dump
//   node tools/codebrain.mjs func <file> <name> # Function analysis
//   node tools/codebrain.mjs slice <file> <name> # AI slice

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- shared helpers ----------

function readFile(p) {
  return fs.readFileSync(p, "utf8");
}

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function rel(p) {
  return path.relative(process.cwd(), p);
}

// naive import regex (ESM-style)
const IMPORT_REGEX = /import\s+[^'"]*?from\s+["'](.+?)["']/g;
const EXPORT_REGEX = /export\s+(?:default\s+)?(?:function|const|class|let|var)\s+([A-Za-z_]\w*)/g;
const FUNCTION_REGEX = /(?:export\s+)?(?:default\s+)?function\s+([A-Za-z_]\w*)\s*\(/g;

function resolveImport(baseFile, spec) {
  if (!spec.startsWith(".")) return null;
  const baseDir = path.dirname(baseFile);
  const raw = path.resolve(baseDir, spec);

  const candidates = [
    raw,
    raw + ".js",
    raw + ".jsx",
    raw + ".ts",
    raw + ".tsx",
    path.join(raw, "index.js"),
    path.join(raw, "index.jsx"),
  ];

  for (const c of candidates) {
    if (exists(c)) return c;
  }

  return null;
}

function getImports(file) {
  const src = readFile(file);
  const imports = [];
  let match;
  while ((match = IMPORT_REGEX.exec(src)) !== null) {
    const resolved = resolveImport(file, match[1]);
    if (resolved) imports.push(resolved);
  }
  return imports;
}

function getImportSpecs(file) {
  const src = readFile(file);
  const imports = [];
  let match;
  while ((match = IMPORT_REGEX.exec(src)) !== null) {
    const spec = match[1];
    const resolved = resolveImport(file, spec);
    if (resolved) {
      imports.push(path.basename(resolved, path.extname(resolved)));
    } else if (!spec.startsWith(".")) {
      imports.push(spec);
    }
  }
  return imports;
}

function analyzeFile(filePath) {
  try {
    const src = readFile(filePath);
    const lines = src.split('\n').length;
    
    // Extract exports
    const exports = [];
    let match;
    const exportRegex = new RegExp(EXPORT_REGEX.source, 'g');
    while ((match = exportRegex.exec(src)) !== null) {
      exports.push(match[1]);
    }
    
    // Extract functions
    const functions = [];
    const funcRegex = new RegExp(FUNCTION_REGEX.source, 'g');
    while ((match = funcRegex.exec(src)) !== null) {
      functions.push(match[1]);
    }
    
    // Extract component props
    const propsMatch = src.match(/(?:function|const)\s+\w+\s*\(\s*\{([^}]+)\}/);
    const props = propsMatch ? propsMatch[1].split(',').map(p => p.trim()).filter(Boolean) : [];
    
    return {
      lines,
      exports,
      functions,
      props,
      imports: getImportSpecs(filePath)
    };
  } catch (err) {
    return { lines: 0, exports: [], functions: [], props: [], imports: [] };
  }
}

// ---------- MODE: tree (smart architecture) ----------

function walkDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const structure = {};
  const allFiles = [];
  
  function walk(currentPath, depth = 0) {
    if (depth > 50) return; // Prevent infinite recursion
    
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!['node_modules', 'dist', 'build', '.git', 'coverage'].includes(item)) {
            structure[fullPath] = { type: 'dir', children: [] };
            walk(fullPath, depth + 1);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(fullPath);
          if (extensions.includes(ext)) {
            const analysis = analyzeFile(fullPath);
            structure[fullPath] = { 
              type: 'file',
              ...analysis
            };
            allFiles.push(fullPath);
          }
        }
      }
    } catch (err) {
      // Skip files we can't read
    }
  }
  
  walk(dir);
  return { structure, allFiles };
}

function buildDependencyMap(structure, allFiles) {
  const depMap = {};
  const reverseDepMap = {};
  
  for (const file of allFiles) {
    const imports = getImports(file);
    depMap[file] = imports;
    
    for (const imp of imports) {
      if (!reverseDepMap[imp]) reverseDepMap[imp] = [];
      reverseDepMap[imp].push(file);
    }
  }
  
  return { depMap, reverseDepMap };
}

function categorizeFiles(dir, structure, allFiles) {
  const categories = {
    entryPoints: [],
    components: [],
    hooks: [],
    stores: [],
    utils: [],
    routes: [],
    layouts: [],
    other: []
  };
  
  for (const file of allFiles) {
    const relPath = rel(file);
    const basename = path.basename(file, path.extname(file));
    const dirname = path.dirname(relPath);
    
    // Entry points (main.jsx, App.jsx at root level)
    if ((basename === 'main' || basename === 'App') && dirname.split(path.sep).length <= 2) {
      categories.entryPoints.push(file);
    }
    // Routes
    else if (relPath.includes('routes' + path.sep) || dirname.endsWith('routes')) {
      categories.routes.push(file);
    }
    // Layouts
    else if (relPath.includes('layouts' + path.sep) || dirname.endsWith('layouts')) {
      categories.layouts.push(file);
    }
    // Hooks
    else if (relPath.includes('hooks' + path.sep) || basename.startsWith('use')) {
      categories.hooks.push(file);
    }
    // Stores
    else if (relPath.includes('store')) {
      categories.stores.push(file);
    }
    // Utils
    else if (relPath.includes('util')) {
      categories.utils.push(file);
    }
    // Components (starts with capital or in components dir)
    else if (relPath.includes('component') || /^[A-Z]/.test(basename)) {
      categories.components.push(file);
    }
    else {
      categories.other.push(file);
    }
  }
  
  return categories;
}

function detectFeatures(dir, allFiles) {
  const features = {};
  
  for (const file of allFiles) {
    const relPath = rel(file);
    const parts = relPath.split(path.sep);
    
    // Look for features/ directory
    const featuresIndex = parts.indexOf('features');
    if (featuresIndex >= 0 && parts.length > featuresIndex + 1) {
      const featureName = parts[featuresIndex + 1];
      if (!features[featureName]) {
        features[featureName] = [];
      }
      features[featureName].push(file);
    }
  }
  
  return features;
}

function detectCrossFeatureDeps(features, depMap) {
  const crossDeps = [];
  
  for (const [featureName, files] of Object.entries(features)) {
    for (const file of files) {
      const imports = depMap[file] || [];
      for (const imp of imports) {
        const impRel = rel(imp);
        const impParts = impRel.split(path.sep);
        const impFeaturesIndex = impParts.indexOf('features');
        
        if (impFeaturesIndex >= 0 && impParts.length > impFeaturesIndex + 1) {
          const impFeatureName = impParts[impFeaturesIndex + 1];
          if (impFeatureName !== featureName) {
            crossDeps.push({
              from: featureName,
              to: impFeatureName,
              file: path.basename(file),
              imports: path.basename(imp)
            });
          }
        }
      }
    }
  }
  
  return crossDeps;
}

function runTree(srcDir) {
  const abs = path.resolve(srcDir);
  
  console.log(`\n=== 🧠 CODEBRAIN ARCHITECTURE ANALYSIS ===`);
  console.log(`Project: ${path.basename(process.cwd())}`);
  
  const { structure, allFiles } = walkDirectory(abs);
  const { depMap, reverseDepMap } = buildDependencyMap(structure, allFiles);
  const categories = categorizeFiles(abs, structure, allFiles);
  const features = detectFeatures(abs, allFiles);
  const crossDeps = detectCrossFeatureDeps(features, depMap);
  
  console.log(`Files Analyzed: ${allFiles.length} | Depth: unlimited\n`);
  
  console.log(`📂 DIRECTORY STRUCTURE WITH CODE REFERENCES`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  console.log(`${path.basename(abs)}/`);
  
  // Entry Points
  if (categories.entryPoints.length > 0) {
    console.log(`├── 🎯 Entry Points (${categories.entryPoints.length})`);
    categories.entryPoints.sort().forEach((file, i) => {
      const isLast = i === categories.entryPoints.length - 1 && Object.keys(features).length === 0;
      const prefix = isLast ? '└──' : '├──';
      const info = structure[file];
      console.log(`│   ${prefix} ${path.basename(file)}`);
      console.log(`│   ${isLast ? '    ' : '│   '}📄 ${rel(file)}`);
      if (info.imports.length > 0) {
        console.log(`│   ${isLast ? '    ' : '│   '}├─ Imports: ${info.imports.slice(0, 4).join(', ')}${info.imports.length > 4 ? '...' : ''}`);
      }
      if (info.functions.length > 0) {
        console.log(`│   ${isLast ? '    ' : '│   '}└─ Functions: ${info.functions.join(', ')}`);
      }
      if (!isLast || Object.keys(features).length > 0) console.log(`│`);
    });
  }
  
  // Features
  if (Object.keys(features).length > 0) {
    console.log(`├── 📱 Features (${Object.keys(features).length})`);
    const featureNames = Object.keys(features).sort();
    
    featureNames.forEach((featureName, idx) => {
      const isLastFeature = idx === featureNames.length - 1;
      const files = features[featureName];
      const featurePrefix = isLastFeature ? '└──' : '├──';
      
      // Determine if this is a core feature (most files)
      const maxFiles = Math.max(...Object.values(features).map(f => f.length));
      const isCoreFeature = files.length === maxFiles;
      const coreMark = isCoreFeature ? ' ⭐ CORE FEATURE' : '';
      
      console.log(`│   ${featurePrefix} ${featureName}/${coreMark} (${files.length} files)`);
      
      // Categorize files within feature
      const featureComponents = files.filter(f => {
        const name = path.basename(f);
        return /^[A-Z]/.test(name) && !rel(f).includes('store') && !rel(f).includes('hook') && !rel(f).includes('util');
      });
      const featureHooks = files.filter(f => rel(f).includes('hook') || path.basename(f).startsWith('use'));
      const featureStores = files.filter(f => rel(f).includes('store'));
      const featureUtils = files.filter(f => rel(f).includes('util'));
      
      const indent = isLastFeature ? '    ' : '│   ';
      
      // Components
      if (featureComponents.length > 0) {
        console.log(`${indent}│`);
        console.log(`${indent}├── 🧩 Components (${featureComponents.length})`);
        featureComponents.forEach((file, i) => {
          const info = structure[file];
          const isLastComp = i === featureComponents.length - 1;
          const compPrefix = isLastComp ? '└──' : '├──';
          console.log(`${indent}│   ${compPrefix} ${path.basename(file)}`);
          console.log(`${indent}│   ${isLastComp ? '    ' : '│   '}📄 ${rel(file)}`);
          if (info.imports.length > 0) {
            console.log(`${indent}│   ${isLastComp ? '    ' : '│   '}├─ Imports: ${info.imports.slice(0, 3).join(', ')}${info.imports.length > 3 ? '...' : ''}`);
          }
          if (info.functions.length > 0) {
            const mainFunc = info.functions[0];
            console.log(`${indent}│   ${isLastComp ? '    ' : '│   '}└─ Key Function: ${mainFunc}() - ${info.lines} lines`);
          }
        });
      }
      
      // Hooks
      if (featureHooks.length > 0) {
        console.log(`${indent}│`);
        console.log(`${indent}├── 🎣 Hooks (${featureHooks.length})`);
        featureHooks.forEach((file, i) => {
          const info = structure[file];
          const isLastHook = i === featureHooks.length - 1;
          const hookPrefix = isLastHook ? '└──' : '├──';
          const usedBy = reverseDepMap[file] || [];
          console.log(`${indent}│   ${hookPrefix} ${path.basename(file)}`);
          console.log(`${indent}│   ${isLastHook ? '    ' : '│   '}📄 ${rel(file)}`);
          if (info.functions.length > 0) {
            console.log(`${indent}│   ${isLastHook ? '    ' : '│   '}├─ Exports: ${info.functions[0]}()`);
          }
          if (usedBy.length > 0) {
            console.log(`${indent}│   ${isLastHook ? '    ' : '│   '}└─ Used by: ${usedBy.slice(0, 2).map(f => path.basename(f)).join(', ')}${usedBy.length > 2 ? ` +${usedBy.length - 2} more` : ''}`);
          }
        });
      }
      
      // Stores
      if (featureStores.length > 0) {
        console.log(`${indent}│`);
        console.log(`${indent}├── 💾 Stores (${featureStores.length})`);
        featureStores.forEach((file, i) => {
          const info = structure[file];
          const isLastStore = i === featureStores.length - 1;
          const storePrefix = isLastStore ? '└──' : '├──';
          const usedBy = reverseDepMap[file] || [];
          const isHighCoupling = usedBy.length >= 5;
          console.log(`${indent}│   ${storePrefix} ${path.basename(file)}${isHighCoupling ? ' ⚠️ HIGH COUPLING' : ''}`);
          console.log(`${indent}│   ${isLastStore ? '    ' : '│   '}📄 ${rel(file)}`);
          if (usedBy.length > 0) {
            console.log(`${indent}│   ${isLastStore ? '    ' : '│   '}└─ Used by: ${usedBy.length} file${usedBy.length > 1 ? 's' : ''}`);
            usedBy.forEach(f => {
              console.log(`${indent}│   ${isLastStore ? '    ' : '│   '}    - ${path.basename(f)}`);
            });
          }
        });
      }
      
      // Utils
      if (featureUtils.length > 0) {
        console.log(`${indent}│`);
        console.log(`${indent}└── 🛠️ Utils (${featureUtils.length})`);
        featureUtils.forEach((file, i) => {
          const info = structure[file];
          const isLastUtil = i === featureUtils.length - 1;
          const utilPrefix = isLastUtil ? '└──' : '├──';
          const usedBy = reverseDepMap[file] || [];
          console.log(`${indent}    ${utilPrefix} ${path.basename(file)}`);
          console.log(`${indent}    ${isLastUtil ? '    ' : '│   '}📄 ${rel(file)}`);
          if (info.functions.length > 0) {
            console.log(`${indent}    ${isLastUtil ? '    ' : '│   '}├─ Exports: ${info.functions.slice(0, 2).join(', ')}${info.functions.length > 2 ? '...' : ''}`);
          }
          if (usedBy.length > 0) {
            console.log(`${indent}    ${isLastUtil ? '    ' : '│   '}└─ Used by: ${usedBy.map(f => path.basename(f)).join(', ')}`);
          }
        });
      }
      
      if (!isLastFeature) console.log(`│`);
    });
  }
  
  // Routes
  if (categories.routes.length > 0) {
    console.log(`│`);
    console.log(`├── 🗺️  Routes (${categories.routes.length})`);
    categories.routes.sort().forEach((file, i) => {
      const info = structure[file];
      const isLast = i === categories.routes.length - 1;
      const prefix = isLast ? '└──' : '├──';
      console.log(`│   ${prefix} ${path.basename(file)}`);
      console.log(`│   ${isLast ? '    ' : '│   '}📄 ${rel(file)}`);
      if (info.imports.length > 0) {
        console.log(`│   ${isLast ? '    ' : '│   '}└─ Imports: ${info.imports.slice(0, 4).join(', ')}${info.imports.length > 4 ? '...' : ''}`);
      }
    });
  }
  
  // Layouts
  if (categories.layouts.length > 0) {
    console.log(`│`);
    console.log(`└── 🎨 Layouts (${categories.layouts.length})`);
    categories.layouts.sort().forEach((file, i) => {
      const info = structure[file];
      const isLast = i === categories.layouts.length - 1;
      const prefix = isLast ? '└──' : '├──';
      const mainImport = info.imports.find(imp => 
        imp.toLowerCase().includes('proximity') || 
        imp.toLowerCase().includes('dashboard') ||
        imp.toLowerCase().includes('menu')
      );
      console.log(`    ${prefix} ${path.basename(file)}${mainImport ? ` → ${mainImport}` : ''}`);
      console.log(`    ${isLast ? '    ' : '│   '}📄 ${rel(file)}`);
      if (info.functions.length > 0) {
        console.log(`    ${isLast ? '    ' : '│   '}└─ Key Function: ${info.functions[0]}() - ${info.lines} lines`);
      }
    });
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // Dependency insights
  console.log(`🔗 DEPENDENCY INSIGHTS`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // Find hot spots (excluding CSS modules)
  const hotSpots = Object.entries(reverseDepMap)
    .map(([file, deps]) => ({ file, count: deps.length }))
    .filter(item => item.count >= 3 && !path.basename(item.file).includes('.module.'))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  if (hotSpots.length > 0) {
    console.log(`⚠️  HOT SPOTS (High Coupling):`);
    hotSpots.forEach((spot, i) => {
      console.log(`  ${i + 1}. ${path.basename(spot.file)} → ${spot.count} imports`);
      if (spot.count >= 6) {
        console.log(`     Consider: Splitting into smaller modules\n`);
      }
    });
  }
  
  // Cross-feature dependencies
  if (crossDeps.length > 0) {
    const uniqueCrossDeps = [];
    const seen = new Set();
    for (const dep of crossDeps) {
      const key = `${dep.from}->${dep.to}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueCrossDeps.push(dep);
      }
    }
    
    console.log(`\n⚠️  CROSS-FEATURE DEPENDENCIES (${uniqueCrossDeps.length}):`);
    uniqueCrossDeps.forEach(dep => {
      console.log(`  ${dep.from}/ → ${dep.to}/ (${dep.file} imports ${dep.imports})`);
    });
  }
  
  // Find isolated features
  const isolatedFeatures = Object.entries(features).filter(([name, files]) => {
    return files.every(file => {
      const imports = depMap[file] || [];
      return imports.every(imp => {
        const impRel = rel(imp);
        return impRel.includes(`features${path.sep}${name}`) || !impRel.includes('features');
      });
    });
  });
  
  if (isolatedFeatures.length > 0) {
    console.log(`\n✅ WELL-ISOLATED FEATURES:`);
    isolatedFeatures.forEach(([name]) => {
      console.log(`  - ${name}/ (no external feature dependencies)`);
    });
  }
  
  // Feature sizes
  console.log(`\n📊 FEATURE SIZE:`);
  Object.entries(features)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([name, files]) => {
      const percentage = Math.round((files.length / allFiles.length) * 100);
      const bar = '█'.repeat(Math.floor(percentage / 5));
      console.log(`  ${name.padEnd(20)} ${files.length.toString().padStart(2)} files (${percentage}%) ${bar}`);
    });
  
  console.log(`\n=== Analysis complete ===\n`);
}

// ---------- MODE: map (dependency graph) ----------

function crawlImports(entryFile, maxDepth) {
  const graph = {};
  const visited = new Set();

  function walk(file, depth) {
    if (depth > maxDepth) return;
    if (visited.has(file)) return;
    visited.add(file);

    const imports = getImports(file);
    graph[file] = imports;
    imports.forEach((imp) => walk(imp, depth + 1));
  }

  walk(entryFile, 0);
  return graph;
}

function printGraph(entryFile, graph, maxDepth) {
  function printNode(file, depth, seen = new Set()) {
    if (depth > maxDepth || seen.has(file)) return;
    seen.add(file);
    const indent = "  ".repeat(depth);
    console.log(`${indent}- ${rel(file)}`);
    const imports = graph[file] || [];
    imports.forEach((child) => printNode(child, depth + 1, seen));
  }
  printNode(entryFile, 0);
}

function runMap(entryFile, depth) {
  const abs = path.resolve(entryFile);
  const maxDepth = depth === undefined ? 999 : depth; // unlimited by default
  console.log(`\n=== CODEBRAIN MAP (depth ${maxDepth === 999 ? 'unlimited' : maxDepth}) ===\n`);
  const graph = crawlImports(abs, maxDepth);
  printGraph(abs, graph, maxDepth);
  console.log(`\n=== END MAP ===\n`);
}

// ---------- MODE: full (entry + imports source dump) ----------

function collectImportClosure(entryFile, maxDepth) {
  const files = new Set();
  const visited = new Set();

  function walk(file, depth) {
    if (depth > maxDepth || visited.has(file)) return;
    visited.add(file);
    files.add(file);
    const imports = getImports(file);
    imports.forEach((imp) => walk(imp, depth + 1));
  }

  walk(entryFile, 0);
  return Array.from(files);
}

function runFull(entryFile, depth) {
  const abs = path.resolve(entryFile);
  const maxDepth = depth === undefined ? 999 : depth;
  const files = collectImportClosure(abs, maxDepth);
  const outName = `codebrain-full-${path.basename(entryFile).replace(/[^\w.-]/g, "_")}.md`;

  let md = `# Codebrain Full Dump\nEntry: ${rel(abs)}\nDepth: ${maxDepth === 999 ? 'unlimited' : maxDepth}\n\n`;

  for (const f of files) {
    md += `---\n## FILE: ${rel(f)}\n\n`;
    md += "```js\n" + readFile(f) + "\n```\n\n";
  }

  fs.writeFileSync(outName, md);
  console.log(`\n✅ Full dump written to ${outName}\n`);
}

// ---------- MODE: func (single-function call analysis) ----------

function findFunctionBlock(source, fnName) {
  const fnRe = new RegExp(`\\b(?:export\\s+)?function\\s+${fnName}\\s*\\(`);
  const m = fnRe.exec(source);
  if (!m) return null;

  const startIndex = m.index;
  const braceStart = source.indexOf("{", m.index);
  if (braceStart === -1) return null;

  let depth = 0;
  let endIndex = source.length;
  for (let i = braceStart; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }

  const before = source.slice(0, startIndex);
  const block = source.slice(startIndex, endIndex);
  const startLine = before.split("\n").length;
  const endLine = startLine + block.split("\n").length - 1;

  return { startLine, endLine, code: block };
}

const KEYWORDS = new Set([
  "if",
  "for",
  "while",
  "switch",
  "return",
  "function",
  "async",
  "await",
  "const",
  "let",
  "var",
  "new",
  "class",
  "typeof",
]);

function findCallsInBlock(code, fnName) {
  const re = /\b([A-Za-z_]\w*)\s*\(/g;
  const calls = new Set();
  let m;
  while ((m = re.exec(code)) !== null) {
    const name = m[1];
    if (name === fnName) continue;
    if (KEYWORDS.has(name)) continue;
    calls.add(name);
  }
  return Array.from(calls);
}

function runFunc(file, fnName) {
  const abs = path.resolve(file);
  const src = readFile(abs);
  const block = findFunctionBlock(src, fnName);

  if (!block) {
    console.error(`Could not find function "${fnName}" in ${rel(abs)}`);
    process.exit(1);
  }

  const calls = findCallsInBlock(block.code, fnName);

  console.log(`\n=== FUNCTION ANALYSIS ===`);
  console.log(`File:    ${rel(abs)}`);
  console.log(`Function "${fnName}"  (lines ${block.startLine}-${block.endLine})\n`);
  console.log(block.code);
  console.log(`\nCalls detected:`);
  if (calls.length === 0) {
    console.log("  (none)");
  } else {
    calls.forEach((c) => console.log(`  - ${c}()`));
  }
  console.log(`\n=== END FUNCTION ANALYSIS ===\n`);
}

// ---------- MODE: slice (markdown bundle for AI) ----------

function runSlice(file, fnName, depth) {
  const abs = path.resolve(file);
  const src = readFile(abs);
  const block = findFunctionBlock(src, fnName);

  if (!block) {
    console.error(`Could not find function "${fnName}" in ${rel(abs)}`);
    process.exit(1);
  }

  const calls = findCallsInBlock(block.code, fnName);

  const outName = `codebrain-slice-${fnName}.md`;
  let md = `# Codebrain Slice: ${fnName}\n`;
  md += `File: ${rel(abs)}\n`;
  md += `Lines: ${block.startLine}-${block.endLine}\n`;
  md += `Depth (local calls only): ${depth}\n\n`;

  md += `## Function: ${fnName}\n\n`;
  md += "```js\n" + block.code + "\n```\n\n";

  md += "## Calls\n\n";
  if (calls.length === 0) {
    md += "_No calls detected._\n";
  } else {
    calls.forEach((c) => {
      md += `- \`${c}()\`\n`;
    });
  }

  md += `\n> NOTE: This slice is intra-file only. For full architecture, run:\n`;
  md += `> \`node tools/codebrain.mjs map ${rel(abs)}\`\n`;

  fs.writeFileSync(outName, md);
  console.log(`\n✅ Slice written to ${outName}\n`);
}

// ---------- CLI routing ----------

function printUsage() {
  console.log(`
codebrain.mjs - Smart Architecture Analyzer

Usage:
  node tools/codebrain.mjs tree <src-directory>
  node tools/codebrain.mjs map  <entry-file> [depth]
  node tools/codebrain.mjs full <entry-file> [depth]
  node tools/codebrain.mjs func <file> <functionName>
  node tools/codebrain.mjs slice <file> <functionName>

Modes:
  tree  - Smart architecture view with code references (unlimited depth)
  map   - Dependency tree (unlimited depth by default)
  full  - Full source dump as markdown (unlimited depth by default)
  func  - Single function analysis with calls
  slice - Markdown bundle for AI context
`);
}

const [,, mode, arg1, arg2, arg3] = process.argv;

if (!mode) {
  printUsage();
  process.exit(0);
}

switch (mode) {
  case "tree": {
    if (!arg1) {
      console.error("tree mode requires <src-directory>");
      printUsage();
      process.exit(1);
    }
    runTree(arg1);
    break;
  }
  case "map": {
    if (!arg1) {
      console.error("map mode requires <entry-file>");
      printUsage();
      process.exit(1);
    }
    const depth = arg2 ? parseInt(arg2, 10) : undefined;
    runMap(arg1, depth);
    break;
  }
  case "full": {
    if (!arg1) {
      console.error("full mode requires <entry-file>");
      printUsage();
      process.exit(1);
    }
    const depth = arg2 ? parseInt(arg2, 10) : undefined;
    runFull(arg1, depth);
    break;
  }
  case "func": {
    if (!arg1 || !arg2) {
      console.error("func mode requires <file> <functionName>");
      printUsage();
      process.exit(1);
    }
    runFunc(arg1, arg2);
    break;
  }
  case "slice": {
    if (!arg1 || !arg2) {
      console.error("slice mode requires <file> <functionName>");
      printUsage();
      process.exit(1);
    }
    const depth = arg3 ? parseInt(arg3, 10) : 1;
    runSlice(arg1, arg2, depth);
    break;
  }
  default:
    console.error(`Unknown mode: ${mode}`);
    printUsage();
    process.exit(1);
}
