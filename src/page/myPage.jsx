import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
} from '@mui/material';
import SettingsItem from '../components/settingsItem';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const MyPage = () => {
  const [openSettingPage, setOpenSettingPage] = useState(false);
  const [quickMode, setQuickMode] = useState(JSON.parse(localStorage.getItem("quickMode")) || false);
  const [overspendPopup, setOverspendPopup] = useState(JSON.parse(localStorage.getItem("overspendPopup")) || true);

  const handleQuickModeChange = (event) => {
    const modeState = event.target.checked;
    setQuickMode(modeState);
    localStorage.setItem("quickMode", JSON.stringify(modeState));
  };

  const handleOverspendPopupChange = (event) => {
    console.log("handleOverspendPopupChange");
    const overspendState = event.target.checked;
    setOverspendPopup(overspendState);
    localStorage.setItem("overspendPopup", JSON.stringify(overspendState));
  };

  useEffect(() => {
    const overspendPopup = JSON.parse(localStorage.getItem("overspendPopup"));
    if (overspendPopup !== null) {
      setOverspendPopup(overspendPopup);
    };
  }, []);

  return (
    <Box >
      <Box
        sx={{ width: '100%', minHeight: '50px', backgroundColor: 'white', borderRadius: '10px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => setOpenSettingPage(true)}
      >
        <Box sx={{ width: '90%', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>设置</Typography>
          <IconButton sx={{ padding: 0 }} >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      <Drawer open={openSettingPage} anchor={"bottom"}>
        <Box sx={{ width: "100%", height: "100vh", backgroundColor: '#e3e3e3', display: 'flex', alignContent: 'center', flexDirection: 'column', }} role="presentation" >
          <Box sx={{ display: 'flex', paddingTop: '20px', paddingLeft: '10px' }} onClick={() => setOpenSettingPage(false)}>
            <ArrowBackIosIcon color="primary" />
            <Typography >设置</Typography>
          </Box>
          <SettingsItem
            text="秒开模式"
            description="开启后，启动应用直接进入记账界面"
            checked={quickMode}
            onChange={handleQuickModeChange}
          />
          <SettingsItem
            text="弹窗"
            description="开启后，应用会提示本月消费是否超支"
            checked={overspendPopup}
            onChange={handleOverspendPopupChange}
          />
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '90%', height: '60px', backgroundColor: 'white', borderRadius: '10px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography>版本号</Typography>
                </Box>
                <Typography>V1.0.3</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MyPage;