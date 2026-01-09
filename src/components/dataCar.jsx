import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';

import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const DataCar = (props) => {

  const groupedData = props.data.reduce((acc, item) => {
    if (!acc[item.time]) {
      acc[item.time] = [];
    }
    acc[item.time].push(item);
    return acc;
  }, {});

  const getWeekday = (dateStr) => {
    const weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekMap[new Date(dateStr).getDay()];
  };

  const formatDate = (dateStr) => dateStr.slice(5); // 01-01


  const dataTypeIcon = {
    "餐饮": <RestaurantIcon />,
    "汽车": <DirectionsCarIcon />,
    "交通": <DirectionsBusIcon />,
  };
  return (
    <>
      {Object.entries(groupedData).map(([date, items]) => {
        // console.log(date, items);
        const totalExpenditure = items.reduce((sum, i) => sum + i.expenditure, 0);
        const totalIncome = items.reduce((sum, i) => sum + i.income, 0);
        return (
          <Paper
            key={date}
            sx={{ width: '100%', borderRadius: '10px', margin: '10px 0' }}
          >
            <Box sx={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>

              {/* 头部：日期 + 汇总 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ fontSize: 14 }}>
                    {formatDate(date)}
                  </Typography>
                  <Typography sx={{ fontSize: 14, pl: 1 }}>
                    {getWeekday(date)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ fontSize: 14, color: '#c1c1d0' }}>
                    支出 {totalExpenditure}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: '#c1c1d0', paddingLeft: '10px' }}>
                    收入 {totalIncome}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ height: '1px', bgcolor: '#c1c1d0', my: 1 }} />

              {/* 当天的每一条记录 */}
              {items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    height: 50,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {dataTypeIcon[item.type]}
                    <Typography sx={{ ml: 2 }}>
                      {item.type}
                    </Typography>
                  </Box>

                  <Typography>
                    {item.expenditure}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        );
      })}
    </>
  );
};

export default DataCar;