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
			// rootDir = window.cordova.file.externalFilesDirectory;
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

// 读取data.json文件
function readJsonFromFile(fileEntry) {
	return new Promise((resolve, reject) => {
		fileEntry.file(file => {
			console.log("文件名称：", file.name);
			console.log("文件大小（字节）：", file.size); // 重点看这里，空文件会显示 0
			console.log("文件类型：", file.type);
			const reader = new FileReader();
			reader.onabort = () => {
				console.error("文件读取被中止！");
				reject(new Error("文件读取过程被中止"));
			};
			reader.onloadend = () => {
				try {
					console.log("文件原始内容：", reader.result);
					resolve(reader.result ? JSON.parse(reader.result) : null);
				} catch (e) {
					console.error("JSON解析错误：", e);
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
				const newItem = { ...item, id: item.id }; // 保留 id

				// 处理 remark
				if ('remark' in patch) {
					newItem.remark = patch.remark;
				}

				// 处理 expenditure
				if ('expenditure' in patch) {
					delete newItem.income;
					newItem.expenditure = patch.expenditure;
				}

				// 处理 income
				if ('income' in patch) {
					delete newItem.expenditure;
					newItem.income = patch.income;
				}

				return newItem;
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

		console.log('data.json 文件路径:', fileEntry.nativeURL, fileEntry);
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
	let data;
	if (window.cordova) {
		const month = Number(time.month);
		if (month < 10) {
			time.month = `0${month}`;
		}
		time = `${time.year}-${time.month}`;
		data = await readDataByMonth(time);
	} else {
		const storedData = JSON.parse(localStorage.getItem("allData"));
		if (storedData) {
			data = storedData;
		} else {
			localStorage.setItem("allData", JSON.stringify([]));
		};
	};
	console.log("getPhoneData", data);
	return data;
};

// 添加数据
const addData = async (data) => {
	console.log("addData", data);
	const time = data.time.slice(0, 7);
	if (window.cordova) {
		await appendDataByMonth(time, data);
	} else {
		let storedData = JSON.parse(localStorage.getItem("allData"));
		if (storedData) {
			storedData.unshift(data);
		} else {
			storedData = [data];
		};
		localStorage.setItem("allData", JSON.stringify(storedData));
	};
};

// 删除数据
const deleteData = async (id, time) => {
	if (window.cordova) {
		await deleteDataByMonth(time.slice(0, 7), id);
	} else {
		let storedData = JSON.parse(localStorage.getItem("allData"));
		if (storedData) {
			storedData = storedData.filter(item => item.id !== id);
			localStorage.setItem("allData", JSON.stringify(storedData));
		} else {
			console.log("删除失败");
		};
	};
};

// 修改数据
const modifyData = async (time, id, newData) => {
	if (window.cordova) {
		await updateDataByMonth(time.slice(0, 7), id, newData);
	} else {
		let storedData = JSON.parse(localStorage.getItem("allData"));
		if (storedData) {
			storedData = storedData.map(item => {
				if (item.id === id) {
					if (newData.expenditure) {
						delete item.income;
						item.expenditure = newData.expenditure;
					} else if (newData.income) {
						delete item.expenditure;
						item.income = newData.income;
					} else if (newData.remark) {
						item.remark = newData.remark;
					}
				}
				return item;
			});
			localStorage.setItem("allData", JSON.stringify(storedData));
		};
	};
};

// 根据日期筛选数据
const filterDataByDate = async (time, date) => {
	const month = Number(time.month);
	if (month < 10) {
		time.month = `0${month}`;
	}
	const newTime = `${time.year}-${time.month}`;
	let data;
	if (window.cordova) {
		data = await readDataByMonth(newTime);
	} else {
		let storedData = JSON.parse(localStorage.getItem("allData"));
		if (storedData) {
			data = storedData.filter(item => {
				const itemDate = new Date(item.time);
				const itemYear = itemDate.getFullYear();
				const itemMonth = itemDate.getMonth() + 1;
				return itemYear === time.year && itemMonth === Number(time.month);
			});
		} else {
			data = [];
		};
	};
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



/**
 * 组装收支图表数据（通用函数）
 * @param {Array} dataSource - 原始收支数据数组（必填）
 * @param {string} type - 数据类型："支出" 或 "收入"（必填）
 * @param {Object} [options] - 可选配置项
 * @param {boolean} [options.validateNumber=true] - 是否校验数值为有效数字（默认true）
 * @param {boolean} [options.positiveValue=true] - 是否只保留正值（默认true）
 * @returns {Array} 组装后的图表数据数组
 */
const assembleChartData = (dataSource, type, options = {}) => {
	// 默认配置
	const {
		validateNumber = true,
		positiveValue = true
	} = options;

	// 边界校验：必填参数缺失时抛出友好错误
	if (!Array.isArray(dataSource)) {
		console.error('assembleChartData: dataSource 必须是数组类型');
		return [];
	}
	if (!['支出', '收入'].includes(type)) {
		console.error('assembleChartData: type 必须是 "支出" 或 "收入"');
		return [];
	}

	// 2. 确定目标字段（支出→expenditure，收入→income）
	const targetField = type === "支出" ? "expenditure" : "income";

	// 3. 筛选并组装数据
	let chartData = dataSource
		.filter(item => {
			// 基础判断：目标字段存在
			if (!item.hasOwnProperty(targetField)) return false;

			const value = item[targetField];
			// 数值合法性校验（可通过配置关闭）
			if (validateNumber) {
				if (isNaN(Number(value))) return false;
			}
			// 只保留正值（可通过配置关闭）
			if (positiveValue) {
				if (Number(value) <= 0) return false;
			}
			return true;
		})
		.map(item => ({
			time: item.time || '', // 兜底空字符串，避免undefined
			id: item.id || '',     // 兜底空字符串
			name: item.iconType || '',
			remark: item.remark || '',
			color: generateRandomColor(),
			value: validateNumber ? Number(item[targetField]) : item[targetField]
		}));

	chartData = mergeDataByGroupName(chartData);

	return chartData;

};

const mergeDataByGroupName = (originalData) => {
	// 1. 先分组求和：key 是 name，value 是累加的 value
	const groupMap = {};
	originalData.forEach(item => {
		if (!groupMap[item.name]) {
			groupMap[item.name] = 0;
		}
		groupMap[item.name] += item.value;
	});

	// 2. 转换为最终数组格式
	const result = [];
	for (const name in groupMap) {
		result.push({
			time: new Date(),    // 当前时间
			name: name,
			color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
			value: groupMap[name]
		});
	}

	// 每项占计算总金额的比例
	const total = result.reduce((sum, item) => sum + item.value, 0);
	result.forEach(item => {
		// 取整数，避免浮点数精度问题
		// item.percents = Math.round((item.value / total) * 100);
		const percent = (item.value / total) * 100;
		item.percents = Number(percent.toFixed(1));
	});

	return result;
}

// 生成随机颜色
const generateRandomColor = () => {
	// 固定 #0088FE 的饱和度(100%)和亮度(94%)，仅随机色相
	const FIXED_S = 100; // 饱和度 100%
	const FIXED_B = 94;  // 亮度 94%

	// 随机生成色相（0~360°）
	const h = Math.floor(Math.random() * 360);
	// HSB 转 RGB 并生成十六进制颜色（核心转换逻辑）
	const s = FIXED_S / 100;
	const b = FIXED_B / 100;
	let r, g, v;
	const i = Math.floor(h / 60);
	const f = h / 60 - i;
	const p = b * (1 - s);
	const q = b * (1 - s * f);
	const t = b * (1 - s * (1 - f));

	switch (i % 6) {
		case 0: r = b; g = t; v = p; break;
		case 1: r = q; g = b; v = p; break;
		case 2: r = p; g = b; v = t; break;
		case 3: r = p; g = q; v = b; break;
		case 4: r = t; g = p; v = b; break;
		case 5: r = b; g = p; v = q; break;
	}

	// 转成6位十六进制并补零（和你原逻辑一致）
	const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(v)}`;
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
	assembleChartData
};