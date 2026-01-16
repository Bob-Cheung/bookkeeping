import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { requestStoragePermission, ensureMainFolder, getPhoneData } from '../utils.js';
import SimpleBottomNavigation from '../components/simpleBottomNavigation';
import HomePage from './home';
import ChartPage from './chartPage';
import AssetsPage from './assetsPage';
import MyPage from './myPage';


const MainContainer = () => {
  // 读取的所有数据
  const [allData, setAllData] = useState([]);
  const [pageValue, setPageValue] = useState(0);
  const [openAddDataPage, setOpenAddDataPage] = useState(false);
  const BOTTOM_NAV_HEIGHT = 56; // MUI BottomNavigation 默认高度
  const mainDirName = 'zhangLiang'; // 主文件夹名称

  //更新数据
  const handleUpdateData = async () => {
    const newData = await getPhoneData();
    if (newData) {
      setAllData(newData);
    } else {
      setAllData([]);
    };
  };

  const handleOpenAddDataPage = (newOpen) => {
    setOpenAddDataPage(newOpen);
  };

  const init = async () => {
    const currentYearMonth = {
      year: new Date().getFullYear(),
      month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    };
    sessionStorage.setItem("currentYearMonth", JSON.stringify(currentYearMonth));
    if (window.cordova) {
      // 获取权限
      await requestStoragePermission();
      // 创建主文件夹
      await ensureMainFolder(mainDirName);
    };
  };

  useEffect(() => {
    init();
    handleUpdateData();
  }, []);
  return (
    <Box sx={{
      height: `calc(100vh - ${BOTTOM_NAV_HEIGHT}px)`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0 20px',
    }}>
      {pageValue === 0 && <HomePage allData={allData} handleUpdateData={handleUpdateData} />}
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