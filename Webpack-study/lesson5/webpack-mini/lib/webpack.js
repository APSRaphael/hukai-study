const fs = require('fs');
const { transformFromAst } = require('@babel/core');
const BabelParser = require('@babel/parser');

const traverse = require('@babel/traverse').default;
const path = require('path');
module.exports = class webpack {
	constructor(options) {
		// console.log('options :>> ', options); // hk-log
		this.entry = options.entry;
		this.output = options.output;
		this.modulesInfo = [];
	}

	run() {
		const moduleParserInfo = this.parser(this.entry);
		this.modulesInfo.push(moduleParserInfo);

		for (let i = 0; i < this.modulesInfo.length; i++) {
			const dependencies = this.modulesInfo[i].dependencies;
			if (dependencies) {
				for (const j in dependencies) {
					this.modulesInfo.push(this.parser(dependencies[j]));
				}
			}
		}
		console.log(' this.modulesInfo:>> ', this.modulesInfo); // hk-log
		const obj = {};
		this.modulesInfo.forEach((item) => {
			obj[item.modulePath] = {
				dependencies: item.dependencies,
				code: item.code,
			};
		});
		console.log('obj :>> ', obj); // hk-log
	}

	parser(modulePath) {
		const content = fs.readFileSync(modulePath, 'utf-8');
		const ast = BabelParser.parse(content, { sourceType: 'module' });
		const dependencies = {};
		traverse(ast, {
			ImportDeclaration({ node }) {
				const newPath =
					'./' + path.join(path.dirname(modulePath), node.source.value);

				dependencies[node.source.value] = newPath;
			},
		});
		const { code } = transformFromAst(ast, null, {
			presets: ['@babel/preset-env'],
		});
		console.log('code :>> ', code); // hk-log

		return {
			modulePath,
			dependencies,
			code,
		};
	}
};
