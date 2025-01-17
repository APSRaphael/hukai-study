const os = require('os');
const { exec } = require('child_process');

console.log(os.cpus());

// 获取 CPU 使用率的函数
// function getCpuUsage() {
//   return new Promise((resolve, reject) => {
//     const startCpuInfo = os.cpus(); // 获取初始的 CPU 信息
//     setTimeout(() => {
//       const endCpuInfo = os.cpus(); // 获取采样后的 CPU 信息 // 计算各个核心的使用率
//       const cpuUsage = endCpuInfo.map((endCore, index) => {
//         const startCore = startCpuInfo[index]; // 计算起始和结束的时间差

//         const startTotal = Object.values(startCore.times).reduce(
//           (a, b) => a + b,
//           0
//         );
//         const endTotal = Object.values(endCore.times).reduce(
//           (a, b) => a + b,
//           0
//         );

//         const idleDiff = endCore.times.idle - startCore.times.idle;
//         const totalDiff = endTotal - startTotal;

//         const usage = (1 - idleDiff / totalDiff) * 100;
//         return {
//           core: index,
//           usage: usage.toFixed(2), // 保留两位小数
//         };
//       });

//       resolve(cpuUsage);
//     }, 100); // 延迟 100ms
//   });
// }

function getCpuUsage() {
  return new Promise((resolve, reject) => {
    const startCpuInfo = os.cpus();
    setTimeout(() => {
      const endCpuInfo = os.cpus();
      const cpuUsage = endCpuInfo.map((endCore, index) => {
        const startCode = startCpuInfo[index];
        const startTotal = Object.values(startCode.times).reduce(
          (a, b) => a + b,
          0
        );
        const endTotal = Object.values(endCore.times).reduce(
          (a, b) => a + b,
          0
        );

        const idleDiff = endCore.times.idle - startCode.times.idle;
        const totalDiff = endTotal - startTotal;

        const usage = (1 - idleDiff / totalDiff) * 100;
        return {
          core: index,
          usage: usage.toFixed(2),
        };
      });

      resolve(cpuUsage);
    }, 100);
  });
}

// 调用获取 CPU 使用率的函数
getCpuUsage()
  .then((cpuUsage) => {
    console.debug(
      `%c HKDebug %c CPU使用率 %c`,
      `background: #09dbee; border: 1px solid  #09dbee; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border: 1px solid  #09dbee; padding: 1px; border-radius: 0 2px 2px 0; color: #09dbee;`,
      `background: transparent`
    ); // hk-log
    cpuUsage.forEach((core) => {
      console.log(
        `%c HKSuccess %c 核心使用率 %c`,
        `background: #67C23A; border: 1px solid  #67C23A; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
        `border: 1px solid  #67C23A; padding: 1px; border-radius: 0 2px 2px 0; color: #67C23A;`,
        `background: transparent`,
        `核心 ${core.core} 使用率: ${core.usage}%`
      ); // hk-log
    });
  })
  .catch((err) => {
    console.log(
      `%c HKError %c 获取 CPU 使用率失败 %c`,
      `background: #F56C6C; border: 1px solid  #F56C6C; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border: 1px solid  #F56C6C; padding: 1px; border-radius: 0 2px 2px 0; color: #F56C6C;`,
      `background: transparent`,
      err
    ); // hk-log
  });

function printMemoryUsage() {
  const memoryUsage = process.memoryUsage();

  console.log('内存使用情况:');
  console.log(
    `RSS（常驻内存大小）：${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(
    `堆内存总量（heapTotal）：${(memoryUsage.heapTotal / 1024 / 1024).toFixed(
      2
    )} MB`
  );
  console.log(
    `已用堆内存（heapUsed）：${(memoryUsage.heapUsed / 1024 / 1024).toFixed(
      2
    )} MB`
  );
  console.log(
    `外部内存（external）：${(memoryUsage.external / 1024 / 1024).toFixed(
      2
    )} MB`
  );
  console.log(`系统可用内存：${(os.freemem() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`系统总内存：${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`);
}

// 模拟内存消耗的函数
function createLargeArray() {
  const largeArray = new Array(1e6).fill('Hello');
  console.log('创建了一个大型数组');
  printMemoryUsage();
}

printMemoryUsage(); // 初始内存使用情况
createLargeArray(); // 模拟内存使用

exec('df -h /', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行出错: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`标准错误输出: ${stderr}`);
    return;
  } // 解析 df 命令输出

  const lines = stdout.trim().split('\n');
  const diskInfo = lines[1].split(/\s+/);

  console.log('磁盘空间使用情况:');
  console.log(`总空间: ${diskInfo[1]}`);
  console.log(`已用空间: ${diskInfo[2]}`);
  console.log(`可用空间: ${diskInfo[3]}`);
  console.log(`使用率: ${diskInfo[4]}`);
});
