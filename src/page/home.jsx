import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton
} from '@mui/material';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CelebrationIcon from '@mui/icons-material/Celebration';
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
  const [currentYearMonth, setCurrentYearMonth] = useState(JSON.parse(sessionStorage.getItem("currentYearMonth")) || { year: new Date().getFullYear(), month: (new Date().getMonth() + 1).toString().padStart(2, "0") });
  // // 读取的所有数据
  // const [props.allData, setprops.allData] = useState(getPhoneData() || []);
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



  useEffect(() => {
    // const currentDate = new Date();
    // const currentYear = currentDate.getFullYear();
    // const currentMonth = currentDate.getMonth() + 1;
    // setCurrentYearMonth({ year: currentYear, month: currentMonth });
    // 根据今天的年月，筛选出当月的数据
    const currentMonthData = filterDataByDate(currentYearMonth, props.allData);
    console.log("所有数据", props.allData);
    console.log("当月数据", currentMonthData);
    setData(currentMonthData);
    calculateTotal(currentMonthData);
  }, [props.allData]);

  // 计算当月总支出，总收入，结余
  const calculateTotal = (data) => {
    let totalExpenditure = 0.0;
    let totalIncome = 0.0;
    for (const record of data) {
      if ("expenditure" in record) {
        totalExpenditure += record.expenditure;
        setTotalExpenditure(totalExpenditure);
      };

      if (record.income !== undefined) {
        totalIncome += record.income;
        setTotalIncome(totalIncome);
      };
    }
    const balance = budget - totalExpenditure;
    setBalance(balance);


    if (balance < 0) {
      setSnackbarType("warning");
      setSnackbarContent("本月已超支，请控制消费！");
      handleOpenSnackbar(true);
    };
  };

  // 根据年月筛选数据
  const handleSelectTime = (year, month) => {
    console.log(year, month, props.allData);
    sessionStorage.setItem("currentYearMonth", JSON.stringify({ year: year, month: month }));
    const currentMonthData = filterDataByDate({ year: year, month: month }, props.allData);
    console.log(currentMonthData);
    setData(currentMonthData);
    setCurrentYearMonth({ year, month });
    calculateTotal(currentMonthData);
  };

  const handleOpenSelectTime = (newOpen) => {
    setOpenSelectTime(newOpen);
  };

  const handleOpenSnackbar = (newOpen) => {
    setOpenSnackbar(newOpen);
  };

  const handleSelectTimeConfirm = (year, month) => {
    handleOpenSelectTime(false);
    handleSelectTime(year, month);
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 2, }}>
        <Typography variant="h5" sx={{ color: '#f1fefe' }}>我爱记账</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: "10px 0" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', }} onClick={() => handleOpenSelectTime(true)}>
          <Typography alignCenter sx={{ color: '#f1fefe' }}>{`${currentYearMonth.year}年${currentYearMonth.month}月`}</Typography>
          <IconButton sx={{ padding: 0 }} >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <IconButton sx={{ padding: 0 }}>
          <CelebrationIcon />
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
          <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h8">月收入</Typography>
              <Typography variant="h8" sx={{ paddingLeft: 1, color: "#51cf66" }}>{totalIncome}</Typography>
            </Box>
            <Box>
              <Typography variant="h8" >月结余</Typography>
              <Typography variant="h8" sx={{ paddingLeft: 1, color: balance < 0 ? "#ff6b6b" : "#51cf66" }}>{balance}</Typography>
            </Box>
          </Box>
        </Box>
      </Paper >
      {/* 数据组件 */}
      <Box sx={{ flex: 1, overflowY: "auto", marginTop: "10px", marginBottom: '10px', borderRadius: "10px" }}>
        <DataCar data={data} />
      </Box>
      {/* 时间选择组件 */}
      <SelectTime
        currentYearMonth={currentYearMonth}
        openSelectTime={openSelectTime}
        showDays={false}
        handleOpenSelectTime={handleOpenSelectTime}
        handleSelectTimeConfirm={handleSelectTimeConfirm}
      />

      {/* 提示组件 */}
      <SimpleSnackbar
        openSnackbar={openSnackbar}
        handleSnackbarClose={handleOpenSnackbar}
        autoHideDuration={2000}
        severity={snackbarType}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={snackbarContent}
      />
    </>
  );
};

export default Home;