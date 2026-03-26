import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  TextField,
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
  const [budgetInputShow, setBudgetInputShow] = useState(false);
  // 结余
  const [balance, setBalance] = useState(0);



  const handleBudgetChange = (value) => {
    setBudget(value);
    localStorage.setItem("budget", JSON.stringify(value));
  };

  const getData = async () => {
    const currentMonthData = await filterDataByDate(currentYearMonth, props.allData);
    if (currentMonthData) {
      console.log("所有数据", props.allData);
      setData(currentMonthData);
      calculateTotal(currentMonthData);
    } else {
      setData([]);
      calculateTotal([]);
      console.log("没有数据");
    };
  };

  useEffect(() => {
    // const currentDate = new Date();
    // const currentYear = currentDate.getFullYear();
    // const currentMonth = currentDate.getMonth() + 1;
    // setCurrentYearMonth({ year: currentYear, month: currentMonth });
    // 根据今天的年月，筛选出当月的数据
    getData();
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
      const overspendPopup = JSON.parse(localStorage.getItem("overspendPopup"));
      if (!overspendPopup) {
        handleOpenSnackbar(false);
      } else {
        handleOpenSnackbar(true);
        setSnackbarContent("本月已超支，请控制消费！");
      };
    };
  };

  // 根据年月筛选数据
  const handleSelectTime = async (year, month) => {
    console.log(year, month, props.allData);
    sessionStorage.setItem("currentYearMonth", JSON.stringify({ year: year, month: Number(month) }));
    const currentMonthData = await filterDataByDate({ year: year, month: month }, props.allData);
    if (currentMonthData) {
      console.log("handleSelectTime", currentMonthData);
      setData(currentMonthData);
      calculateTotal(currentMonthData);
    } else {
      setData([]);
      calculateTotal([]);
    };
    setCurrentYearMonth({ year, month });
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
  };

  useEffect(() => {
    const overspendPopup = JSON.parse(localStorage.getItem("overspendPopup"));
    if (overspendPopup === null) {
      localStorage.setItem("overspendPopup", JSON.stringify(true));
    };
  }, []);

  return (
    <>
      {/* 顶部标题 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 2, paddingBottom: 1 }}>
        <Typography variant="h5" sx={{ color: '#333', fontWeight: 800, letterSpacing: '1px' }}>我爱记账</Typography>
      </Box>

      {/* 日期选择与图标 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: "15px" }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '6px 14px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}
          onClick={() => handleOpenSelectTime(true)}
        >
          <Typography alignCenter sx={{ color: '#444', fontWeight: 700 }}>{`${currentYearMonth.year}年${currentYearMonth.month}月`}</Typography>
          <ChevronRightIcon sx={{ color: '#888', ml: 0.5, fontSize: '1.2rem' }} />
        </Box>
        <IconButton sx={{ backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: '12px' }}>
          <CelebrationIcon sx={{ color: '#FFB74D' }} />
        </IconButton>
      </Box>

      {/* 核心数据展示卡片 */}
      <Box >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            boxSizing: 'border-box', // 确保 padding 被包含在 width 内，不撑大卡片
            borderRadius: "20px",
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            padding: "24px 20px",
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* 红色点缀装饰 */}
          <Box sx={{ position: 'absolute', top: -30, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,99,71,0.08) 0%, rgba(255,255,255,0) 70%)' }} />

          <Box sx={{ display: 'flex', flexDirection: "column" }}>
            {/* 上半部分：支出与预算 */}
            <Box sx={{ display: 'flex', justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#888", fontWeight: 700 }}>月支出 (元)</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#333", mt: 0.5, letterSpacing: '-1px' }}>{totalExpenditure}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "flex-end" }}>
                <Typography variant="caption" sx={{ color: "#888", fontWeight: 700 }}>月预算 (元)</Typography>
                {
                  !budgetInputShow &&
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#555", mt: 0.5 }} onClick={() => setBudgetInputShow(true)}>
                    {Number(budget).toFixed(2)}
                  </Typography>
                }
                {
                  budgetInputShow &&
                  <TextField
                    variant="standard"
                    size="small"
                    sx={{ width: '80px', mt: 0.5 }}
                    type='number'
                    autoFocus
                    value={budget}
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    onBlur={() => {
                      setBudgetInputShow(false);
                      props.handleUpdateData();
                    }}
                    InputProps={{ disableUnderline: true, sx: { fontWeight: 800, color: "#555", borderBottom: '2px solid #FF6347', pb: 0.5 } }}
                  />
                }
              </Box>
            </Box>

            {/* 下半部分：收入与结余 */}
            <Box sx={{ display: 'flex', justifyContent: "space-between", pt: 2, borderTop: '2px dashed #f0f0f0' }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#888", fontWeight: 700 }}>月收入</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#66BB6A", mt: 0.5 }}>{totalIncome}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: "#888", fontWeight: 700 }}>月结余</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: balance < 0 ? "#FF6347" : "#66BB6A", mt: 0.5 }}>{balance > 0 ? '+' : ''}{balance}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* 数据组件 */}
      <Box sx={{ flex: 1, overflowY: "auto", marginTop: "10px", marginBottom: '10px', borderRadius: "10px" }}>
        <DataCar data={data} handleUpdateData={props.handleUpdateData} />
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