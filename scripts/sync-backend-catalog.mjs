import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

function propertyStrings(source, name) {
  const values = [];
  const file = ts.createSourceFile('data.ts', source, ts.ScriptTarget.Latest, true);
  function walk(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(file) === name && ts.isStringLiteral(node.initializer)) values.push(node.initializer.text);
    ts.forEachChild(node, walk);
  }
  walk(file);
  return values;
}
const productsSource = await readFile(new URL('../src/data/products.ts', import.meta.url), 'utf8');
const languagesSource = await readFile(new URL('../src/data/languages.ts', import.meta.url), 'utf8');
const source = ts.createSourceFile('products.ts', productsSource, ts.ScriptTarget.Latest, true);
const declaration = source.statements.find(ts.isVariableStatement)?.declarationList.declarations[0];
const products = declaration.initializer.elements.map((element) => element.properties.find((property) => property.name?.getText(source) === 'id').initializer.text);
await writeFile(new URL('../functions/catalog.json', import.meta.url), `${JSON.stringify({ products, languages: propertyStrings(languagesSource, 'code') }, null, 2)}\n`);
console.log(`Synced backend catalog: ${products.length} products, ${propertyStrings(languagesSource, 'code').length} languages.`);
