// Android获取文件访问文件的权限
function requestStoragePermission() {
	return new Promise((resolve, reject) => {
		if (!window.cordova.plugins || !window.cordova.plugins.permissions) {
			// 没有权限插件就直接返回成功
			resolve(true);
			return;
		};
		const permissions = window.cordova.plugins.permissions;
		// 检查权限
		permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, status => {
			if (status.hasPermission) {
				resolve(true);
			} else {
				// 申请权限
				permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, status2 => {
					if (status2.hasPermission) {
						resolve(true);
					} else {
						reject('没有存储权限');
					}
				}, err => reject({ msg: '权限申请失败', err }));
			};
		}, err => reject({ msg: '权限检测失败', err }));
	});
};

/**
 * 判断并创建主文件夹
 * @param {string} mainFolder - 主文件夹名称，比如 'zhangLiang'
 * @returns {Promise<DirectoryEntry>} - 返回主文件夹 DirectoryEntry
 */
async function ensureMainFolder(mainFolder) {
	try {
		// Android 请求权限
		if (window.cordova.platformId === 'android') {
			await requestStoragePermission();
		}

		// 根目录
		let rootDir;
		if (window.cordova.platformId === 'android') {
			rootDir = window.cordova.file.externalRootDirectory + 'Download/';
		} else if (window.cordova.platformId === 'ios') {
			rootDir = window.cordova.file.documentsDirectory;
		} else {
			rootDir = window.cordova.file.dataDirectory;
		}

		const rootEntry = await getDirectory(rootDir);

		// 创建主文件夹
		const mainDirEntry = await new Promise((resolve, reject) => {
			rootEntry.getDirectory(mainFolder, { create: true }, resolve, reject);
		});

		console.log('主文件夹路径:', mainDirEntry.nativeURL);
		return mainDirEntry;

	} catch (err) {
		console.error('创建主文件夹失败:', err);
		throw err;
	}
};

/**
* 获取目录入口
* @param {string} path 
* @returns {Promise<DirectoryEntry>}
*/
function getDirectory(path) {
	return new Promise((resolve, reject) => {
		window.resolveLocalFileSystemURL(path, resolve, reject);
	});
};

/**
 * 判断并创建子文件夹
 * @param {DirectoryEntry} parentDirEntry - 父目录 DirectoryEntry
 * @param {string} subFolder - 子文件夹名称
 * @returns {Promise<DirectoryEntry>} - 返回子文件夹 DirectoryEntry
 */
function ensureSubFolder(parentDirEntry, subFolder) {
	return new Promise((resolve, reject) => {
		parentDirEntry.getDirectory(subFolder, { create: true }, resolve, reject);
	});
}

/**
 * 判断并创建文件
 * @param {DirectoryEntry} dirEntry - 文件所在目录
 * @param {string} fileName - 文件名
 * @returns {Promise<FileEntry>}
 */
function ensureFile(dirEntry, fileName) {
	return new Promise((resolve, reject) => {
		dirEntry.getFile(
			fileName,
			{ create: false },
			resolve, // 文件已存在
			() => {
				// 文件不存在，创建
				dirEntry.getFile(
					fileName,
					{ create: true, exclusive: false },
					resolve,
					reject
				);
			}
		);
	});
};


/**
 * 写入 JSON 数据到文件
 * @param {FileEntry} fileEntry
 * @param {Object|Array} data
 */
function writeJsonToFile(fileEntry, data) {
	return new Promise((resolve, reject) => {
		fileEntry.createWriter(writer => {
			writer.onwriteend = resolve;
			writer.onerror = reject;
			writer.write(JSON.stringify(data, null, 2));
		}, reject);
	});
};

function readJsonFromFile(fileEntry) {
	return new Promise((resolve, reject) => {
		fileEntry.file(file => {
			const reader = new FileReader();
			reader.onloadend = () => {
				try {
					resolve(reader.result ? JSON.parse(reader.result) : null);
				} catch (e) {
					reject(e);
				}
			};
			reader.onerror = reject;
			reader.readAsText(file);
		}, reject);
	});
};

/**
 * 向指定月份追加一条记账数据
 * @param {string} month - 例如 '2026-01'
 * @param {Object} newItem - 单条记账数据
 */
async function appendDataByMonth(month, newItem) {
	console.log('追加数据:', month, newItem);
	try {
		// 1. 主文件夹
		const mainDir = await ensureMainFolder('zhangLiang');

		// 2. 月份文件夹
		const monthDir = await ensureSubFolder(mainDir, month);

		// 3. data.json
		const fileEntry = await ensureFile(monthDir, 'data.json');

		// 4. 读取已有数据
		let jsonData;
		try {
			jsonData = await readJsonFromFile(fileEntry);
		} catch {
			jsonData = null;
		}

		// 5. 数据初始化（关键点）
		if (!Array.isArray(jsonData)) {
			jsonData = [];
		}

		// 6. 追加新数据
		jsonData.push(newItem);

		// 7. 写回文件
		await writeJsonToFile(fileEntry, jsonData);

		console.log('追加成功:', newItem);
		return fileEntry;

	} catch (err) {
		console.error('追加失败:', err);
		throw err;
	}
};

