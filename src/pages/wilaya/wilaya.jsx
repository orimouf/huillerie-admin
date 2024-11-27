import "./wilaya.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Goback from "../../components/goback/Goback"
import { wilayaColumns } from "../../datatablesource"
import { DataGrid } from '@mui/x-data-grid'
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"; 
import Loading from "../../components/loading/Loading"
import {wilayas} from "../../function/wilayas"
import Instance from '../../context/Instance'


const Wilaya = (props) => {
    const accessTokenObj = JSON.parse(localStorage.getItem('user')).accessToken 
    const [ data, setData ] = useState([])
    const [ loadingStatus, setLoadingStatus ] = useState(true)

useEffect(function () {
  setLoadingStatus(true)

    const fetchProductData = async () => {
        await Instance.get(`/wilayas/`, {
          headers: {}
        })
        .then(res => {
          const wilayasRows = res.data
          setLoadingStatus(false)
          setData(wilayasRows)
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
        });
    }
    fetchProductData()
          
},[ accessTokenObj])

const handleViewWilaya = (e, id) => {
  window.location.replace(`/wilayas/${id}`)
}

const handleAddAllWilayas = async () => {
  setLoadingStatus(true)
  wilayas.map(async wilaya => {
    await Instance.post(`/wilayas/`, wilaya, {
      headers: { token: `Bearer ${accessTokenObj}`}
    })
    .then(res => {
      const data = res.data;
       console.log(data);
       setLoadingStatus(false)
    }) 
    .catch(function (error) {
      if (error.response) {
        if (error.response.data.code === 11000) {
          console.log(`This <b>${Object.keys(error.response.data.keyValue)[0]}</b> already exist!`);
        }
      }
    });
  })
  
}

const actionWilayasColumn = [
  { field: "action", headerName: "Action", width: 350, renderCell:(params)=>{
      return(
        // (params.row.isValable) && 
          <>
          <div className="action Edit" onClick={(e) => handleViewWilaya(e, params.row._id)}>View</div> 
          {/* <div className="action Delete" onClick={(e) => handleDeleteProduct(e, params.row)}>Delete</div> */}
          </>
      )
  }}
]
  return (
    <div className='wilaya'>
      <Sidebar />
      <div className="wilayaContainer">
        <Navbar/>
        <Loading status={loadingStatus} page={"wilaya"} />
        <Goback title="Add Weekly Product Ratio" btn={<div></div>}/>
        <div className="top">
          <button type="submit" className="action addAllWilayas" onClick={handleAddAllWilayas}>Ajouter Tous Les Wilayas</button>
          <Link to="/wilaya/new"><button type="submit" className="action addProduct">Ajouter un produit</button></Link>
          <div className="hidenMsg"><span id="msgRequest"></span></div>
        </div>
        <div className="bottom">
            <DataGrid
                className="datagrid"
                getRowId={(row) => row._id}
                rows={data}
                columns={wilayaColumns.concat(actionWilayasColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
            />
        </div>
      </div>
    </div>
  )
}

export default Wilaya