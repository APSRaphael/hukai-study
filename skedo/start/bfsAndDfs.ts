import jsdom from "jsdom";

const dom = new jsdom.JSON(`<!DOCTYPE html>
<body>
<div>
<div>
<span>
</span>
<span>
</span>
</div>
<a />
<div>
<span>
</span>
<span>
</span>
</div>
</div>
</body>`);

const body = dom.window.document.body;

function* bfs(node: Element): Generator<Element> {}

function* dfs(node: Element): Generator<Element> {
	const queue = new Array<Element>(1000);
	let i = 0,
		j = 0;
	queue[j++] = node;
	while (i !== j) {
		const node = queue[i++];
		yield node;
		if (node.children) {
			for (let k = 0; k < node.children.length; k++) {
				const child = node.children[k];
				queue[j++] = child;
			}
		}
	}
}

console.log("bfs :>> "); // hk-log
// for(const node of bfs(body)){
//     console.log(node.tagName)
// }

console.log("dfs :>> "); // hk-log
for (const node of dfs(body)) {
	console.log(node.tagName);
}
