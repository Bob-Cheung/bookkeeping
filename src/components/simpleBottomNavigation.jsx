import React, { useState, useEffect } from 'react';

import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';


import AddDatapage from '../page/addData';

const SimpleBottomNavigation = (props) => {

  // 自定义记账函数
  const handleAdd = () => {
    JSON.parse(localStorage.getItem("allData"));
    console.log('记账');
    props.handleOpenAddDataPage(true);
  }


  return (
    <>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, }}>
        <BottomNavigation
          showLabels
          value={props.pageValue}
          onChange={(event, newValue) => {
            // 过滤掉第三个选项（记账）的点击
            if (newValue !== 2) {
              props.onPageChange(event, newValue);
            }
          }}
        >
          <BottomNavigationAction label="首页" icon={<HouseIcon />} />
          <BottomNavigationAction label="图表" icon={<BarChartIcon />} />
          <BottomNavigationAction label="记账"
            sx={{
              paddingTop: '23px',
            }}
            icon={
              <Box
                sx={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  position: 'absolute',
                  bottom: '30px',
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  backgroundColor: '#fedb43',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AddIcon sx={{ fontSize: 30 }} />
              </Box>
            }
            onClick={handleAdd}
          />
          <BottomNavigationAction label="资产" icon={<AccountBalanceWalletIcon />} />
          <BottomNavigationAction label="我的" icon={<AccountCircleIcon />} />
        </BottomNavigation>
      </Paper>
      {/* 数据添加组件 */}
      <AddDatapage
        openAddDataPage={props.openAddDataPage}
        handleOpenAddDataPage={props.handleOpenAddDataPage}
      />
    </>
  );
};

export default SimpleBottomNavigation;