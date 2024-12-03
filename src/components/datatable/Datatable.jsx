import "./datatable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { userColumns, ordersColumns, clientsColumns } from "../../datatablesource"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { TopPopUpMsg } from "../../components/popupmsg/js/topmsg"
import Goback from "../goback/Goback";
import Loading from "../loading/Loading"
import Instance from '../../context/Instance'

const Datatable = ({ title, page }) => {

  const to = `/${title.toLowerCase()}/new`;
  const topTitle = `${page} ${title}`
  const accessTokenObj = JSON.parse(localStorage.getItem('user')).accessToken  
  const [ dataRows, setDataRows ] = useState([])
  const [ loadingStatus, setLoadingStatus ] = useState(true)

  useEffect(function () {
    setLoadingStatus(true)
    // const fetchData = async () => {

    //   await Instance.get(`${title.toLowerCase()}/`, {
    //     headers: { token: `Bearer ${accessTokenObj}` }
    //   })
    //   .then(res => {
    //     setLoadingStatus(false)
    //     const data = res.data
    //     data.map((e, i) => Object.assign(e, {id: i}));
        
    //     title === "Users" && setDataRows(data.map(e => e.isAdmin === true ? e.isAdmin = "ADMIN" :  e.isAdmin = "NOT ADMIN"));
    //     (title === "Orders" && page !== "Confirmed") ? setDataRows(data.filter(o => !o.isConfirm)) : setDataRows(data.filter(o => o.isConfirm));
    //     title === "Clients" && setDataRows(data);
        
    //   })
    //   .catch(function (error) {
    //     if (error.response) {
    //       console.log(error.response);
    //     }
    //   });
    // };
    // fetchData();
    setLoadingStatus(false)
  },[ accessTokenObj, title, page])

  const handleConfirmOut = async (_id, row, option) => {
    let labelMsg;

    (option === "Confirm") ? row.isConfirm = !row.isConfirm : row.isOut = !row.isOut;
    (option === "Confirm") ? labelMsg = "Confirmed" : labelMsg = "Expédié";

    await Instance.put(`${title.toLowerCase()}/${row._id}`, row,  
      { headers: { token: `Bearer ${accessTokenObj}` } })
    .then(res => {
      if (res.status === 200) {
        TopPopUpMsg(5, `${title} is now "${labelMsg}".`)
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

  const handleStatus = async (e, _id, row) => {
    const newStatus = e.target.value
    row.status = newStatus

    await Instance.put(`${title.toLowerCase()}/${row._id}`, row,  
      { headers: { token: `Bearer ${accessTokenObj}` } })
    .then(res => {
      if (res.status === 200) {
        TopPopUpMsg(5, `Status Order ${_id} is now "${newStatus}".`)
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

  const handleDelete = async (id, _id, fullName) => {
    if (window.confirm(`you want to delete ${title} " ${fullName} " ?`)) {
      setDataRows(dataRows.filter((item) => item.id !== id))
      await Instance.delete(`${title.toLowerCase()}/${_id}`, {
        headers: { token: `Bearer ${accessTokenObj}` }
      })
      .then(async res => {
        console.log(res.data);
      })
      .catch(function (error) {console.log(error.response)})
    }
  }

  const actionUserColumn = [
    { field: "action", headerName: "Action", width: 150, renderCell: (params)=>{
      return (
        <div className="cellAction">
          <Link to="/users/test" style={{ textDecoration: "none" }}>
            <div className="viewButton">View</div>
          </Link>
          <div className="deleteButton" onClick={()=>handleDelete(params.row.id, params.row._id, params.row.fullName, title)} title="Delete">Delete</div>
        </div>
      )
    }} 
  ]

  const actionInvestorColumn = [
    { field: "status", headerName: "Status", width: 200,
    renderCell:(params)=>{
        return(
            <select className="form-select" value={params.row.status} onChange={(e) => handleStatus(e, params.row._id, params.row)}>
                <option value="DEFAULT" disabled>Choose a status ...</option>
                <option value="I did not call">I did not call</option>
                <option value="One call and no response">One call and no response</option>
                <option value="More than one call and no response">More than one call and no response</option>
                <option value="Canceled">Canceled</option>
                <option value="Confirmed">Confirmed</option>
            </select>
        )
    }},
    { field: "isOut", headerName: "Shipping", width: 100, renderCell: (params)=>{
      return (
        <div className="cellShipping form-check form-switch">
          <input className="form-check-input" type="checkbox" role="switch" 
              onChange={()=>handleConfirmOut(params.row._id, params.row, "Out")} defaultChecked={params.row.isOut ? true : false}  />
        </div>
      )
    }},
    { field: "isConfirm", headerName: "Confirmation", width: 120, renderCell:(params)=>{
      return(
        <div className="cellConfirm form-check form-switch">
          <input className="form-check-input" type="checkbox" role="switch" 
                onChange={()=>handleConfirmOut(params.row._id, params.row, "Confirm")} defaultChecked={params.row.isConfirm ? true : false} />
        </div>
      )
    }},
    { field: "action", headerName: "Action", width: 250, renderCell: (params)=>{
      return (
        <div className="cellAction">
          <Link to={`/${title.toLowerCase()}/${params.row._id}`} style={{ textDecoration: "none" }}>
            <div className="viewButton">View</div>
          </Link>
          <div className="deleteButton" onClick={()=>handleDelete(params.row.id, params.row._id, `${params.row.firstName} ${params.row.lastName}`)} title="Delete">Delete</div>
        </div>
      )
    }} 
  ]


  return (
    <div className="datatable">
      <Loading status={loadingStatus} />
      <Goback title={topTitle} btn={<Link to={to} className="link">Add New</Link>}/>
      <DataGrid
        className="datagrid"
        getRowId={(row) => row._id}
        rows={dataRows}
        columns={title === "Users" ? userColumns.concat(actionUserColumn) : ordersColumns.concat(actionInvestorColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
      
    </div>
  )
}

export default Datatable