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
  { icon: <RestaurantIcon sx={{ fontSize: 25 }} />, name: "餐饮", color: "#FF6347" },
  { icon: <DirectionsBusIcon sx={{ fontSize: 25 }} />, name: "交通", color: "#00BFFF" },
  { icon: <DirectionsCarIcon sx={{ fontSize: 25 }} />, name: "汽车", color: "#FFD700" },
  { icon: <HouseIcon sx={{ fontSize: 25 }} />, name: "住宿", color: "#008000" },
  { icon: <PhoneInTalkIcon sx={{ fontSize: 25 }} />, name: "通讯", color: "#FF69B4" },
  // { icon: <AccountBalanceWalletIcon sx={{ fontSize: 25 }} />, name: "工资", color: "#FFA500" },
  { icon: <SchoolIcon sx={{ fontSize: 25 }} />, name: "学习", color: "#FF00FF" },
  { icon: <FlightTakeoffIcon sx={{ fontSize: 25 }} />, name: "旅行", color: "#FF0000" },
  { icon: <LiquorIcon sx={{ fontSize: 25 }} />, name: "烟酒", color: "#800080" },
  { icon: <AddShoppingCartIcon sx={{ fontSize: 25 }} />, name: "购物", color: "#00FFFF" },
  { icon: <RedeemIcon sx={{ fontSize: 25 }} />, name: "礼金", color: "#008080" },
  { icon: <PetsIcon sx={{ fontSize: 25 }} />, name: "宠物", color: "#FFC0CB" },
  { icon: <MedicalServicesIcon sx={{ fontSize: 25 }} />, name: "医疗", color: "#FFA500" },
  { icon: <PoolIcon sx={{ fontSize: 25 }} />, name: "运动", color: "#FF8C00" },
  { icon: <PhoneIphoneIcon sx={{ fontSize: 25 }} />, name: "数码", color: "#00FF00" },
];

const incomeIconList = [
  { icon: <LocalAtmIcon sx={{ fontSize: 25 }} />, name: "工资", color: "#FFA500" },
  { icon: <CandlestickChartIcon sx={{ fontSize: 25 }} />, name: "理财", color: "#0000FF" },
  { icon: <WorkHistoryIcon sx={{ fontSize: 25 }} />, name: "兼职", color: "#008000" },
  { icon: <AttachMoneyIcon sx={{ fontSize: 25 }} />, name: "其它", color: "#FFD700" },
];


export {
  iconList,
  incomeIconList,
}