const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

// 定义需要转换的文件后缀名
const fileExt = '.txt';

// 定义递归遍历文件夹的函数
function traverseFolder(folderPath) {
  fs.readdirSync(folderPath).forEach(file => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      traverseFolder(filePath); // 递归遍历子文件夹
    } else if (stats.isFile() && path.extname(filePath) === fileExt) {
      // 如果是指定后缀名的文件，则进行转码操作
      const content = fs.readFileSync(filePath);
      const utf8Content = iconv.decode(content, 'gb2312');
      fs.writeFileSync(filePath, utf8Content, { encoding: 'utf8' });
      console.log(`Converted file: ${filePath}`); // 输出转换后的文件路径
    }
  });
}

// 调用函数开始遍历
const folderPath = '/Users/raphael/Downloads/文件'; // 文件夹路径
traverseFolder(folderPath);
