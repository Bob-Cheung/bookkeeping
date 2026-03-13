import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import HouseIcon from '@mui/icons-material/House';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
// import PaidIcon from '@mui/icons-material/Paid';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SchoolIcon from '@mui/icons-material/School';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LiquorIcon from '@mui/icons-material/Liquor';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RedeemIcon from '@mui/icons-material/Redeem';
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PoolIcon from '@mui/icons-material/Pool';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

const iconList = [
  { icon: <RestaurantIcon sx={{ fontSize: 25 }} />, name: "餐饮", color: "#FF8A65" },
  { icon: <DirectionsBusIcon sx={{ fontSize: 25 }} />, name: "交通", color: "#4FC3F7" },
  { icon: <DirectionsCarIcon sx={{ fontSize: 25 }} />, name: "汽车", color: "#FFD54F" },
  { icon: <HouseIcon sx={{ fontSize: 25 }} />, name: "住宿", color: "#81C784" },
  { icon: <PhoneInTalkIcon sx={{ fontSize: 25 }} />, name: "通讯", color: "#F06292" },
  // { icon: <AccountBalanceWalletIcon sx={{ fontSize: 25 }} />, name: "工资", color: "#FFA500" },
  { icon: <SchoolIcon sx={{ fontSize: 25 }} />, name: "学习", color: "#BA68C8" },
  { icon: <FlightTakeoffIcon sx={{ fontSize: 25 }} />, name: "旅行", color: "#E57373" },
  { icon: <LiquorIcon sx={{ fontSize: 25 }} />, name: "烟酒", color: "#9575CD" },
  { icon: <AddShoppingCartIcon sx={{ fontSize: 25 }} />, name: "购物", color: "#4DD0E1" },
  { icon: <RedeemIcon sx={{ fontSize: 25 }} />, name: "礼金", color: "#4DB6AC" },
  { icon: <PetsIcon sx={{ fontSize: 25 }} />, name: "宠物", color: "#A1887F" },
  { icon: <MedicalServicesIcon sx={{ fontSize: 25 }} />, name: "医疗", color: "#FFB74D" },
  { icon: <PoolIcon sx={{ fontSize: 25 }} />, name: "运动", color: "#90A4AE" },
  { icon: <PhoneIphoneIcon sx={{ fontSize: 25 }} />, name: "数码", color: "#AED581" },
];

const incomeIconList = [
  { icon: <LocalAtmIcon sx={{ fontSize: 25 }} />, name: "工资", color: "#FFCA28" },
  { icon: <CandlestickChartIcon sx={{ fontSize: 25 }} />, name: "理财", color: "#42A5F5" },
  { icon: <WorkHistoryIcon sx={{ fontSize: 25 }} />, name: "兼职", color: "#66BB6A" },
  { icon: <AttachMoneyIcon sx={{ fontSize: 25 }} />, name: "其它", color: "#FFA726" },
];


export {
  iconList,
  incomeIconList,
}