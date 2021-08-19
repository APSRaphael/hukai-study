(function(modulesInfo){
			function require(modulePath){

				function newRequire(relativePath){
					return	require(modulesInfo[modulePath].dependencies[relativePath])
				}

				const exports = {};

				(function(require, code){ 
					eval(code) 
					// require('./other.js) --> newRequire('./other.js')
				})(newRequire, modulesInfo[modulePath].code)
				
				return exports;
			}

			require('./src/index.js');

		})({"./src/index.js":{"dependencies":{"./other.js":"./src/other.js"},"code":"\"use strict\";\n\nvar _other = require(\"./other.js\");\n\nconsole.log('hello world :>> ', _other.str); // hk-log"},"./src/other.js":{"dependencies":{"./a.js":"./src/a.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str = void 0;\n\nvar _a = require(\"./a.js\");\n\nvar str = 'dff' + _a.a;\nexports.str = str;"},"./src/a.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.a = void 0;\nvar a = 'a';\nexports.a = a;"}})