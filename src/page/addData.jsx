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

	const handleOpenAddDataPage = (value) => {
		props.handleOpenAddDataPage(value);
		setOpenKeyboard(false);
		setSelectedIndex(-1);
	}
	const handleOpenkeyboard = (index, value) => {
		setOpenKeyboard(value);
		setSelectedIndex(index);
	};

	const iconList = [
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐廳" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐廳" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐廳" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐廳" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐廳" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐廳" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
		{ icon: <RestaurantIcon sx={{ fontSize: 30 }} />, name: "餐廳" },
		{ icon: <DirectionsCarIcon sx={{ fontSize: 30 }} />, name: "交通" },
		{ icon: <DirectionsBusIcon sx={{ fontSize: 30 }} />, name: "汽车" },
	]

	return (
		<Drawer open={props.openAddDataPage} anchor={"bottom"} onClose={() => props.handleOpenAddDataPage(false)}>
			<Box sx={{ width: "100%", height: "100vh" }} role="presentation" >
				<Box sx={{ width: "100%", height: "10vh", backgroundColor: "#6babaa", display: "flex", justifyContent: "center", alignItems: "end", }}>
					<Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<Button variant="h6" >支出</Button>
						<Button variant="h6" >收入</Button>
						<Button variant="h6" sx={{ position: "absolute", right: "1vw" }} onClick={() => handleOpenAddDataPage(false)}>取消</Button>
					</Box>
				</Box>
				{/* icon 列表 */}
				<Box sx={{
					width: "100%",
					height: openKeyboard ? "50vh" : "auto",
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
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={handleOpenkeyboard.bind(this, index, true)} key={index} >
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
				<Box sx={{ width: '100%', height: "40vh", backgroundColor: 'yellow', position: "absolute", bottom: "0", display: openKeyboard ? "flex" : "none", }}>
					<Keyboard />
				</Box>
			</Box>
		</Drawer >
	);
};

export default SelectTime;

