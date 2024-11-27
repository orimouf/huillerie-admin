import "./viewWilaya.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
// import Chart from "../../components/chart/Chart"
// import List from "../../components/table/Table"
// import Featured from '../../components/featured/featured'
import { dairaColumns } from "../../datatablesource"
import { DataGrid } from '@mui/x-data-grid'
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import Goback from "../../components/goback/Goback"
import { TopPopUpMsg } from "../../components/popupmsg/js/topmsg"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { v4 as uuidv4 } from 'uuid'
import { MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdb-react-ui-kit';
import Instance from '../../context/Instance'

const ViewWilaya = () => {

const params = useParams();
const accessTokenObj = JSON.parse(localStorage.getItem('user')).accessToken  
const [ arrayData, setArrayData ] = useState([])
const [ wilaya, setWilaya ] = useState([])
const [ centredModal, setCentredModal ] = useState(false);
const [ stopDesk, setStopDesk ] = useState([])
const [ isStopDesk, setIsStopDesk ] = useState(false);
const [ isAll, setIsAll ] = useState(false);
const [ isAllAction, setIsAllAction ] = useState(false);
const [ dPrice, setDPrice ] = useState("");
const [ selection, setSelection] = useState([])
  
useEffect(function () {

    const fetchWilayaData = async () => {
      await Instance.get(`/wilayas/find/${params.wilayaId}`, {
        headers: { token: `Bearer ${accessTokenObj}` }
      })
      .then(res => {
        const data = res.data
        setWilaya(data)
        
        let array = []
        data.dairas.map((daira, i) => (

          array.push(
            {
              id: i+1,
              code: daira.code,
              name: daira.name,
              ar_name: daira.ar_name,
              stopDesk: daira.stopDesk,
              domicilePrice: daira.domicilePrice,
              communes: daira.communes,
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
    fetchWilayaData();

  },[accessTokenObj, params.wilayaId])

    const toggleOpen = (e, data, action) => {
        setCentredModal(!centredModal);
        if (action === "StopDesk") {
            setIsStopDesk(true);
        } else if (action === "DomicilePrice"){
            setIsAll(false); 
            setIsStopDesk(false);
        } else if (action === "AllDP"){
            setIsAllAction(true);
            setIsAll(true); 
            setIsStopDesk(false);
        } else if (action === "AllSD"){
            setIsAllAction(false);
            setIsAll(true); 
            setIsStopDesk(false);
        }

        !centredModal && setStopDesk({"data": data.stopDesk, "code": data.code});
        !centredModal && setDPrice(data.domicilePrice);
    }

    const handleEdit = (e, id) => {
        e.target.style.display = "none"
        document.getElementById(`editForm-${id}`).style.display = "flex"
    }

    const handleSave = async (e, id) => {
        document.getElementById(`save-${id}`).innerHTML = "Wait...";
        document.getElementById(`save-${id}`).style.pointerEvents = "none";
        const dataToEdit = stopDesk.data.find(e => e.id === id);
        const name = document.getElementById(`name-${id}`).value;
        const price = document.getElementById(`price-${id}`).value;

        dataToEdit.name = name;
        dataToEdit.price = price;
        stopDesk.data.map(e => e.id === id ? e = dataToEdit : e = e);
        arrayData.map(e => e.code === stopDesk.code ? e.stopDesk = stopDesk.data : e.stopDesk = e.stopDesk);
        wilaya.dairas = arrayData;

        await Instance.put(`/wilayas/${params.wilayaId}`, wilaya,  
        { headers: { token: `Bearer ${accessTokenObj}` } })
        .then(res => {
            if (res.status === 200) {
                document.getElementById(`save-${id}`).innerHTML = "Save";
                document.getElementById(`save-${id}`).style.pointerEvents = "all";
                document.getElementById(`editinput-${id}`).style.display = "block";
                document.getElementById(`editForm-${id}`).style.display = "none";
                setWilaya(res.data)
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

    const handleAdd = async (e) => {
        e.target.style.display = "none"
        document.getElementById(`addForm`).style.display = "flex"
    }
    
    const handleDelete = async (e, id) => {

        if (window.confirm(`you want to delete this Stop Desk ?`)) {
            const newStopDesk = stopDesk.data.filter(e => e.id !== id)
            
            arrayData.map(e => e.code === stopDesk.code ? e.stopDesk = newStopDesk : e.stopDesk = e.stopDesk);
            wilaya.dairas = arrayData;

            await Instance.put(`/wilayas/${params.wilayaId}`, wilaya,  
            { headers: { token: `Bearer ${accessTokenObj}` } })
            .then(res => {
                if (res.status === 200) {
                    setWilaya(res.data)
                    toggleOpen()
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
    }

    const handleAddStopDesk = async (e) => {
        document.getElementById(`add`).innerHTML = "Wait...";
        document.getElementById(`add`).style.pointerEvents = "none";
        
        const uniqueId = uuidv4()
        const name = document.getElementById(`name`).value;
        const price = document.getElementById(`price`).value;
        
        stopDesk.data.push({"id": uniqueId, "name": name, "price": price});
        arrayData.map(e => e.code === stopDesk.code ? e.stopDesk = stopDesk.data : e.stopDesk = e.stopDesk);
        wilaya.dairas = arrayData;

        await Instance.put(`/wilayas/${params.wilayaId}`, wilaya,  
        { headers: { token: `Bearer ${accessTokenObj}` } })
        .then(res => {
            if (res.status === 200) {
                document.getElementById(`add`).innerHTML = "Save";
                document.getElementById(`add`).style.pointerEvents = "all";
                document.getElementById(`btn-add`).style.display = "block";
                document.getElementById(`addForm`).style.display = "none";
                setWilaya(res.data)
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

    const handleEditDP = async (e) => {
        
        const price = document.getElementById(`priceDP`).value;
        
        arrayData.map(e => e.code === stopDesk.code ? e.domicilePrice = price : e.domicilePrice = e.domicilePrice);
        wilaya.dairas = arrayData;

        await Instance.put(`/wilayas/${params.wilayaId}`, wilaya,  
        { headers: { token: `Bearer ${accessTokenObj}` } })
        .then(res => {
            if (res.status === 200) {
                setWilaya(res.data)
                toggleOpen()
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

    const handleEditSelected = async (e, action) => {
        
        if (action === "DP" && selection.length !== 0) {
            const price = document.getElementById("priceAllDP").value

            selection.map(selectedId => arrayData.find((item) => item.id === selectedId))
            .map(e => e.domicilePrice = price)

            wilaya.dairas = arrayData;

            await Instance.put(`/wilayas/${params.wilayaId}`, wilaya,  
            { headers: { token: `Bearer ${accessTokenObj}` } })
            .then(res => {
                if (res.status === 200) {
                    setWilaya(res.data)
                    toggleOpen()
                }
            }) 
            .catch(function (error) {
                if (error.response) {
                    if (error.response.data.code === 11000) {
                        console.log(error.response.data);
                    }
                }
            });
        } else if (action === "SD" && selection.length !== 0) {
            const uniqueId = uuidv4()
            const name = document.getElementById("nameAllSD").value
            const price = document.getElementById("priceAllSD").value

            selection.map(selectedId => arrayData.find((item) => item.id === selectedId))
            .map(e => e.stopDesk = [{"id": uniqueId, "name": name, "price": price}])

            wilaya.dairas = arrayData;

            await Instance.put(`/wilayas/${params.wilayaId}`, wilaya,  
            { headers: { token: `Bearer ${accessTokenObj}` } })
            .then(res => {
                if (res.status === 200) {
                    setWilaya(res.data)
                    toggleOpen()
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
    }
  
  const actionDairasColumn = [
    { field: "action", headerName: "Action", width: 350, renderCell:(params)=>{
        return(
          // (params.row.isValable) && 
            <div className="cellAction">
                <div className="action View" onClick={(e) => toggleOpen(e, params.row, "StopDesk")}>View StopDesk</div> 
                <div className="action Edit" onClick={(e) => toggleOpen(e, params.row, "DomicilePrice")}>Edit Domicile Price</div> 
                {/* <div className="action Delete" onClick={(e) => handleDeleteProduct(e, params.row)}>Delete</div> */}
            </div>
        )
    }}
  ]

  return (
    <div className="viewWilaya">
      <Sidebar />
      <div className="viewWilayaContainer">
        <Navbar/>
        <Goback title="Dairas" btn={<div></div>}/>

        <MDBModal tabIndex='-1' open={centredModal} setOpen={setCentredModal}>
            <MDBModalDialog centered id="dialog-container">
            <MDBModalContent id="dialog-content">
                <MDBModalHeader>
                    <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody className="d-flex gap-4">
                    {isStopDesk ? <div className="list-group mb-3" style={{width: "100%"}}>
                    {stopDesk.length !== 0 && stopDesk.data.map(sd => {
                        return  <div key={`${sd.name}${sd.id}`} className="mb-4">
                                    <div className="list-group-item d-flex align-items-center">
                                        <input id={`editinput-${sd.id}`} className="stopDeskInput Edit me-1" type="button" defaultValue="Edit" onClick={(e) => handleEdit(e, sd.id)} />
                                        <div className="ms-2 me-auto">{sd.name}</div>
                                        <span className="fw-bold">{sd.price}</span>
                                        <DeleteOutlineIcon className="icon deleteIcon" onClick={(e) => handleDelete(e, sd.id)} />
                                    </div>
                                    <div id={`editForm-${sd.id}`} className="list-group-item align-items-center" style={{display: "none"}}>
                                        <input id={`save-${sd.id}`} className="stopDeskInput Save me-1" type="button" defaultValue="Save" onClick={(e) => handleSave(e, sd.id)} />
                                        <input id={`name-${sd.id}`} className="me-1" type="text" defaultValue={sd.name} />
                                        <input id={`price-${sd.id}`} className="me-1" type="text" defaultValue={sd.price} />
                                    </div>
                                </div>
                    })}
                        <div id="addForm" className="list-group-item align-items-center" style={{display: "none"}}>
                            <input id="add" className="stopDeskInput Save me-1" type="button" defaultValue="ADD" onClick={(e) => handleAddStopDesk(e)} />
                            <input id="name" className="me-1" type="text" placeholder="Stop Desk Name"/>
                            <input id="price" className="me-1" type="text"  placeholder="Stop Desk Price"/>
                        </div>
                        <MDBBtn id="btn-add" className="w-f-a mt-3" onClick={(e) => handleAdd(e)}>Add StopDesk</MDBBtn> 
                    </div> 
                    : !isAll ? <div className="list-group mb-3" style={{width: "100%"}}>
                        <div className="list-group-item d-flex flex-column align-items-center">
                            <input id="priceDP" className="me-1" type="text" defaultValue={dPrice} placeholder="Edit Domicile Price" />
                            <MDBBtn id="btn-edit-DP" className="w-f-a mt-3" onClick={(e) => handleEditDP(e)}>Edit Domicile Price</MDBBtn> 
                        </div>
                    </div>
                    : isAllAction ? <div className="list-group mb-3" style={{width: "100%"}}>
                        <div className="list-group-item d-flex flex-column align-items-center">
                            <input id="priceAllDP" className="me-1" type="text" defaultValue={dPrice} placeholder="Edit All Domicile Price" />
                            <MDBBtn id="btn-edit-all-DP" className="w-f-a mt-3" onClick={(e) => handleEditSelected(e, "DP")}>Edit Domicile All Price</MDBBtn> 
                        </div>
                    </div>
                    : <div className="list-group mb-3" style={{width: "100%"}}>
                        <div className="list-group-item d-flex flex-column align-items-center">
                            <input id="nameAllSD" className="me-1" type="text" placeholder="Edit All Stop Desk Name" style={{width: "100%"}}/>
                            <input id="priceAllSD" className="me-1" type="text" defaultValue={dPrice} placeholder="Edit All Stop Desk Price" style={{width: "100%"}}/>
                            <MDBBtn id="btn-edit-all-SD" className="w-f-a mt-3" onClick={(e) => handleEditSelected(e, "SD")}>Edit Stop Desk All Price</MDBBtn> 
                        </div>
                    </div>
                        
                    
                    }
                    
                </MDBModalBody>
                <MDBModalFooter>
                </MDBModalFooter>
            </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
       
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
               <div className="detailItem">
                  <span className="itemKey">Wilaya Code:</span>
                  <span className="itemValue">{wilaya.code}</span>
                </div>
               <div className="detailItem">
                  <span className="itemKey">Wilaya Name:</span>
                  <span className="itemValue">{wilaya.name}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Wilaya Arabic Name:</span>
                  <span className="itemValue">{wilaya.ar_name}</span>
                </div>
                <button type="submit" className="action View" onClick={(e) => toggleOpen(e, "", "AllSD")}>Edit Selected StopDesk</button>
                <button type="submit" className="action Edit" onClick={(e) => toggleOpen(e, "", "AllDP")}>Edit Selected Domicile Price</button>
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
                columns={dairaColumns.concat(actionDairasColumn)}
                rowHeight={100}
                pageSize={12}
                rowsPerPageOptions={[12]}
                checkboxSelection
                gridRowId={(row) => row}
                onSelectionModelChange={setSelection}
            />
        </div>
      </div>
    </div>
  )
}

export default ViewWilaya