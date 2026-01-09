import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton
} from '@mui/material';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { filterDataByDate } from '../utils.js';
import DataCar from '../components/dataCar';
import SelectTime from '../components/selectTime';
import SimpleSnackbar from '../components/simpleSnackbar.jsx';


const Home = (props) => {
  // 时间选择器是否打开
  const [openSelectTime, setOpenSelectTime] = useState(false);
  //  是否显示snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // snackbar内容
  const [snackbarContent, setSnackbarContent] = useState("");
  // snackbar类型
  const [snackbarType, setSnackbarType] = useState("success");
  // 当前年月
  const [currentYearMonth, setCurrentYearMonth] = useState({ year: 2025, month: 1 });
  // 需要显示的数据
  const [data, setData] = useState([]);
  // 当月总支出
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  // 当月总收入
  const [totalIncome, setTotalIncome] = useState(0);
  // 预算
  const [budget, setBudget] = useState(JSON.parse(localStorage.getItem("budget")) || 0);
  // 结余
  const [balance, setBalance] = useState(0);


  // 模拟数据
  const allData = [
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
    { time: "2026-02-09", expenditure: 10000, income: 300, type: "餐饮" },
    { time: "2026-02-09", expenditure: 10000, income: 300, type: "餐饮" },
  ];

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("allData"));
    if (storedData) {
      setData(storedData);
    } else {
      localStorage.setItem("allData", JSON.stringify(allData));
    };
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    setCurrentYearMonth({ year: currentYear, month: currentMonth });
    // 根据今天的年月，筛选出当月的数据
    const currentMonthData = filterDataByDate({ year: currentYear, month: currentMonth }, storedData);
    setData(currentMonthData);
    // 计算总支出
    const totalExpenditure = currentMonthData.reduce((total, item) => total + item.expenditure, 0);
    setTotalExpenditure(totalExpenditure);
    // 计算总收入
    const totalIncome = currentMonthData.reduce((total, item) => total + item.income, 0);
    setTotalIncome(totalIncome);
    // 计算结余
    const balance = budget - totalExpenditure;
    setBalance(balance);
    if (balance < 0) {
      setSnackbarType("warning");
      setSnackbarContent("本月已超支，请控制消费！");
      handleOpenSnackbar(true);
    };
  }, []);

  // 根据年月筛选数据
  const handleSelectTime = (year, month) => {
    const currentMonthData = filterDataByDate({ year: year, month: month }, data);
    setData(currentMonthData);
    setCurrentYearMonth({ year, month });
    const totalExpenditure = currentMonthData.reduce((total, item) => total + item.expenditure, 0);
    setTotalExpenditure(totalExpenditure);
  };

  const handleOpenSelectTime = (newOpen) => {
    setOpenSelectTime(newOpen);
  };

  const handleOpenSnackbar = (newOpen) => {
    setOpenSnackbar(newOpen);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 2, }}>
        <Typography variant="h5" sx={{ color: '#f1fefe' }}>我爱记账</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: "10px 0" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', }}>
          <Typography alignCenter sx={{ color: '#f1fefe' }}>{`${currentYearMonth.year}年${currentYearMonth.month}月`}</Typography>
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
          <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h8" sx={{ color: "#f55846" }}>月支出</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", paddingTop: 1, paddingBottom: 1 }}>{totalExpenditure}</Typography>
            </Box>
            <Box>
              <Typography variant="h8" sx={{ color: "#f55846" }}>月预算</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", paddingTop: 1, paddingBottom: 1 }}>{budget}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="h8">月收入</Typography>
            <Typography variant="h8" sx={{ paddingLeft: 1, color: "#51cf66" }}>{totalIncome}</Typography>
            <Typography variant="h8" sx={{ paddingLeft: 10 }}>月结余</Typography>
            <Typography variant="h8" sx={{ paddingLeft: 1, color: balance < 0 ? "#ff6b6b" : "#51cf66" }}>{balance}</Typography>
          </Box>
        </Box>
      </Paper >
      {/* 数据组件 */}
      <Box sx={{ flex: 1, overflowY: "auto", marginTop: "10px", marginBottom: '10px', borderRadius: "10px" }}>
        <DataCar data={data} />
      </Box>
      {/* 时间选择组件 */}
      <SelectTime
        openSelectTime={openSelectTime}
        handleOpenSelectTime={handleOpenSelectTime}
        handleSelectTime={handleSelectTime}
      />

      {/* 提示组件 */}
      <SimpleSnackbar
        openSnackbar={openSnackbar}
        handleSnackbarClose={handleOpenSnackbar}
        autoHideDuration={3000}
        severity={snackbarType}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={snackbarContent}
      />
    </>
  );
};

export default Home;