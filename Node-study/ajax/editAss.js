const fs = require('fs');
const path = require('path');

const folderPath = './subtitles/';

// 读取文件夹中的文件
fs.readdir(folderPath, function (err, files) {
	if (err) throw err;

	// 遍历文件夹中的文件
	files.forEach(function (file) {
		// 判断文件是否为 .ass 文件
		if (path.extname(file) === '.ass') {
			// 读取 .ass 文件
			fs.readFile(folderPath + file, 'utf8', function (err, data) {
				if (err) throw err;

				// 删除需要移除的文本
				const newData = data
					.replace(
						/Dialogue: 0,0:00:02.00,0:00:07.00,zhu,,0,0,0,,{\\fad\(500,500\)}本字幕由豌豆&風之聖殿字幕組聯合製作\\N僅供學習交流 禁止用於商業用途\n/g,
						''
					)
					.replace(
						/Dialogue: 0,0:00:07.00,0:00:12.00,zhu,,0,0,0,,{\\fad\(500,500\)}翻譯\/校對\/時間軸：海底  後期：小聖\n/g,
						''
					);

				// 写入文件
				fs.writeFile(folderPath + 'new/' + file, newData, function (err) {
					if (err) throw err;
					console.log('文件已保存！');
				});
			});
		}
	});
});
