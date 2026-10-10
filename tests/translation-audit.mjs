/**
 * Translation integrity audit.
 * Walks every localized dataset and reports nodes where a supported
 * language is missing, empty, or a verbatim copy of the English source
 * (which usually means the translation step silently failed).
 *
 * Usage: node tests/translation-audit.mjs [--verbose]
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const VERBOSE = process.argv.includes('--verbose');

// Keep in sync with src/data/languages.ts
const SUPPORTED = [
    'tr', 'en', 'ar', 'ru', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'ro', 'bg',
    'el', 'sr', 'uk', 'ka', 'az', 'uz', 'kk', 'fa', 'hi', 'ur', 'bn', 'zh-cn',
    'ja', 'ko', 'id', 'ms', 'sw',
];

async function loadTypeScript(file, exportName) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const output = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const loadedModule = { exports: {} };
    vm.runInNewContext(
        `(function(exports,module,require){${output}\n})(loadedModule.exports,loadedModule,()=>({}))`,
        { loadedModule },
    );
    return loadedModule.exports[exportName];
}

const files = [
    { file: '../src/data/translationsData.ts', exportName: 'translationsData', label: 'UI dictionary' },
    { file: '../src/data/products.ts', exportName: 'productsData', label: 'products' },
    { file: '../src/data/insights.ts', exportName: 'insightArticles', label: 'insights' },
    { file: '../src/data/countries.ts', exportName: 'exportCountriesData', label: 'countries' },
];

/** Detect nodes shaped like Record<Locale, string | string[]> that need per-language content. */
function findLocalizedNodes(value, nodes = [], path = []) {
    if (!value || typeof value !== 'object') return nodes;
    if (!Array.isArray(value)) {
        const keys = Object.keys(value);
        if (keys.includes('en')) {
            const en = value.en;
            if (typeof en === 'string' || Array.isArray(en)) {
                nodes.push({ path: path.join('.') || '(root)', node: value });
                return nodes;
            }
        }
        for (const [key, item] of Object.entries(value)) {
            if (['slug', 'id'].includes(key)) continue;
            findLocalizedNodes(item, nodes, [...path, key]);
        }
        return nodes;
    }
    value.forEach((item, index) => findLocalizedNodes(item, nodes, [...path, index]));
    return nodes;
}

function normalize(text) {
    if (Array.isArray(text)) return text.join('\n').replace(/\s+/g, ' ').trim().toLowerCase();
    return String(text).replace(/\s+/g, ' ').trim().toLowerCase();
}

let totalIssues = 0;
const report = [];

for (const { file, exportName, label } of files) {
    const data = await loadTypeScript(file, exportName);
    const nodes = findLocalizedNodes(data);
    const missing = {};
    const identicalToEn = {};

    for (const { path, node } of nodes) {
        const enValue = normalize(node.en);
        for (const lang of SUPPORTED) {
            const value = node[lang];
            if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
                (missing[lang] ??= []).push(path);
            } else if (lang !== 'en' && normalize(value) === enValue && enValue.length > 0) {
                const isUniversalCountryName = path.endsWith('.name') && [
                    'qatar', 'kuwait', 'india', 'malaysia', 'indonesia', 'france',
                    'austria', 'russia', 'singapore', 'bulgaria', 'romania', 'iraq',
                    'poland', 'belgium', 'switzerland', 'united kingdom', 'ukraine'
                ].includes(enValue);
                if (!isUniversalCountryName) {
                    (identicalToEn[lang] ??= []).push(path);
                }
            }
        }
    }

    const missingCount = Object.values(missing).reduce((sum, list) => sum + list.length, 0);
    const identicalCount = Object.values(identicalToEn).reduce((sum, list) => sum + list.length, 0);
    totalIssues += missingCount + identicalCount;

    report.push({ label, file, nodes: nodes.length, missing, identicalToEn, missingCount, identicalCount });
}

for (const entry of report) {
    console.log(`\n=== ${entry.label} (${entry.file}) — ${entry.nodes} localized nodes ===`);
    const missingLangs = Object.keys(entry.missing);
    if (missingLangs.length) {
        for (const lang of missingLangs) {
            console.log(`  MISSING [${lang}]: ${entry.missing[lang].length}`);
            if (VERBOSE) entry.missing[lang].slice(0, 20).forEach((p) => console.log(`    - ${p}`));
        }
    } else {
        console.log('  missing: none');
    }
    const identicalLangs = Object.keys(entry.identicalToEn);
    if (identicalLangs.length) {
        for (const lang of identicalLangs) {
            console.log(`  IDENTICAL-TO-EN [${lang}]: ${entry.identicalToEn[lang].length}`);
            if (VERBOSE) entry.identicalToEn[lang].slice(0, 10).forEach((p) => console.log(`    - ${p}`));
        }
    } else {
        console.log('  identical-to-en: none');
    }
}

console.log(`\nTOTAL ISSUES: ${totalIssues}`);
if (totalIssues > 0) process.exitCode = 1;
else console.log('All translations complete.');
