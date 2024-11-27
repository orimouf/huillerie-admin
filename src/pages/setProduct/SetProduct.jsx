import "./setProduct.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Goback from "../../components/goback/Goback"
import { clientsColumns } from "../../datatablesource"
import { DataGrid } from '@mui/x-data-grid'
import { TopPopUpMsg } from "../../components/popupmsg/js/topmsg"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"; 
import Loading from "../../components/loading/Loading"
import Instance from '../../context/Instance'


const SetProduct = (props) => {
    const accessTokenObj = JSON.parse(localStorage.getItem('user')).accessToken 
    const [ data, setData ] = useState([])
    const [ row, setRow ] = useState([])
    const [ loadingStatus, setLoadingStatus ] = useState(true)

useEffect(function () {
  setLoadingStatus(true)

    const fetchProductData = async () => {
        await Instance.get(`/products/`, {
          headers: {}
        })
        .then(res => {
          const productRows = res.data
          setLoadingStatus(false)
          setData(productRows)
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
        });
    }
    fetchProductData()
          
},[ row, accessTokenObj])

const handleEditProduct = (e, id) => {
  window.location.replace(`/setproduct/edit/${id}`)
}

const cloudinaryPublicId = (path) => {
  const pathArr = path.split("/");
  const i = pathArr.length;
  const arr = pathArr[i-1].split(".");
  return `${pathArr[i-3]}/${pathArr[i-2]}/${arr[0]}`;
}

const fetchCloudinaryDelete = async (formData, type) => {
  await Instance.delete(`/uploads/${type}`, {
      headers: { },
      data : formData
  })
    .then(res => {
      if (res.status === 201) {
          console.log(res.data);
      } else {
          console.log(res.data);
      }
    }) 
    .catch(function (error) {
      if (error.response) {
          if (error.response.data.code === 11000) {
            console.log(error.response.data);
          }
      }
    });
}

const handleDeleteProduct = async (e, row) => {
  const pic1PublicId = {"publicId": cloudinaryPublicId(row.productPic)} 
  const pic2PublicId = {"publicId": cloudinaryPublicId(row.pathPic1)}
  const pic3PublicId = {"publicId": cloudinaryPublicId(row.pathPic2)}
  const pic4PublicId = {"publicId": cloudinaryPublicId(row.pathPic3)}
  const vidioPublicId = {"publicId": cloudinaryPublicId(row.pathVideo)}
  let label = e.target.innerHTML;
  let classN = e.target.className;

  e.target.className = classN + " pointer-e-n"
  e.target.innerHTML = "Wait...";

  await Instance.delete(`/products/${row._id}`,  
    { headers: { token: `Bearer ${accessTokenObj}` } })
    .then(res => {
      if (res.status === 200) {
        console.log(res.data);
        fetchCloudinaryDelete(pic1PublicId, "image")
        fetchCloudinaryDelete(pic2PublicId, "image")
        fetchCloudinaryDelete(pic3PublicId, "image")
        fetchCloudinaryDelete(pic4PublicId, "image")
        fetchCloudinaryDelete(vidioPublicId, "video")
        e.target.innerHTML = label
      }
    }) 
    .catch(function (error) {
      if (error.response) {
          if (error.response.data.code === 11000) {
            console.log(error.response.data);
            e.target.innerHTML = label
          }
      }
  });

  setRow(row)
}

const handleValablePromo = async (e, row, option) => {
  let label = e.target.innerHTML;
  let classN = e.target.className;
  e.target.className = classN + " pointer-e-n"
  e.target.innerHTML = "Wait...";

  (option === "Valable") ? row.isValable = !row.isValable : row.isPromo = !row.isPromo
  
  await Instance.put(`/products/${row._id}`, row,  
    { headers: { token: `Bearer ${accessTokenObj}` } })
    .then(res => {
      if (res.status === 200) {
        console.log(res.data);
        e.target.innerHTML = label
      }
    }) 
    .catch(function (error) {
      if (error.response) {
          if (error.response.data.code === 11000) {
            console.log(error.response.data);
            e.target.innerHTML = label
          }
      }
  });

  setRow(row)
}

const actionProductColumn = [
  { field: "action", headerName: "Action", width: 350, renderCell:(params)=>{
      return(
        // (params.row.isValable) && 
          <>
          <div className="action Edit" onClick={(e) => handleEditProduct(e, params.row._id)}>Edit</div> 
          <div className="action Delete" onClick={(e) => handleDeleteProduct(e, params.row)}>Delete</div>
          <div className={params.row.isValable ? "action Approve" : "action Pending"}
          onClick={(e) => handleValablePromo(e, params.row, "Valable")}>{params.row.isValable ? "Available" : "Not Available"}</div>
          <div className={params.row.isPromo ? "action Approve" : "action Pending"}
          onClick={(e) => handleValablePromo(e, params.row, "Promo")}>{params.row.isPromo ? "Promotion" : "Not Promotion"}</div>
          </>
      )
  }}
]
  return (
    <div className='setProduct'>
      <Sidebar />
      <div className="setProductContainer">
        <Navbar/>
        <Loading status={loadingStatus} page={"setProduct"} />
        <Goback title="Add Weekly Product Ratio" btn={<div></div>}/>
        <div className="top">
          <Link to="/setproduct/new"><button type="submit" className="action addProduct">Ajouter un produit</button></Link>
          <div className="hidenMsg"><span id="msgRequest"></span></div>
        </div>
        <div className="bottom">
            <DataGrid
                className="datagrid"
                getRowId={(row) => row._id}
                rows={data}
                columns={clientsColumns.concat(actionProductColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
            />
        </div>
      </div>
    </div>
  )
}

export default SetProduct