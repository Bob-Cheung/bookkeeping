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
	filterDataByDate,
	updateDays,
};