
// 获取手机内的所有数据

const getPhoneData = (date) => {
	// 模拟数据
	let testData = [
		// 时间，支出，收入，类型, 备注
		// { time: "2025-01-01", expenditure: 支出, income: 收入, iconType: "餐饮" ,remark: "备注"},

		{ id: 1, time: "2026-02-09", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
		{ id: 2, time: "2026-02-09", expenditure: 50, iconType: "交通", remark: "公交车" },
		{ id: 3, time: "2026-02-09", expenditure: 300, iconType: "汽车", remark: "加油" },
		{ id: 4, time: "2026-02-09", income: 100, iconType: "理财", remark: "基金" },
		{ id: 5, time: "2026-02-09", income: 200, iconType: "工资", remark: "打工" },

		{ id: 6, time: "2026-01-09", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
		{ id: 7, time: "2026-01-09", expenditure: 50, iconType: "交通", remark: "公交车" },
		{ id: 8, time: "2026-01-09", expenditure: 300, iconType: "汽车", remark: "加油" },
		{ id: 9, time: "2026-01-09", income: 100, iconType: "理财", remark: "基金" },
		{ id: 10, time: "2026-01-09", income: 200, iconType: "工资", remark: "工资收入" },
		{ id: 11, time: "2026-01-08", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
		{ id: 12, time: "2026-01-08", expenditure: 50, iconType: "交通", remark: "公交车" },
		{ id: 13, time: "2026-01-08", expenditure: 300, iconType: "汽车", remark: "加油" },
		{ id: 14, time: "2026-01-10", income: 100, iconType: "理财", remark: "基金" },
		{ id: 15, time: "2026-01-10", income: 200, iconType: "工资", remark: "工资收入" },

		{ id: 16, time: "2025-01-09", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
		{ id: 17, time: "2025-01-09", expenditure: 50, iconType: "交通", remark: "公交车" },
		{ id: 18, time: "2025-01-09", expenditure: 300, iconType: "汽车", remark: "加油" },
		{ id: 19, time: "2025-01-09", income: 100, iconType: "理财", remark: "基金" },
		{ id: 20, time: "2025-01-09", income: 200, iconType: "工资", remark: "基金" },

		{ id: 21, time: "2025-02-09", expenditure: 20, iconType: "餐饮", remark: "螺狮粉" },
		{ id: 22, time: "2025-02-09", expenditure: 50, iconType: "交通", remark: "公交车" },
		{ id: 23, time: "2025-02-09", expenditure: 300, iconType: "汽车", remark: "加油" },
		{ id: 24, time: "2025-02-09", income: 100, iconType: "理财", remark: "基金" },
		{ id: 25, time: "2025-02-09", income: 200, iconType: "工资", remark: "基金" },
	];

	const storedData = JSON.parse(localStorage.getItem("allData"));
	if (storedData) {
		testData = storedData;
	} else {
		localStorage.setItem("allData", JSON.stringify(testData));
		// 预算
		localStorage.setItem("budget", JSON.stringify(1000));
		// 当前时间
		sessionStorage.setItem("currentYearMonth", JSON.stringify({ year: new Date().getFullYear(), month: (new Date().getMonth() + 1).toString().padStart(2, "0") }));
	};
	return testData;
};

// 添加数据
const modifyData = (data) => {
	console.log(data);
	// 支出
	// {time: '2026-02-01', iconValue: '汽车', remark: '阿斯顿撒', expenditure: '66.00'}
	// {time: '2026-02-01', iconValue: '汽车', remark: '阿斯顿撒', income: '66.00'}

	let storedData = JSON.parse(localStorage.getItem("allData"));
	if (storedData) {
		storedData.push(data);
	} else {
		storedData = [data];
	};
	localStorage.setItem("allData", JSON.stringify(storedData));
};

// 删除数据
const deleteData = (id) => {
	let storedData = JSON.parse(localStorage.getItem("allData"));
	if (storedData) {
		storedData = storedData.filter(item => item.id !== id);
		localStorage.setItem("allData", JSON.stringify(storedData));
	} else {
		console.log("删除失败");
	};
};

// 根据日期筛选数据
const filterDataByDate = (time, date) => {
	let newData = [];
	if (date) {
		newData = date.filter(item => {
			const itemDate = new Date(item.time);
			const itemYear = itemDate.getFullYear();
			const itemMonth = itemDate.getMonth() + 1;
			return itemYear === time.year && itemMonth === Number(time.month);
		});
	};
	return newData;
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
}

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
}






export {
	getPhoneData,
	filterDataByDate,
	modifyData,
	deleteData,
	updateDays,
};