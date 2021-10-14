const { resolve } = require('path');
const fs = require('fs');
module.exports.getRouter = (path = resolve('./')) => {
	// ##BEGIN##
	const list = fs.readdirSync(path);
	console.log('list :>> ', list); // hk-log
	return `
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
${list
	.map(
		(item) =>
			`{
    path: '/${item.replace('.vue', '')}',
    name: '${item.replace('.vue', '')}',
    component: () => import('./views/${item}')
},
`
	)
	.join('')}
    ]
})`;
	// ##END##
};

// export default new Router({
//     mode: 'history',
//     base: process.env.BASE_URL,
//     routes: [
// ${list.map(file =>
// `{
//     path: '/${file.replace('.vue','')}',
//     name: '${file.replace('.vue','')}',
//     component: () => import('./views/${file}')
// },
// `).join('')}
//     ]
// })
