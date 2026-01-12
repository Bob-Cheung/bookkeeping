import React, { useRef, useState, useEffect } from 'react';
import { deleteData } from '../utils.js';
import {
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';

import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const DataCar = (props) => {

  const handleDelete = (id) => {
    deleteData(id);
    props.handleUpdateData();
  };

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
    "理财": <LocalAtmIcon />,
    "工资": <AttachMoneyIcon />,
  };
  return (
    <>
      {Object.entries(groupedData).map(([date, items]) => {
        // console.log(date, items);
        let totalExpenditure = 0;
        let totalIncome = 0;
        let incomeState = false;
        let expenditure = false;
        // 检查items中是否有income
        for (let i = 0; i < items.length; i++) {
          if (items[i].income) {
            incomeState = true;
            totalIncome += items[i].income;
          };
          if (items[i].expenditure) {
            expenditure = true;
            totalExpenditure += items[i].expenditure;
          };
        }
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
                  {
                    expenditure &&
                    <Typography sx={{ fontSize: 14, color: '#c1c1d0' }}>
                      支出 {totalExpenditure}
                    </Typography>
                  }
                  {
                    incomeState &&
                    <Typography sx={{ fontSize: 14, color: '#c1c1d0', paddingLeft: '10px' }}>
                      收入 {totalIncome}
                    </Typography>
                  }
                </Box>
              </Box>

              <Box sx={{ height: '1px', bgcolor: '#c1c1d0', my: 1 }} />

              {/* 当天的每一条记录 */}
              {items.map((item, index) => (
                // console.log("当月每条数据", item),
                <Box
                  key={index}
                  sx={{
                    height: 50,
                    display: 'flex',
                    // justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {dataTypeIcon[item.iconType]}
                      <Typography sx={{ ml: 2 }}>
                        {
                          item.remark ? item.remark : item.iconType
                        }
                      </Typography>
                    </Box>

                    <Typography>
                      {
                        item.expenditure ? "-" + item.expenditure : item.income
                      }
                    </Typography>

                    <Button sx={{ position: 'relative', right: 0 }} onClick={() => handleDelete(item.id)}>删除</Button>
                  </Box>
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