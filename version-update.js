const fs = require('fs');
const path = require('path');

// 文件路径
const versionFilePath = path.join(__dirname, 'public', 'VERSION');
const configFilePath = path.join(__dirname, 'config.xml');
const packageJsonPath = path.join(__dirname, 'package.json');

function getVersionFromContent(content) {
  console.log(content);
  const versionLine = content.split('\n').find(line => line.startsWith('Version:'));
  if (!versionLine) throw new Error('未找到版本号');
  return versionLine.split(':')[1].trim(); // 提取并去除空格
}

// 解析并递增版本号 (v0.0.5 -> v0.0.6)
function incrementVersion(version) {
  const [major, minor, patch] = version.slice(1).split('.').map(Number); // 去掉 'v'
  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    throw new Error(`无效的版本号: ${version}`);
  }
  const newPatch = patch + 1;
  return `v${major}.${minor}.${newPatch}`; // 返回新版本号
}

// 格式化当前时间为 YYYY-MM-DD
function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function updateVersionInFiles() {
  try {
    // 读取 VERSION 文件并提取版本号
    const fileContent = fs.readFileSync(versionFilePath, 'utf8').trim();
    const oldVersion = getVersionFromContent(fileContent); // 解析版本号
    const newVersion = incrementVersion(oldVersion); // 递增版本号
    const buildDate = getFormattedDate(); // 获取构建时间

    // 更新 VERSION 文件内容
    const versionContent = `Version: ${newVersion}\nBuild Date: ${buildDate}\n`;
    fs.writeFileSync(versionFilePath, versionContent, 'utf8');
    console.log(`VERSION 文件已更新：${oldVersion} -> ${newVersion}`);

    // 更新 config.xml 中的 version 属性
    let configContent = fs.readFileSync(configFilePath, 'utf8');
    configContent = configContent.replace(
      /(<widget[^>]*version=")([\d.]+)"/,
      `$1${newVersion.slice(1)}"` // 去掉版本号的 "v"
    );

    fs.writeFileSync(configFilePath, configContent, 'utf8');
    console.log(`config.xml 文件已更新为版本：${newVersion.slice(1)}`);

    // 更新 package.json 中的 version 属性
    updatePackageJsonVersion(newVersion.slice(1));
  } catch (error) {
    console.error('更新版本信息时出错:', error);
  }
}

function updatePackageJsonVersion(version) {
  try {
    const packageJson = require(packageJsonPath);
    // packageJson.version = incrementVersion(packageJson.version);
    packageJson.version = version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log(`package.json 文件已更新为版本：${packageJson.version}`);
  } catch (error) {
    console.error('更新 package.json 版本时出错:', error);
  }
}

// 执行更新操作
updateVersionInFiles();
