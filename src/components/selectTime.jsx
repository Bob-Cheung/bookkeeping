import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  Button
} from '@mui/material';
import WheelColumn from './wheelColumn';
import { updateDays } from '../utils.js';

const SelectTime = (props) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(1);
  const [days, setDays] = useState([]);

  // 1. 生成月份数据：1月到12月（固定数组，直接创建）
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  // 2. 生成年份数据：从2026年开始，到10年后（即2026+10=2036年）
  const startYear = 2024;
  const endYear = startYear + 10; // 10年后的年份
  const years = Array.from(
    { length: endYear - startYear + 1 }, // 计算年份总数（包含首尾年）
    (_, index) => startYear + index // 从2026开始依次生成年份
  );


  const handleConfirm = () => {
    // 组装选中的年月数据，传递给父组件（需父组件接收）
    props.handleSelectTimeConfirm(year, month, day);
  };

  useEffect(() => {
    const days = updateDays(props.currentYearMonth);
    setDays(days);
  }, []);

  useEffect(() => {
    if (props.openSelectTime) {
      // 更新状态，同步当前日期
      setYear(props.currentYearMonth.year);
      setMonth(props.currentYearMonth.month);
    }
  }, [props.openSelectTime, startYear, endYear]);

  useEffect(() => {
    const days = updateDays({ year: year, month: month });
    setDays(days);
  }, [year, month]);


  return (
    <Drawer open={props.openSelectTime} anchor={"bottom"} onClose={() => props.handleOpenSelectTime(false)}>
      <Box sx={{ width: "100%", height: "40vh" }} role="presentation" >
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
          <Button onClick={() => props.handleOpenSelectTime(false)}>取消</Button>
          <Typography >选择日期</Typography>
          <Button onClick={handleConfirm}>确定</Button>
        </Box>
        <Box sx={{
          display: "flex", // 新增：横向排列年份和月份滚轮
          justifyContent: "center",
          gap: 6, // 新增：两个滚轮之间的间距
          py: 3 // 新增：上下内边距，优化布局
        }}>
          <WheelColumn data={years} value={year} text="年" onChange={setYear} />
          <WheelColumn data={months} value={month} text="月" onChange={setMonth} />
          {
            props.showDays &&
            <WheelColumn data={days} value={day} text="日" onChange={setDay} />
          }
        </Box>
      </Box>
    </Drawer>
  );
};

export default SelectTime;

