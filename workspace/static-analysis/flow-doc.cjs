#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const ROOT_DIR = process.argv[2] || 'src';

// -------------------------
// Walk Directory (ignore node_modules, dist, .git, and .d.ts)
// -------------------------
function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === 'build'
      ) {
        continue;
      }
      walkDir(full, fileList);
    } else {
      if (
        /\.(js|jsx|ts|tsx)$/.test(entry.name) &&
        !entry.name.endsWith('.d.ts')
      ) {
        fileList.push(full);
      }
    }
  }
  return fileList;
}

// -------------------------
// Parse
// -------------------------
function parseFile(code, filePath) {
  try {
    return parser.parse(code, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'dynamicImport',
        'optionalChaining',
        'nullishCoalescingOperator',
      ],
    });
  } catch (e) {
    console.error('Parse error in:', filePath, e.message);
    return null;
  }
}

// -------------------------
// Extract callee names
// -------------------------
function getCalleeName(node) {
  if (!node) return '<?>';

  if (node.type === 'Identifier') {
    return node.name;
  }

  if (node.type === 'MemberExpression') {
    const obj = getCalleeName(node.object);
    const prop =
      node.property.type === 'Identifier'
        ? node.property.name
        : node.property.type === 'Literal'
        ? String(node.property.value)
        : '<?>';
    return `${obj}.${prop}`;
  }

  if (node.type === 'OptionalMemberExpression') {
    const obj = getCalleeName(node.object);
    const prop =
      node.property.type === 'Identifier'
        ? node.property.name
        : '<?>';
    return `${obj}?.${prop}`;
  }

  if (node.type === 'CallExpression') {
    return getCalleeName(node.callee);
  }

  return '<?>'
}

// -------------------------
// Analyze File
// -------------------------
function analyzeFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = parseFile(code, filePath);
  if (!ast) return null;

  const funcs = new Map();

  function ensure(name) {
    if (!funcs.has(name)) {
      funcs.set(name, { name, callees: new Set() });
    }
    return funcs.get(name);
  }

  const normalized = filePath.replace(/\\/g, '/');

  // Pseudo entry for main.jsx so Boot Flow has something meaningful
  if (
    normalized.endsWith('src/main.jsx') ||
    normalized.endsWith('src/main.js')
  ) {
    const entry = ensure('mainEntry');
    if (code.includes('createRoot')) entry.callees.add('createRoot');
    if (code.includes('.render(') || code.includes('render(')) {
      entry.callees.add('render');
    }
    if (code.match(/<App\b/)) entry.callees.add('App');
  }

  // ---- Capture function definitions ----
  traverse(ast, {
    FunctionDeclaration(path) {
      const name = path.node.id?.name || '<anonymous>';
      ensure(name);
    },

    VariableDeclarator(path) {
      const init = path.node.init;
      if (
        init &&
        (init.type === 'ArrowFunctionExpression' ||
          init.type === 'FunctionExpression')
      ) {
        if (path.node.id.type === 'Identifier') {
          ensure(path.node.id.name);
        }
      }
    },

    ClassMethod(path) {
      const className = path.parentPath.node.id?.name || '<class>';
      const method = path.node.key.name || '<method>';
      ensure(`${className}.${method}`);
    },

    ObjectMethod(path) {
      const method = path.node.key.name || '<objectMethod>';
      ensure(`<object>.${method}`);
    },
  });

  // ---- Capture calls inside functions ----
  traverse(ast, {
    CallExpression(path) {
      const func = path.getFunctionParent();
      if (!func) return;

      let name = '<anonymous>';

      if (func.node.type === 'FunctionDeclaration') {
        name = func.node.id?.name || name;
      } else if (
        func.node.type === 'ArrowFunctionExpression' ||
        func.node.type === 'FunctionExpression'
      ) {
        const parent = func.parentPath.node;
        if (
          parent.type === 'VariableDeclarator' &&
          parent.id.type === 'Identifier'
        ) {
          name = parent.id.name;
        }
      } else if (func.node.type === 'ClassMethod') {
        const cls = func.parentPath.node.id?.name || '<class>';
        const method = func.node.key.name || '<method>';
        name = `${cls}.${method}`;
      } else if (func.node.type === 'ObjectMethod') {
        const method = func.node.key.name || '<objectMethod>';
        name = `<object>.${method}`;
      }

      const info = funcs.get(name);
      if (info) {
        const callee = getCalleeName(path.node.callee);
        info.callees.add(callee);
      }
    },
  });

  return {
    filePath: normalized,
    functions: Array.from(funcs.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
  };
}

// -------------------------
// Categorization (Flows)
// -------------------------
const CATEGORY_ORDER = [
  'Boot & Routing Flow',
  'Dynamic Island Flow',
  'Proximity Flow',
  'Notification Flow',
  'Profile Flow',
  'Settings Flow',
  'Loading Flow',
  'Menu & Navigation Flow',
  'Activity & History Flow',
  'Utils & Infra Flow',
  'Misc Flow',
];

