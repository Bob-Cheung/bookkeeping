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

const SimpleBottomNavigation = (props) => {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, }}>
      <BottomNavigation
        showLabels
        value={props.pageValue}
        onChange={props.onPageChange}
      >
        <BottomNavigationAction label="首页" icon={<HouseIcon />} />
        <BottomNavigationAction label="图表" icon={<BarChartIcon />} />
        <BottomNavigationAction label="资产" icon={<AccountBalanceWalletIcon />} />
        <BottomNavigationAction label="我的" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default SimpleBottomNavigation;