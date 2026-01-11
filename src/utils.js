
// 获取手机内的所有数据

const getPhoneData = (date) => {
	// 模拟数据
	let testData = [
		// 时间，支出，收入，类型
		// { time: "2025-01-01", expenditure: 10000, income: 300, balance: 100, type: "餐饮" },
		{ time: "2025-01-01", expenditure: 100, income: 300, type: "餐饮" },
		{ time: "2025-01-01", expenditure: 200, income: 300, type: "交通" },
		{ time: "2025-01-03", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-01-03", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-01-04", expenditure: 10000, income: 300, type: "交通" },
		{ time: "2025-02-04", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-02-04", expenditure: 10000, income: 300, type: "交通" },
		{ time: "2025-03-04", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-04-04", expenditure: 10000, income: 300, type: "交通" },
		{ time: "2026-01-04", expenditure: 5000, income: 300, type: "餐饮" },
		{ time: "2026-01-04", expenditure: 100, income: 300, type: "交通" },
		{ time: "2026-01-09", expenditure: 200, income: 300, type: "餐饮" },
		{ time: "2026-01-09", expenditure: 300, income: 300, type: "交通" },
		{ time: "2026-01-10", expenditure: 300, income: 300, type: "餐饮" },
		{ time: "2026-01-11", expenditure: 300, income: 300, type: "交通" },
		{ time: "2026-01-12", expenditure: 300, income: 300, type: "交通" },
		{ time: "2026-01-13", expenditure: 300, income: 300, type: "交通" },
		{ time: "2026-01-14", expenditure: 300, income: 300, type: "交通" },
		{ time: "2026-02-09", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2026-02-09", expenditure: 10000, income: 300, type: "餐饮" },
	];

	const storedData = JSON.parse(localStorage.getItem("allData"));
	if (storedData) {
		testData = storedData;
	} else {
		localStorage.setItem("allData", JSON.stringify(testData));
		// 预算
		localStorage.setItem("budget", JSON.stringify(1000));
	};
	return testData;
};
// 根据日期筛选数据
const filterDataByDate = (time, date) => {
	let newData = [];
	if (date) {
		newData = date.filter(item => {
			const itemDate = new Date(item.time);
			const itemYear = itemDate.getFullYear();
			const itemMonth = itemDate.getMonth() + 1;
			return itemYear === time.year && itemMonth === time.month;
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
		days.push(day);
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
	updateDays,
};