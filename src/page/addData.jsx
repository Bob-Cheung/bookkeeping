import React, { useState, useEffect } from 'react';
import {
	Box,
	Drawer,
	Typography,
	Button,
	IconButton,
	Grid,
	TextField
} from '@mui/material';

import Keyboard from '../components/keyboard';

import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const SelectTime = (props) => {
	const [openKeyboard, setOpenKeyboard] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [iconValue, setIconValue] = useState("");
	// 当前是收入还是支出,expenditure or income
	const [transactionType, setTransactionType] = useState(0);

	useEffect(() => {
		setIconValue("");
		setOpenKeyboard(false);
		setSelectedIndex(-1);
	}, [props.openAddDataPage]);

	const handleIncomeExpense = (value) => {
		setTransactionType(value);
	};

	const handleOpenAddDataPage = (value) => {
		console.log("sadadasd", value);
		props.handleOpenAddDataPage(value);
		setOpenKeyboard(false);
		setSelectedIndex(-1);
	};

	const handleOpenkeyboard = (index, state, value) => {
		console.log(index, state, value);
		setOpenKeyboard(state);
		setSelectedIndex(index);
		setIconValue(value);
	};


	const iconList = [
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐饮" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐饮" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐饮" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐饮" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐饮" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐饮" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐饮" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
	]

	return (
		<Drawer open={props.openAddDataPage} anchor={"bottom"} onClose={() => props.handleOpenAddDataPage(false)}>
			<Box sx={{ width: "100%", height: "100vh" }} role="presentation" >
				<Box sx={{ width: "100%", height: "10vh", backgroundColor: "#6babaa", display: "flex", justifyContent: "center", alignItems: "end", }}>
					<Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<Button variant="h6" onClick={() => handleIncomeExpense(0)}>支出</Button>
						<Button variant="h6" onClick={() => handleIncomeExpense(1)} >收入</Button>
						<Button variant="h6" sx={{ position: "absolute", right: "1vw" }} onClick={() => handleOpenAddDataPage(false)}>取消</Button>
					</Box>
				</Box>
				{/* icon 列表 */}
				<Box sx={{
					width: "100%",
					height: openKeyboard ? `calc(90vh - ${400}px)` : "auto",
					flex: '1',
					overflowY: "auto",
					padding: "10px",
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)", // 每行4个
					gap: "15px", // 统一间距
					justifyItems: "center",
					boxSizing: "border-box",
					backgroundColor: "#ffffff",
				}}>
					{iconList.map((item, index) => (
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={handleOpenkeyboard.bind(this, index, true, item.name)} key={index} >
							<Box
								key={index}
								sx={{
									width: "50px",
									height: "50px",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									borderRadius: "50%",
									backgroundColor: selectedIndex === index ? "yellow" : "#ccc", // 判断是否选中
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								{/* 图标和文字内容 */}
								{item.icon}
							</Box>
							<Typography variant="h8" >{item.name}</Typography>
						</Box>
					))}
				</Box>


				{/* 键盘 */}
				<Box sx={{ width: "100%", height: "400px", position: "fixed", bottom: "0", left: "0", right: "0", display: openKeyboard ? "flex" : "none", }}>
					<Keyboard
						transactionType={transactionType}
						iconValue={iconValue}
						handleOpenAddDataPage={props.handleOpenAddDataPage}
						handleUpdateData={props.handleUpdateData}
					/>
				</Box>
			</Box>
		</Drawer >
	);
};

export default SelectTime;

