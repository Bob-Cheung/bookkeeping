import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  Button
} from '@mui/material';
import WheelColumn from './wheelColumn';

const SelectTime = (props) => {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(6);

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
    props.handleOpenSelectTime(false);
    props.handleSelectTime(year, month);
  };

  useEffect(() => {
    if (props.openSelectTime) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      // 优化：年份边界限制（确保当前年份在2026-2036范围内，超出则取边界值）
      const targetYear = Math.max(startYear, Math.min(currentYear, endYear));

      // 更新状态，同步当前日期
      setYear(targetYear);
      setMonth(currentMonth);
    }
  }, [props.openSelectTime, startYear, endYear]);

  return (
    <Drawer open={props.openSelectTime} anchor={"bottom"} onClose={() => props.handleOpenSelectTime(false)}>
      <Box sx={{ width: "100%", height: "40vh" }} role="presentation" >
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
          <Button onClick={() => props.handleOpenSelectTime(false)}>取消</Button>
          <Typography >选择月份</Typography>
          <Button onClick={handleConfirm}>确定</Button>
        </Box>
        <Box sx={{
          display: "flex", // 新增：横向排列年份和月份滚轮
          justifyContent: "center",
          gap: 6, // 新增：两个滚轮之间的间距
          py: 3 // 新增：上下内边距，优化布局
        }}>
          <WheelColumn data={years} value={year} onChange={setYear} />
          <WheelColumn data={months} value={month} onChange={setMonth} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default SelectTime;

