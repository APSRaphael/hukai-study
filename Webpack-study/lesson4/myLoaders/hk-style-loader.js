module.exports = function (source) {

    console.log('source :>> ', source); // hk-log
	return `
        const tag = document.createElement('style');
        tag.innerHTML = ${source};
        document.head.appendChild(tag);
    `;
};