/**
 * 删除指定月份中某一条数据（按 id）
 * @param {string} month - 月份，例如 "2026-01"
 * @param {number|string} id - 要删除的数据 id
 */
async function deleteDataByMonth(month, id) {
	console.log('删除数据:', month, id);

	try {
		// 1. 主文件夹
		const mainDir = await ensureMainFolder('zhangLiang');

		// 2. 月份文件夹
		const monthDir = await ensureSubFolder(mainDir, month);

		// 3. data.json
		const fileEntry = await ensureFile(monthDir, 'data.json');

		// 4. 读取已有数据
		let jsonData;
		try {
			jsonData = await readJsonFromFile(fileEntry);
		} catch {
			jsonData = [];
		}

		if (!Array.isArray(jsonData)) {
			jsonData = [];
		}

		// 5. 过滤删除
		const originalLength = jsonData.length;
		const newData = jsonData.filter(item => item.id !== id);

		if (newData.length === originalLength) {
			console.warn('未找到要删除的数据:', id);
			return false;
		}

		// 6. 写回文件
		await writeJsonToFile(fileEntry, newData);

		console.log('删除成功:', id);
		return true;

	} catch (err) {
		console.error('删除失败:', err);
		throw err;
	}
}

/**
 * 修改指定月份中的某一条数据（按 id）
 * @param {string} month - 月份，例如 "2026-01"
 * @param {number|string} id - 要修改的数据 id
 * @param {Object} patch - 需要修改的字段，例如 { expenditure: 30, remark: '午餐' }
 */
async function updateDataByMonth(month, id, patch) {
	console.log('修改的数据:', month, id, patch);

	try {
		// 1. 主文件夹
		const mainDir = await ensureMainFolder('zhangLiang');

		// 2. 月份文件夹
		const monthDir = await ensureSubFolder(mainDir, month);

		// 3. data.json
		const fileEntry = await ensureFile(monthDir, 'data.json');

		// 4. 读取已有数据
		let jsonData;
		try {
			jsonData = await readJsonFromFile(fileEntry);
		} catch {
			jsonData = [];
		}

		if (!Array.isArray(jsonData)) {
			jsonData = [];
		}

		// 5. 查找并修改
		let updated = false;

		const newData = jsonData.map(item => {
			if (item.id === id) {
				updated = true;
				return {
					...item,
					...patch,
					id: item.id // 确保 id 不被覆盖
				};
			}
			return item;
		});

		if (!updated) {
			console.warn('未找到要修改的数据:', id);
			return false;
		}
		console.log('修改后的数据:', newData);
		// 6. 写回文件
		await writeJsonToFile(fileEntry, newData);

		console.log('修改成功:', id);
		return true;

	} catch (err) {
		console.error('修改失败:', err);
		throw err;
	}
}


/**
 * 根据年月读取 data.json
 * @param {string} month - 例如 '2026-01'
 * @returns {Promise<Object|Array|null>}
 */
async function readDataByMonth(month) {
	try {
		// Android 权限（只在 Android 需要）
		if (window.cordova.platformId === 'android') {
			await requestStoragePermission();
		}

		// 1. 主文件夹 zhangLiang（只获取，不强制新建子结构）
		const mainDir = await ensureMainFolder('zhangLiang');

		// 2. 年月文件夹（如果不存在，直接返回空数据）
		let monthDir;
		try {
			monthDir = await new Promise((resolve, reject) => {
				mainDir.getDirectory(month, { create: false }, resolve, reject);
			});
		} catch {
			console.warn('月份文件夹不存在:', month);
			return null;
		}

		// 3. data.json（如果不存在，返回空）
		let fileEntry;
		try {
			fileEntry = await new Promise((resolve, reject) => {
				monthDir.getFile('data.json', { create: false }, resolve, reject);
			});
		} catch {
			console.warn('data.json 不存在');
			return null;
		}

		// 4. 读取 JSON
		const data = await readJsonFromFile(fileEntry);
		console.log('读取成功:', data);
		const newData = sortByTimeDesc(data);

		return newData;

	} catch (err) {
		console.error('读取数据失败:', err);
		throw err;
	}
};

// 根据时间排序（降序）
function sortByTimeDesc(list) {
	return [...list].sort((a, b) => b.time.localeCompare(a.time));
};

// 获取手机内的所有数据
// const getPhoneData = (date) => {
// 	// 模拟数据
// 	let testData = [
// 		// 时间，支出，收入，类型, 备注
// 		// { time: "2025-01-01", expenditure: 支出, income: 收入, iconType: "餐饮" ,remark: "备注"},

// 		{ id: 1, time: "2026-02-09", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
// 		{ id: 2, time: "2026-02-09", expenditure: 50, iconType: "交通", remark: "公交车" },
// 		{ id: 3, time: "2026-02-09", expenditure: 300, iconType: "汽车", remark: "加油" },
// 		{ id: 4, time: "2026-02-09", income: 100, iconType: "理财", remark: "基金" },
// 		{ id: 5, time: "2026-02-09", income: 200, iconType: "工资", remark: "打工" },

