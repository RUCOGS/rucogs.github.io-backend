const { src, dest } = require('gulp');
const { relative, extname, join } = require('path');
const { getParsedCommandLineOfConfigFile, sys, ScriptKind, Extension } = require('typescript');
const glob = require("glob");

function asExtension(extension) {
  return { extension, scriptKind: ScriptKind.Deferred };
}

async function assets() {
  // File extensions we want to copy as assets.
  const assetExtensions = ['.png', '.jpg', '.html', '.scss', '.css', '.json', '.jsonc'];

  // Let Typescript handle these file extensions and retrieve all other files with the given asset extensions.
  const typescriptExtensions = [Extension.Ts, Extension.Tsx, Extension.Js, Extension.Jsx];
  const parsed = getParsedCommandLineOfConfigFile('tsconfig.json', {}, sys, undefined, undefined, assetExtensions.map(asExtension));
  
  const assetFiles = glob.sync("src/**/*", { nodir: true }).filter(fileName => !typescriptExtensions.includes(extname(fileName)));

	console.log(assetFiles);
	console.log(parsed.options.rootDir + " -> " + parsed.options.outDir);

  const base = relative(parsed.options.baseUrl, parsed.options.rootDir);

  return src(assetFiles, { base, cwd: parsed.options.baseUrl }).pipe(dest(parsed.options.outDir))
}

module.exports = { assets };