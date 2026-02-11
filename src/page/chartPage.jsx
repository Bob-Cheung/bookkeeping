import React, { useState, useEffect } from 'react';
import LinesCharts from '../components/linesCharts';
import PieCharts from '../components/pieCharts';
import LinearProgressWithLabel from '../components/linearProgressWithLabel';
import { assembleChartData, filterDataByDate } from '../utils.js';
import { iconList, incomeIconList } from './icon';
import {
  Box,
  Typography,
  IconButton
} from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ChartPage = (props) => {
  console.log("ChartPage", props.allData);

  const [selectedPeriod, setSelectedPeriod] = useState('月');
  const [selectedExpenditure, setSelectedExpenditure] = useState('支出');
  // const [currentYearMonth, setCurrentYearMonth] = useState(JSON.parse(sessionStorage.getItem("currentYearMonth")));
  const [timeText, setTimeText] = useState("");
  const [selectTime, setSelectTime] = useState(JSON.parse(sessionStorage.getItem("currentYearMonth")));
  const [chartData, setChartData] = useState();
  const periods = ['周', '月', '年'];
  const expenditures = ['支出', '收入'];

  const handlePeriodClick = (period) => {
    console.log("handlePeriodClick", period);
    setSelectedPeriod(period);
    const now = new Date();
    const initialTime = {
      year: Number(now.getFullYear()),
      month: Number(now.getMonth() + 1),
      day: Number(now.getDate()),
      week: Number(getWeekNumber(now))
    };
    setSelectTime(initialTime);
    if (period === '年') {
      setTimeText(`${initialTime.year}年`);
    } else if (period === '月') {
      setTimeText(`${initialTime.year}年${initialTime.month}月`);
    } else if (period === '周') {
      setTimeText(`${initialTime.year}年${initialTime.month}月第${initialTime.week}周`);
    }
  };

  const handleExpenditureClick = (expenditure) => {
    console.log("handleExpenditureClick", expenditure);
    setSelectedExpenditure(expenditure);
  };

  // 计算日期所在年的周数
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const handleSelectTime = async (type) => {
    console.log("handleSelectTime", type, selectedPeriod);
    // 深拷贝当前时间，避免直接修改
    let newTime = { ...selectTime };

    switch (selectedPeriod) {
      case '年':
        if (type === "up") {
          newTime.year -= 1;
        } else if (type === "down") {
          newTime.year += 1;
        }
        setTimeText(`${newTime.year}年`);
        break;

      case '月':
        if (type === "up") {
          newTime.month -= 1;
          if (newTime.month < 1) {
            newTime.month = 12;
            newTime.year -= 1;
          }
        } else if (type === "down") {
          newTime.month += 1;
          if (newTime.month > 12) {
            newTime.month = 1;
            newTime.year += 1;
          }
        }
        // 确保日期不超过当月最大天数
        const maxDay = new Date(newTime.year, newTime.month, 0).getDate();
        newTime.day = Math.min(newTime.day, maxDay);
        setTimeText(`${newTime.year}年${newTime.month}月`);
        // getChartData(newTime);
        break;

      case '周':
        if (type === "up") {
          newTime.week -= 1;
          if (newTime.week < 1) {
            newTime.month -= 1;
            if (newTime.month < 1) {
              newTime.month = 12;
              newTime.year -= 1;
            }
            newTime.week = getWeekNumber(new Date(newTime.year, newTime.month - 1, 1));
          }
        } else if (type === "down") {
          newTime.week += 1;
          if (newTime.week > getWeekNumber(new Date(newTime.year, newTime.month, 0))) {
            newTime.month += 1;
            if (newTime.month > 12) {
              newTime.month = 1;
              newTime.year += 1;
            }
            newTime.week = 1;
          }
        }
        setTimeText(`${newTime.year}年${newTime.month}月第${newTime.week}周`);
        break;
      default:
        console.error("未知的时间周期:", selectedPeriod);
        return;
    }
    console.log("新的时间:", newTime);
    setSelectTime(newTime);
  };

  const getChartData = async (time) => {
    const currentMonthData = await filterDataByDate({ year: time.year, month: time.month });
    let chartData = [];

    // 将currentMonthData中expenditure
    for (let index = 0; index < currentMonthData.length; index++) {
      if (selectedExpenditure === "支出") {
        if (currentMonthData[index].expenditure) {
          chartData.push({
            time: currentMonthData[index].time,
            id: currentMonthData[index].id,
            name: currentMonthData[index].iconType,
            remark: currentMonthData[index].remark,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            value: currentMonthData[index].expenditure
          })
        }
      } else {
        if (currentMonthData[index].income) {
          chartData.push({
            time: currentMonthData[index].time,
            id: currentMonthData[index].id,
            name: currentMonthData[index].iconType,
            remark: currentMonthData[index].remark,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            value: currentMonthData[index].income
          })
        }
      }
    };

    chartData = assembleChartData(currentMonthData, selectedExpenditure);
    console.log("chartData", chartData);
    setChartData(chartData);
  };

  const getIconByType = (iconType) => {
    const newIconList = [...iconList, ...incomeIconList];
    const matchItem = newIconList.find(item => item.name === iconType);
    const icon = { icon: matchItem?.icon, color: matchItem?.color };
    return icon || <span style={{ color: 'white', fontSize: 16 }}>●</span>;
  };




  useEffect(() => {
    const currentYearMonth = JSON.parse(sessionStorage.getItem("currentYearMonth"));
    setTimeText(`${currentYearMonth.year}年${currentYearMonth.month}月`);
    getChartData(currentYearMonth);
  }, []);

  useEffect(() => {
    getChartData(selectTime);
  }, [selectedExpenditure, selectedPeriod, selectTime]);


  return (
    <Box >
      {/* 年月周 */}
      <Box sx={{
        width: "100%",
        height: "40px",
        backgroundColor: "#c2c2c2",
        borderRadius: "10px",
        marginTop: "10px",
        display: "flex"
      }}>
        {periods.map((period) => (
          <Box
            key={period}
            onClick={() => handlePeriodClick(period)}
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              // 根据选中状态设置背景色
              backgroundColor: selectedPeriod === period ? "white" : "transparent",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              margin: "3px"
            }}
          >
            <Typography>{period}</Typography>
          </Box>
        ))}
      </Box>
      {/* 时间上下选择 */}
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
        <IconButton onClick={() => handleSelectTime("up")}>
          <ArrowCircleRightIcon color="primary" sx={{ transform: "rotate(180deg)" }} />
        </IconButton>
        <Typography>{timeText}</Typography>
        <IconButton onClick={() => handleSelectTime("down")}>
          <ArrowCircleRightIcon color="primary" />
        </IconButton>
      </Box>
      {/* <Box sx={{ width: "100%", height: "20vh" }}>
        <LinesCharts data={data} />
      </Box> */}
      <Box sx={{ backgroundColor: "white", borderRadius: "10px", marginTop: "10px", overflowY: "auto", maxHeight: "calc(100vh - 180px)" }}>
        {/* 图表 */}
        <Box sx={{ display: "flex", alignItems: "center", padding: "10px" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fedb43", borderRadius: "50%", width: "25px", height: "25px" }}>
            <PieChartIcon sx={{ fontSize: "20px", color: "white" }} />
          </Box>
          <Typography sx={{ marginLeft: "10px" }}>支出分类详情</Typography>
        </Box>
        <Box sx={{ width: "100%", height: "350px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {
            chartData && chartData.length < 1 && <Typography color='textSecondary'>暂无数据</Typography>
          }
          {
            chartData && chartData.length > 0 && <PieCharts data={chartData} />
          }
        </Box>
        {/* 支出/收入按钮 */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box sx={{
            width: "100px",
            height: "40px",
            backgroundColor: "#e3e3e3",
            borderRadius: "10px",
            marginTop: "10px",
            display: "flex"
          }}>
            {expenditures.map((period) => (
              <Box
                key={period}
                onClick={() => handleExpenditureClick(period)}
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: selectedExpenditure === period ? "white" : "transparent",
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                  margin: "3px"
                }}
              >
                <Typography>{period}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/* 详情总和 */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px", flexDirection: "column" }}>
          {chartData && chartData.length > 0 && chartData.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "90%",
                height: "60px",
                margin: "0 auto" // 居中显示
              }}
            >
              <Box
                sx={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: getIconByType(item.name).color,
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {getIconByType(item.name).icon}
              </Box>

              <Box sx={{ width: '85%' }}>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <Box sx={{ display: "flex" }}>
                    <Typography>{item.name}</Typography>
                    <Typography sx={{ color: "#9d9d9d", marginLeft: "10px" }}>
                      {item.percents}%
                    </Typography>
                  </Box>
                  <Typography sx={{ marginRight: "1px" }}>
                    ¥{item.value}
                  </Typography>
                </Box>

                <LinearProgressWithLabel
                  progress={item.percents}
                  color={item.color}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box >
  );
};

export default ChartPage;