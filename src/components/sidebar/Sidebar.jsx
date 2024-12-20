import './sidebar.scss'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
// import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Filter7Icon from '@mui/icons-material/Filter7';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext/AuthContext';
import { logout_ } from '../../context/authContext/ApiCalls';


const Sidebar = () => {

    const { dispatchMode } = useContext(DarkModeContext)
    const { dispatch } = useContext(AuthContext);

  const handleLogout = (e) => {
    logout_(dispatch);
  }

  return (
    <div className='sidebar'>
        <div className="top">
            <Link to="/" style={{ textDecoration: "none" }}>
                <span className='logo'>admin app</span>
            </Link>
        </div>
        <hr />
        <div className="center">
            <ul>
                <p className="title">MAIN</p>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <li>
                        <DashboardIcon className="icon" />
                        <span>Dashboard</span>
                    </li>
                </Link>
                <p className="title">LISTS</p>
                <Link to="/users" style={{ textDecoration: "none" }}>
                    <li>
                        <PeopleOutlineIcon className="icon" />
                        <span>Utilisateurs</span>
                    </li>
                </Link>
                <Link to="/clients" style={{ textDecoration: "none" }}>
                    <li>
                        <PersonAddAltIcon className="icon" />
                        <span>Clientèle</span>
                    </li>
                </Link>
                <Link to="/orders" style={{ textDecoration: "none" }}>
                    <li>
                        <PlaylistRemoveIcon className="icon" />
                        <span>Nouvelles commandes</span>
                    </li>
                </Link>
                <Link to="/orders/confirmed" style={{ textDecoration: "none" }}>
                    <li>
                        <PlaylistAddCheckIcon className="icon" />
                        <span>Commandes confirmées</span>
                    </li>
                </Link>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <li>
                        <LocalShippingOutlinedIcon className="icon" />
                        <span>Delivery</span>
                    </li>
                </Link>
                <p className="title">USEFUL</p>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <li>
                        <QueryStatsOutlinedIcon className="icon" />
                        <span>Stats</span>
                    </li>
                </Link>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <li>
                        <NotificationImportantOutlinedIcon className="icon" />
                        <span>Notifications</span>
                    </li>
                </Link>
                <p className="title">SERVICE</p>
                <Link to="/setproduct" style={{ textDecoration: "none" }}>
                    <li>
                        <ViewInArIcon className="icon" />
                        <span>Produits</span>
                    </li>
                </Link>
                <Link to="/wilayas" style={{ textDecoration: "none" }}>
                    <li>
                        <ShareLocationIcon className="icon" />
                        <span>Wilayas</span>
                    </li>
                </Link>
                <p className="title">USER</p>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <li>
                        <AdminPanelSettingsOutlinedIcon className="icon" />
                        <span>Profile</span>
                    </li>
                </Link>
                <Link to="/" onClick={handleLogout} style={{ textDecoration: "none" }}>
                    <li>
                        <LogoutOutlinedIcon className="icon" />
                        <span>Logout</span>
                    </li>
                </Link>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <li>
                        <SettingsOutlinedIcon className="icon" />
                        <span>Paramètres</span>
                    </li>
                </Link>
            </ul>
        </div>
        <div className="bottom">
            <div className="colorOption" onClick={() => dispatchMode({type:"LIGHT"})}></div>
            <div className="colorOption" onClick={() => dispatchMode({type:"DARK"})}></div>
        </div>
    </div>
  )
}

export default Sidebar