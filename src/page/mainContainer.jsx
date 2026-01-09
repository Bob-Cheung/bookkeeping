import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SimpleBottomNavigation from '../components/simpleBottomNavigation';
import HomePage from './home';
import ChartPage from './chartPage';
import AssetsPage from './assetsPage';
import MyPage from './myPage';


const MainContainer = () => {
  const [pageValue, setPageValue] = useState(0);
  const BOTTOM_NAV_HEIGHT = 56; // MUI BottomNavigation 默认高度
  return (
    <Box sx={{
      height: `calc(100vh - ${BOTTOM_NAV_HEIGHT}px)`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0 20px',
    }}>
      {pageValue === 0 && <HomePage />}
      {pageValue === 1 && <ChartPage />}
      {pageValue === 2 && <AssetsPage />}
      {pageValue === 3 && <MyPage />}

      <SimpleBottomNavigation
        pageValue={pageValue}
        onPageChange={(e, value) => setPageValue(value)}
      />
    </Box>
  );
};

export default MainContainer;