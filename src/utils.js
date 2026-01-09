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

// 


export {
	filterDataByDate
};