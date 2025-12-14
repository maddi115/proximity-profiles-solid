#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const ROOT_DIR = process.argv[2] || 'src';

// -------------------------
// Walk Directory
// -------------------------
function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, fileList);
    else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) fileList.push(full);
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
        'optionalChaining',
        'nullishCoalescingOperator',
      ],
    });
  } catch (e) {
    console.error("Parse error in:", filePath, e.message);
    return null;
  }
}

// -------------------------
// Extract callee names
// -------------------------
function getCalleeName(node) {
  if (!node) return '<?>';

  if (node.type === 'Identifier') return node.name;

  if (node.type === 'MemberExpression') {
    const obj = getCalleeName(node.object);
    const prop = node.property.name || '<?>';
    return `${obj}.${prop}`;
  }

  if (node.type === 'OptionalMemberExpression') {
    const obj = getCalleeName(node.object);
    const prop = node.property.name || '<?>';
    return `${obj}?.${prop}`;
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
    if (!funcs.has(name)) funcs.set(name, { name, callees: new Set() });
    return funcs.get(name);
  }

  // ---- Capture function declarations ----
  traverse(ast, {
    FunctionDeclaration(path) {
      const name = path.node.id?.name || '<anonymous>';
      ensure(name);
    },

    VariableDeclarator(path) {
      if (
        path.node.init &&
        (path.node.init.type === 'ArrowFunctionExpression' ||
          path.node.init.type === 'FunctionExpression')
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
        if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
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
    filePath,
    functions: [...funcs.values()],
  };
}

// -------------------------
// Output Format
// -------------------------
function printFlow(results) {
  console.log("# FLOW CHEAT SHEET\n");

  for (const file of results) {
    if (!file || file.functions.length === 0) continue;

    console.log(`## File: ${file.filePath}`);

    for (const fn of file.functions) {
      console.log(`${fn.name}()`);

      for (const callee of fn.callees) {
        console.log(`  → ${callee}()`);
      }
    }

    console.log();
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