function getCategory(filePath) {
  const p = filePath.replace(/\\/g, '/');

  if (
    p.endsWith('src/main.jsx') ||
    p.endsWith('src/main.js') ||
    p.endsWith('src/App.jsx') ||
    p.includes('src/layouts/') ||
    p.includes('src/routes/')
  ) {
    return 'Boot & Routing Flow';
  }

  if (p.includes('features/dynamicIsland/')) {
    return 'Dynamic Island Flow';
  }

  if (p.includes('features/proximity/')) {
    return 'Proximity Flow';
  }

  if (p.includes('features/notifications/')) {
    return 'Notification Flow';
  }

  if (p.includes('features/profile/')) {
    return 'Profile Flow';
  }

  if (p.includes('features/settings/')) {
    return 'Settings Flow';
  }

  if (p.includes('features/loading/')) {
    return 'Loading Flow';
  }

  if (p.includes('features/menu/')) {
    return 'Menu & Navigation Flow';
  }

  if (
    p.includes('features/notifications/store/activityStore') ||
    p.includes('features/proximity/store/proximityHitsStore') ||
    p.includes('routes/ActivityHistory.jsx')
  ) {
    return 'Activity & History Flow';
  }

  if (p.includes('utils/') || p.includes('features/errors/')) {
    return 'Utils & Infra Flow';
  }

  return 'Misc Flow';
}

// -------------------------
// Helper: decide if a callee is "noise"
// -------------------------
function isNoiseCallee(name) {
  if (!name) return true;
  if (
    name.startsWith('console.') ||
    name.startsWith('Math.') ||
    name.startsWith('ctx.') ||
    name.startsWith('document.') ||
    name.startsWith('window.')
  ) {
    return true;
  }
  if (
    name === 'requestAnimationFrame' ||
    name === 'cancelAnimationFrame' ||
    name === 'setTimeout' ||
    name === 'clearTimeout' ||
    name === 'setInterval' ||
    name === 'clearInterval' ||
    name === 'alert' ||
    name === 'prompt' ||
    name === 'confirm'
  ) {
    return true;
  }
  return false;
}

// -------------------------
// Output Format
// -------------------------
function printFlow(results) {
  console.log('# FLOW CHEAT SHEET\n');
  console.log('Legend:');
  console.log('- Names with `()` are functions or components.');
  console.log('- `<object>.method()` = methods on an exported store/actions object.');
  console.log('- `→` means "calls" or "depends on".');
  console.log('- Sections group files by feature/domain.');
  console.log('- This doc is a *code flow map*, not a full data model.\n');

  const byCategory = new Map();
  for (const file of results) {
    if (!file) continue;
    const category = getCategory(file.filePath);
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push(file);
  }

  for (const category of CATEGORY_ORDER) {
    const files = byCategory.get(category);
    if (!files || files.length === 0) continue;

    console.log(`## ${category}\n`);

    files.sort((a, b) => a.filePath.localeCompare(b.filePath));

    for (const file of files) {
      if (!file.functions || file.functions.length === 0) continue;

      const rel = path.relative(process.cwd(), file.filePath);
      console.log(`### ${rel}`);

      const isStoreFile = rel.includes('/store/');
      const isMockFile = rel.toLowerCase().includes('mock');

      if (isStoreFile) {
        console.log('// STORE (stateful, writes via setStore)\n');
      } else if (isMockFile) {
        console.log('// MOCK / SIMULATION\n');
      }

      for (const fn of file.functions) {
        const hasCallees = fn.callees.size > 0;
        const isComponentName = /^[A-Z]/.test(fn.name);
        const isInterestingName = /^(handle|use|select|toggle|send|initialize|add|update|set|show|clear|start|stop|get)/i.test(
          fn.name
        );

        if (!hasCallees && !isComponentName && !isInterestingName) {
          continue;
        }

        // DEV / MOCK hints
        const calleesArray = Array.from(fn.callees);
        const usesConsole = calleesArray.some((c) => c && c.startsWith('console.'));
        const usesMockProfiles = calleesArray.some((c) =>
          c && c.toLowerCase().includes('mock')
        );

        let fnLine = `${fn.name}()`;
        if (usesConsole) fnLine += '  // DEV LOGGING';
        if (usesMockProfiles || isMockFile) fnLine += '  // MOCK / SIMULATION';

        console.log(fnLine);

        if (!hasCallees) continue;

        for (const callee of calleesArray) {
          if (isNoiseCallee(callee)) continue;
          console.log(`  → ${callee}()`);
        }
      }

      console.log();
    }
  }
}

// -------------------------
// MAIN
// -------------------------
function main() {
  const files = walkDir(ROOT_DIR);
  const results = files.map(analyzeFile).filter(Boolean);
  printFlow(results);
}

main();
