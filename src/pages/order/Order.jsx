import "./order.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
// import Chart from "../../components/chart/Chart"
// import List from "../../components/table/Table"
// import Featured from '../../components/featured/featured'
import { ordersCartColumns } from "../../datatablesource"
import { DataGrid } from '@mui/x-data-grid'
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import Goback from "../../components/goback/Goback"
import { TopPopUpMsg } from "../../components/popupmsg/js/topmsg"
import Instance from '../../context/Instance'

const Order = () => {
  const params = useParams();
  const accessTokenObj = JSON.parse(localStorage.getItem('user')).accessToken  
  const [ arrayData, setArrayData ] = useState([])
  const [ order, setOrder ] = useState([])
  
  useEffect(function () {

    const fetchOrderData = async () => {
      await Instance.get(`/orders/find/${params.orderId}`, {
        headers: { token: `Bearer ${accessTokenObj}` }
      })
      .then(res => {
        const data = res.data
        setOrder(data)
        let array = []
        data.cart.map((product, i) => (

          array.push(
            {
              id: i+1,
              _id: product._id,
              productId: product.productId,
              productName: product.productName,
              productColor: product.productColor,
              productPrice: product.productPrice,
              productPromoPrice: product.productPromoPrice,
              productPic: product.productPic,
              productQty: product.productQty,
              totalPrice: product.totalPrice,
              isValable: product.isValable,
              isPromo: product.isPromo,
            }
          )
              
        ))
        setArrayData(array)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
        }
      });
    };
    fetchOrderData();

  },[accessTokenObj, params.orderId])

  const handleIsOut = async () => {
    document.getElementsByClassName("orderSend")[0].innerHTML = "Wait ...";
    document.getElementsByClassName("orderSend")[0].style = "pointer-events: none";

    if (order.isConfirm) {
      order.isOut = true;

      await Instance.put(`/orders/${params.orderId}`, order,  
        { headers: { token: `Bearer ${accessTokenObj}` } })
      .then(res => {
        if (res.status === 200) {
          setOrder(res.data)
          TopPopUpMsg(5, `Order is now "Expédié".`)
          document.getElementsByClassName("orderSend")[0].innerHTML = "Commande envoyer";
          document.getElementsByClassName("orderSend")[0].style = "pointer-events: all";
        }
      }) 
      .catch(function (error) {
        if (error.response) {
          if (error.response.data.code === 11000) {
            console.log(error.response.data);
          }
        }
      });
    } else {
      alert("This Order is not Confirm you need to confirmet first!")
    }
  }
  
  return (
    <div className="order">
      <Sidebar />
      <div className="orderContainer">
        <Navbar/>
        <Goback title="Orders" btn={<div></div>}/>
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
               <div className="detailItem">
                  <span className="itemKey">Full Name:</span>
                  <span className="itemValue">{order.firstName} {order.lastName}</span>
                </div>
               <div className="detailItem">
                  <span className="itemKey">Wilaya:</span>
                  <span className="itemValue">{order.wilaya}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Daira:</span>
                  <span className="itemValue">{order.daira}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">{order.address}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Numero de Telephon:</span>
                  <span className="itemValue">{order.numberTel1} {order.numberTel2}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Reception Method:</span>
                  <span className="itemValue">{order.recpMethod}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Order Price:</span>
                  <span className="itemValue">{order.orderPrice}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Status Confirmation:</span>
                  <span className="itemValue">{order.isConfirm ? "Confirmer" : "No Confirmer"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Status Expédié:</span>
                  <span className="itemValue">{order.isOut ? "Expédié" : "No Expédié"}</span>
                </div>
                <div></div>
                <div></div>
                <div className="actionContainer" style={{display: `${order.isOut ? "none" : "flex"}`}}>
                  <button type="submit" className="action orderSend" onClick={handleIsOut}>Commande envoyer</button>
                </div>
                
            </div>
          </div>
        </div>
        {/* <div className="midel">
          <div className="left">
            <Featured />
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months )" />
          </div>
        </div> */}
        <div className="bottom dataTable">
            <h1 className="title">Order Cart</h1>
            {/* <List data={arrayData} packageInfo={packageInfo} /> */}
            <DataGrid
                className="datagrid"
                rows={arrayData}
                columns={ordersCartColumns}
                rowHeight={100}
                pageSize={12}
                rowsPerPageOptions={[12]}
                checkboxSelection
            />
        </div>
      </div>
    </div>
  )
}

export default Order