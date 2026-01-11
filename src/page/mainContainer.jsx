import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { getPhoneData } from '../utils.js';
import SimpleBottomNavigation from '../components/simpleBottomNavigation';
import HomePage from './home';
import ChartPage from './chartPage';
import AssetsPage from './assetsPage';
import MyPage from './myPage';


const MainContainer = () => {
  // 读取的所有数据
  const [allData, setAllData] = useState(getPhoneData() || []);
  const [pageValue, setPageValue] = useState(0);
  const [openAddDataPage, setOpenAddDataPage] = useState(false);
  const BOTTOM_NAV_HEIGHT = 56; // MUI BottomNavigation 默认高度

  //更新数据
  const handleUpdateData = () => {
    console.log("asdasdasd");
    const newData = getPhoneData();
    setAllData(newData);
  };

  useEffect(() => {
  }, [pageValue])
  const handleOpenAddDataPage = (newOpen) => {
    setOpenAddDataPage(newOpen);
  };
  return (
    <Box sx={{
      height: `calc(100vh - ${BOTTOM_NAV_HEIGHT}px)`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0 20px',
    }}>
      {pageValue === 0 && <HomePage allData={allData} />}
      {pageValue === 1 && <ChartPage />}
      {pageValue === 3 && <AssetsPage />}
      {pageValue === 4 && <MyPage />}

      <SimpleBottomNavigation
        openAddDataPage={openAddDataPage}
        pageValue={pageValue}
        handleOpenAddDataPage={handleOpenAddDataPage}
        onPageChange={(e, value) => setPageValue(value)}
        handleUpdateData={handleUpdateData}
      />
    </Box>
  );
};

export default MainContainer;