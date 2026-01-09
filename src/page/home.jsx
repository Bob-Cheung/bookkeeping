import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Paper,
	IconButton
} from '@mui/material';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DataCar from '../components/dataCar';
import SelectTime from '../components/selectTime';


const Home = () => {
	const [openSelectTime, setOpenSelectTime] = useState(false);
	// 当前年月
	const [currentYearMonth, setCurrentYearMonth] = useState({ year: 2025, month: 1 });
	// 需要显示的数据
	const [data, setData] = useState([]);

	const allData = [
		// 时间，支出，收入，结余，类型
		// { time: "2025-01-01", expenditure: 10000, income: 300, balance: 100, type: "餐饮" },
		{ time: "2025-01-01", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-01-01", expenditure: 10000, income: 300, type: "交通" },
		{ time: "2025-01-02", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-01-02", expenditure: 10000, income: 300, type: "交通" },
		{ time: "2025-01-03", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-01-03", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-01-04", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-03-04", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-03-04", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-03-04", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2025-05-04", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2026-01-04", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2026-01-04", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2026-01-09", expenditure: 10000, income: 300, type: "餐饮" },
		{ time: "2026-01-09", expenditure: 10000, income: 300, type: "餐饮" },
	];

	useEffect(() => {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth() + 1;
		console.log(currentYear, currentMonth);
		setCurrentYearMonth({ year: currentYear, month: currentMonth });
		// 根据今天的年月，筛选出当月的数据
		const currentMonthData = allData.filter(item => {
			const itemDate = new Date(item.time);
			const itemYear = itemDate.getFullYear();
			const itemMonth = itemDate.getMonth() + 1;
			return itemYear === currentYear && itemMonth === currentMonth;
		})
		console.log(currentMonthData);
		setData(currentMonthData);
	}, []);

	// 根据年月筛选数据
	const handleSelectTime = (year, month) => {

	}

	const handleOpenSelectTime = (newOpen) => {
		setOpenSelectTime(newOpen);
	}






	return (
		<>
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 2, }}>
				<Typography variant="h5" sx={{ color: '#f1fefe' }}>我爱记账</Typography>
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: "10px 0" }}>
				<Box sx={{ display: 'flex', alignItems: 'center', }}>
					<Typography alignCenter sx={{ color: '#f1fefe' }}>2025年01月</Typography>
					<IconButton sx={{ padding: 0 }} onClick={() => handleOpenSelectTime(true)}>
						<ChevronRightIcon />
					</IconButton>
				</Box>
				<IconButton sx={{ padding: 0 }}>
					<ChevronRightIcon />
				</IconButton>
			</Box>
			<Paper sx={{ width: '100%', borderRadius: "10px" }}>
				<Box sx={{ display: 'flex', flexDirection: "column", padding: "10px" }}>
					<Typography variant="h8" sx={{ color: "#f55846" }}>月支出</Typography>
					<Typography variant="h4" sx={{ fontWeight: "bold", paddingTop: 1, paddingBottom: 1 }}>30000000</Typography>
					<Box>
						<Typography variant="h8">月收入</Typography>
						<Typography variant="h8" sx={{ paddingLeft: 1 }}>300</Typography>
						<Typography variant="h8" sx={{ paddingLeft: 10 }}>月结余</Typography>
						<Typography variant="h8" sx={{ paddingLeft: 1 }}>100</Typography>
					</Box>
				</Box>
			</Paper >

			<Box sx={{ flex: 1, overflowY: "auto", marginTop: "10px", marginBottom: '10px', borderRadius: "10px" }}>
				<DataCar data={data} />
			</Box>

			<SelectTime openSelectTime={openSelectTime} handleOpenSelectTime={handleOpenSelectTime} />
		</>
	);
};

export default Home;