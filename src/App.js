import { Route, Routes, Navigate } from 'react-router-dom';
import './style/dark.scss';
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Single from './pages/single/Single'
import New from './pages/new/New'
import List from './pages/list/List'
import Error404 from './pages/error404/Error404'
import { investorInputs, userInputs, clientInputs } from './formSource'
import { useContext } from 'react'
import { DarkModeContext } from './context/darkModeContext'
import { AuthContext } from './context/authContext/AuthContext'
import Order from './pages/order/Order'
import ViewWilaya from './pages/viewWilaya/ViewWilaya'
import Wilaya from './pages/wilaya/wilaya'
import Pay from './pages/pay/Pay'
import SetProduct from './pages/setProduct/SetProduct'
import Edit from './pages/edit/Edit';

function App() {
  
  const { darkMode } = useContext(DarkModeContext)
  const { user } = useContext(AuthContext)

  return (
    <div className={darkMode ? "App dark" : "App"}>
      {/* <div id='popupBox' className='confirmBox'><Confirmbox /></div> */}
      <Routes>
        <Route path='/'>
          <Route index element={user ? <Home /> : <Navigate to="/login" /> } />
          <Route path='login' element={user ? <Navigate to="/" /> : <Login />} />
          {(user &&
          <>
            <Route path='*' element={<Error404 />}/>
            <Route path='users'>
              <Route index element={<List title="Users" />} />
              <Route path=':userId' element={<Single />} />
              <Route path='new' element={<New inputs={userInputs} title="User" />} />
            </Route>
            <Route path='clients'>
              <Route index element={<List title="Clients" page="Clients" />} />
              <Route path=':userId' element={<Single />} />
              <Route path='new' element={<New inputs={clientInputs} title="Clients" />} />
            </Route>
            <Route path='investors'>
              <Route index element={<List title="Investors" />} />
              <Route path='new' element={<New inputs={investorInputs} title="Investor" />} />
            </Route>
            <Route path='orders'>
              <Route index element={<List title="Orders" page="New" />} />
              <Route path='confirmed' element={<List title="Orders" page="Confirmed" />} />
              <Route path=':orderId' element={<Order />} />
              <Route path='new' element={<New inputs={investorInputs} title="Investor" />} />
            </Route>
            <Route path='wilayas'>
              <Route index element={<Wilaya title="Wilayas" />} />
              <Route path=':wilayaId' element={<ViewWilaya />} />
            </Route>
            <Route path='setproduct'>
              <Route index element={<SetProduct title="setproduct" />} />
              <Route path='new' element={<New inputs={clientInputs} title="Product" />} />
              <Route path='edit/:productId' element={<Edit title="Product" />} />
            </Route>
            <Route path='pay'>
              <Route index element={<Pay title="Pay" />} />
            </Route>
          </>)
          || <Route path='*' element={<Error404 />}/> }
        </Route>
      </Routes>
    </div>
  );
}

export default App;
