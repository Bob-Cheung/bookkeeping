import React, { useState } from 'react';
import { deleteData, modifyData, getIconByType } from '../utils.js';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
} from '@mui/material';
import { iconList, incomeIconList } from '../page/icon.js';

const DataCar = (props) => {
  const [activeRemarkInputId, setActiveRemarkInputId] = useState(null);
  const [remarkValue, setRemarkValue] = useState('');
  const [activeexpenditureInputId, setActiveexpenditureInputId] = useState(null);
  const [expenditureValue, setExpenditureValue] = useState('');

  const handleTextClick = (itemId) => {
    setActiveexpenditureInputId(null);
    setActiveRemarkInputId(itemId);
  };

  const handleexpenditureClick = (itemId) => {
    setActiveRemarkInputId(null);
    setActiveexpenditureInputId(itemId);
  };

  // 聚焦
  const handleRemarkFocus = (itemId, value) => {
    setRemarkValue(value);
  };
  // 失焦
  const handleRemarkBlur = (itemId, time) => {
    setActiveRemarkInputId(null);
    const newData = { 'remark': remarkValue };
    modifyData(time, itemId, newData);
    props.handleUpdateData();
  };

  const handleExpenditureFocus = (itemId, value) => {
    setExpenditureValue(value);
  };
  const handleExpenditureBlur = (itemId, time) => {
    setActiveexpenditureInputId(null);
    let type;
    if (Number(expenditureValue) > 0) {
      type = 'income';
    } else {
      type = 'expenditure';
    }
    const newData = { [type]: Math.abs(Number(expenditureValue)) };
    modifyData(time, itemId, newData);
    props.handleUpdateData();
  };

  const handleDelete = (id, time) => {
    deleteData(id, time);
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
  return (
    <>
      {
        props.data.length === 0 &&
        <Paper
          elevation={3}
          sx={{ width: '100%', borderRadius: '20px', margin: '10px 0', height: "92%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography color='textSecondary'>暂无数据</Typography>
        </Paper>
      }
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
            elevation={3}
            sx={{ width: '100%', borderRadius: '20px', margin: '10px 0' }}
          >
            <Box sx={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>

              {/* 头部：日期 + 汇总 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ fontSize: 14, color: '#8c8c8c' }}>
                    {formatDate(date)}
                  </Typography>
                  <Typography sx={{ fontSize: 14, pl: 1, color: '#8c8c8c' }}>
                    {getWeekday(date)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex' }}>
                  {
                    expenditure &&
                    <Typography sx={{ fontSize: 14, color: '#8c8c8c' }}>
                      支出 {totalExpenditure}
                    </Typography>
                  }
                  {
                    incomeState &&
                    <Typography sx={{ fontSize: 14, color: '#8c8c8c', paddingLeft: '10px' }}>
                      收入 {totalIncome}
                    </Typography>
                  }
                </Box>
              </Box>

              <Box sx={{ height: '1px', bgcolor: '#c1c1d0', my: 1 }} />

              {/* 当天的每一条记录 */}
              {items.map((item, index) => {
                // console.log("当月每条数据", item),
                const displayText = item.remark ? item.remark : item.iconType;
                return (
                  <Box
                    key={index.id}
                    sx={{
                      height: 50,
                      display: 'flex',
                      // justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ background: item.income ? "#66BB6A" : "#FF6347", display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '50%', mr: 1 }}>
                          {getIconByType(item.iconType).icon}
                        </Box>
                        {activeRemarkInputId !== item.id &&
                          <Typography sx={{ ml: 2 }} onClick={() => handleTextClick(item.id)}>{displayText}</Typography>
                        }

                        {activeRemarkInputId === item.id &&
                          <TextField
                            variant="outlined"
                            size="small"
                            sx={{ width: '100px' }}
                            value={remarkValue}
                            autoFocus
                            onFocus={() => handleRemarkFocus(item.id, displayText)}
                            onBlur={() => handleRemarkBlur(item.id, item.time)}
                            onChange={(e) => setRemarkValue(e.target.value)}
                          />
                        }

                      </Box>
                      <Box onClick={() => handleexpenditureClick(item.id)}>
                        {
                          activeexpenditureInputId !== item.id &&
                          <Typography>{item.expenditure ? "-" + item.expenditure : item.income}</Typography>
                        }
                        {activeexpenditureInputId === item.id &&
                          <TextField
                            // placeholder={item.expenditure ? "-" + item.expenditure : item.income}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100px' }}
                            type='number'
                            autoFocus
                            value={expenditureValue}
                            onChange={(e) => setExpenditureValue(e.target.value)}
                            onFocus={() => handleExpenditureFocus(item.id, item.expenditure ? "-" + item.expenditure : item.income)}
                            onBlur={() => handleExpenditureBlur(item.id, item.time)}
                          />
                        }
                      </Box>

                      <Button sx={{ position: 'relative', right: 0 }} onClick={() => handleDelete(item.id, item.time)}>删除</Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        );
      })}
    </>
  );
};

export default DataCar;