// 		{ id: 6, time: "2026-01-09", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
// 		{ id: 7, time: "2026-01-09", expenditure: 50, iconType: "交通", remark: "公交车" },
// 		{ id: 8, time: "2026-01-09", expenditure: 300, iconType: "汽车", remark: "加油" },
// 		{ id: 9, time: "2026-01-09", income: 100, iconType: "理财", remark: "基金" },
// 		{ id: 10, time: "2026-01-09", income: 200, iconType: "工资", remark: "工资收入" },
// 		{ id: 11, time: "2026-01-08", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
// 		{ id: 12, time: "2026-01-08", expenditure: 50, iconType: "交通", remark: "公交车" },
// 		{ id: 13, time: "2026-01-08", expenditure: 300, iconType: "汽车", remark: "加油" },
// 		{ id: 14, time: "2026-01-10", income: 100, iconType: "理财", remark: "基金" },
// 		{ id: 15, time: "2026-01-10", income: 200, iconType: "工资", remark: "工资收入" },

// 		{ id: 16, time: "2025-01-09", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
// 		{ id: 17, time: "2025-01-09", expenditure: 50, iconType: "交通", remark: "公交车" },
// 		{ id: 18, time: "2025-01-09", expenditure: 300, iconType: "汽车", remark: "加油" },
// 		{ id: 19, time: "2025-01-09", income: 100, iconType: "理财", remark: "基金" },
// 		{ id: 20, time: "2025-01-09", income: 200, iconType: "工资", remark: "基金" },

// 		{ id: 21, time: "2025-02-09", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
// 		{ id: 22, time: "2025-02-09", expenditure: 50, iconType: "交通", remark: "公交车" },
// 		{ id: 23, time: "2025-02-09", expenditure: 300, iconType: "汽车", remark: "加油" },
// 		{ id: 24, time: "2025-02-09", income: 100, iconType: "理财", remark: "基金" },
// 		{ id: 25, time: "2025-02-09", income: 200, iconType: "工资", remark: "基金" },
// 	];

// 	const storedData = JSON.parse(localStorage.getItem("allData"));
// 	if (storedData) {
// 		testData = storedData;
// 	} else {
// 		localStorage.setItem("allData", JSON.stringify(testData));
// 		// 预算
// 		localStorage.setItem("budget", JSON.stringify(1000));
// 		// 当前时间
// 		sessionStorage.setItem("currentYearMonth", JSON.stringify({ year: new Date().getFullYear(), month: (new Date().getMonth() + 1).toString().padStart(2, "0") }));
// 	};
// 	return testData;
// };
const getPhoneData = async () => {
	let time = JSON.parse(sessionStorage.getItem("currentYearMonth"));
	time = `${time.year}-${time.month}`;
	const data = await readDataByMonth(time);
	console.log("getPhoneData", data);
	return data;
};

// 添加数据
const addData = async (data) => {
	const time = data.time.slice(0, 7);
	await appendDataByMonth(time, data);
};

// 删除数据
const deleteData = async (id, time) => {
	await deleteDataByMonth(time.slice(0, 7), id);
};

// 修改数据
const modifyData = async (time, id, newData) => {
	await updateDataByMonth(time.slice(0, 7), id, newData);
};

// 根据日期筛选数据
const filterDataByDate = async (time, date) => {
	const newTime = `${time.year}-${time.month}`;
	const data = await readDataByMonth(newTime);
	console.log("filterDataByDate", data);
	return data;
};

// 根据年份和月份更新天数
function updateDays(currentYearMonth) {
	const { year, month } = currentYearMonth;

	// 验证输入参数
	if (!year || !month || month < 1 || month > 12) {
		throw new Error('请输入有效的年份和月份 (月份范围: 1-12)');
	}

	// 获取该月的天数
	const daysInMonth = getDaysInMonth(year, month);

	// 生成1到daysInMonth的数组
	const days = [];
	for (let day = 1; day <= daysInMonth; day++) {
		// 小于10的日期前面补0
		const dayStr = day < 10 ? `0${day}` : `${day}`;
		days.push(dayStr);
	}
	// console.log(year, month, days);
	return days;
};

/**
 * 获取指定月份的天数
 * @param {number} year - 年份
 * @param {number} month - 月份 (1-12)
 * @returns {number} 该月的天数
 */
function getDaysInMonth(year, month) {
	// 月份从0开始，所以month=0代表1月，month=11代表12月
	// 这里利用JavaScript Date对象的特性：如果day传入0，会返回上个月的最后一天
	return new Date(year, month, 0).getDate();
};

export {
	ensureMainFolder,
	appendDataByMonth,
	readDataByMonth,
	requestStoragePermission,
	getPhoneData,
	filterDataByDate,
	addData,
	deleteData,
	modifyData,
	updateDays,
};