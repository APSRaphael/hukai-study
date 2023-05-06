const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 读取原始图片目录
const srcDir = '/Users/***/Downloads/其他图片';
// 保存压缩后图片的目录
const dstDir = '/Users/***/Downloads/newImage';
// 压缩后的图片质量
const quality = 50;

// 判断文件是否为图片类型
function isImage(file) {
	return /\.(png|jpe?g|gif|webp)$/.test(file.toLowerCase());
}

// 创建目录
function mkdirp(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

// 枚举原始图片目录中的所有文件
fs.readdirSync(srcDir).forEach((file) => {
	if (!isImage(file)) {
		// 如果不是图片类型的文件，则跳过
		return;
	}
	// 读取原始图片
	const srcPath = path.join(srcDir, file);
	const srcImg = sharp(srcPath);

	// 创建目标目录
	const dstPath = path.join(dstDir, file);
	mkdirp(path.dirname(dstPath));

	// 压缩图片并保存
	srcImg
		.jpeg({ quality: quality })
		.toFile(path.join(dstDir, file), (err, info) => {
			if (err) throw err;

			// 计算压缩率并输出
			const ratio = info.size / fs.statSync(srcPath).size;
			console.log(
				`Compressed ${srcPath} to ${info.width}x${info.height} with compression ratio ${ratio}`
			);
		});
});
