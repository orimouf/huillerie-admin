import "./new.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useState } from "react"
import SyncIcon from '@mui/icons-material/Sync';
import Goback from "../../components/goback/Goback";
import { TopPopUpMsg } from "../../components/popupmsg/js/topmsg"
import ItemBanner from "../../components/ItamBanner/ItemBanner"
import { Link } from "react-router-dom"; 
import Instance from '../../context/Instance'
import Loading from '../../components/loading/Loading'

const New = ({ inputs, title }) => {

  const accessTokenObj = JSON.parse(localStorage.getItem('user')).accessToken;
  const [uniqueId, setUniqueId] = useState("000");
  const [clientName, setClientName] = useState("إسم الزبون");
  const [clientPhone, setClientPhone] = useState("رقم الزبون");
  const [numberSacs, setNumberSacs] = useState("0");
  const [numberBidons, setNumberBidons] = useState("0");
  const [arivalDate, setArivalDate] = useState("00-00-0000");
  const [entryDate, setEntryDate] = useState("00-00-0000");
  const [entryTime, setEntryTime] = useState("00:00");
  const [arrayTime, setArrayTime] = useState([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]);
  const [ loadingStatus, setLoadingStatus ] = useState(false)

  const handleListTime = async (e) => {
    e.preventDefault()
    setLoadingStatus(true)

    await Instance.get(`/lists/find/${e.target.value}`, {
      headers: { token: `Bearer ${accessTokenObj}`,"Access-Control-Allow-Origin": "*" }
    })
    .then(res => {
      const list = res.data;

      if (list === null) {
        setArrayTime([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        setLoadingStatus(false)
      } else {
        //"القائمة ممتلئة لهدا اليوم"
        setArrayTime(list.timeArray)
        setLoadingStatus(false)
      }
    }) 
    .catch(function (error) {
      console.log(error);
    });
  }

  const postList =  async (entryD, entryTimeIndex, uniqueId) => { 
    
    var numberOccuped = 0
    arrayTime.fill( uniqueId, parseInt(entryTimeIndex), (parseInt(entryTimeIndex) + 1) )
    arrayTime.map( (e, i) => (e === 0) && numberOccuped++) 

    await Instance.post(`/lists/`, {
      date: entryD,
      timeArray: arrayTime,
      status: (numberOccuped === 0) ? "Plen" : "En Coure"
    }, {
      headers: { token: `Bearer ${accessTokenObj}`,"Access-Control-Allow-Origin": "*" }
    })
    .then(res => {
        const list = res.data;
        console.log(list);
        setLoadingStatus(false)
      }) 
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingStatus(true)
    let jsonData = {}

    document.getElementsByClassName("sendBtn")[0].style = "pointer-events: none"
    document.getElementById("sendLabel").style = "display: none"
    document.getElementById("sendSpinner").style = "display: block"

    // const fetchUniqueId = async () => {
      await Instance.put(`/uniqueIds/`, {
        headers: { token: `Bearer ${accessTokenObj}` }
      })
      .then(res => {
        const uniqueId = res.data.uniqueId;
        const statusValue = e.target[6].checked ? e.target[6].value : e.target[7].checked ? e.target[7].value : e.target[8].value

        title === "User" ? 
      jsonData = {
        fullName: e.target[0].value,
        email: e.target[1].value,
        password: e.target[3].value,
        country: e.target[2].value,
        isAdmin: e.target[4].checked,
      } : 
      jsonData = {
        uniqueId: uniqueId,
        clientName: e.target[0].value,
        phone: e.target[9].value,
        nbrSacs: e.target[1].value,
        nbrBuckets: e.target[3].value,
        weight: "0",
        liters: "0",
        litersIn100Kg: "0",
        arrivalDate: e.target[2].value,
        entryDate: e.target[4].value,
        entryTime: fetchArray(parseInt(e.target[5].value)),
        totalPrice: "0",
        paymentPrice: "0",
        restPrice: "0",
        paymentStatus: false,
        status: statusValue,
        buckets5L: "0",
        otherBuckets: "0" 
      }

    if (title !== "User") { 
      if (jsonData.clientName !== "" && jsonData.phone !== "" && jsonData.nbrSacs !== "" && jsonData.nbrBuckets !== ""
       && jsonData.arrivalDate !== "" && jsonData.entryDate !== "" && jsonData.entryTime !== 0 && jsonData.status !== "" ) {

      const postClient =  async () => { 
        await Instance.post(`/clients/`, jsonData, {
          headers: { token: `Bearer ${accessTokenObj}`,"Access-Control-Allow-Origin": "*" }
        })
        .then(res => {
          const client = res.data;
          console.log(client);
          setUniqueId(client.uniqueId)
          setClientName(client.clientName)
          setClientPhone(client.phone)
          setNumberSacs(client.nbrSacs)
          setNumberBidons(client.nbrBuckets)
          setArivalDate(client.arrivalDate)
          setEntryDate(client.entryDate)
          setEntryTime(client.entryTime)
          
          // setProduct(product)
          document.getElementById("msgRequest").style.display = "none"
          document.getElementsByClassName("sendBtn")[0].style = "pointer-events: all"
          document.getElementById("sendLabel").style = "display: block"
          document.getElementById("sendSpinner").style = "display: none"       
          // popup msg in 5s
          TopPopUpMsg(5, `${title} ${client.clientName} is added successfully.`)
          postList(client.entryDate, e.target[5].value, client.uniqueId)
          e.target.reset()
        }) 
        .catch(function (error) {
          console.log(error);
          setLoadingStatus(false)
          if (error.response) {
            document.getElementsByClassName("sendBtn")[0].style = "pointer-events: all"
            document.getElementById("sendLabel").style = "display: block"
            document.getElementById("sendSpinner").style = "display: none" 
            document.getElementById("msgRequest").style.display = "block"
            if (error.response.status === 401) {
              document.getElementById("msgRequest").innerHTML = `${error.response.data}`
            }
            if (error.response.data.code === 11000) {
              document.getElementById("msgRequest").innerHTML = `This <b>${Object.keys(error.response.data.keyValue)[0]}</b> already exist!`
            }
          }
        });
      }
      postClient()
  
      } else {
        e.target[0].value ? e.target[0].style.borderBottom = "1px solid gray" : e.target[0].style.borderBottom = "2px solid red"
        e.target[1].value ? e.target[1].style.borderBottom = "1px solid gray" : e.target[1].style.borderBottom = "2px solid red"
        e.target[2].value ? e.target[2].style.borderBottom = "1px solid gray" : e.target[2].style.borderBottom = "2px solid red"
        e.target[3].value ? e.target[3].style.borderBottom = "1px solid gray" : e.target[3].style.borderBottom = "2px solid red"
        e.target[4].value ? e.target[4].style.borderBottom = "1px solid gray" : e.target[4].style.borderBottom = "2px solid red"
        e.target[5].value ? e.target[5].style.borderBottom = "1px solid gray" : e.target[5].style.borderBottom = "2px solid red"
        e.target[6].value ? e.target[6].style.accentColor = "auto" : e.target[6].style.accentColor= "red";
        e.target[9].value ? e.target[9].style.borderBottom = "1px solid gray" : e.target[9].style.borderBottom = "2px solid red"
        document.getElementsByClassName("sendBtn")[0].style = "pointer-events: all"
        document.getElementById("sendLabel").style = "display: block"
        document.getElementById("sendSpinner").style = "display: none"
      }
    }

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
        }
      });
    // };

  }

  const fetchArray = (index) => {    
    switch(index) {
      case 0:
        return '08:30';
      case 1:
        return '08:45';
      case 2:
        return '09:00';
      case 3:
        return '09:15';
      case 4:
        return '09:30';
      case 5:
        return '09:45';
      case 6:
        return '10:00';
      case 7:
        return '10:15';
      case 8:
        return '10:30';
      case 9:
        return '10:45';
      case 10:
        return '11:00';
      case 11:
        return '11:15';
      case 12:
        return '11:30';
      case 13:
        return '11:45';
      case 14:
        return '12:00';
      case 15:
        return '12:15';
      case 16:
        return '12:30';
      case 17:
        return '12:45';
      case 18:
        return '01:00';
      case 19:
        return '01:15';
      case 20:
        return '01:30';
      case 21:
        return '01:45';
      case 22:
        return '02:00';
      case 23:
        return '02:15';
      case 24:
        return '02:30';
      case 25:
        return '02:45';
      case 26:
        return '03:00';
      case 27:
        return '03:15';
      case 28:
        return '03:30';
      case 29:
        return '03:45';
      case 30:
        return '04:00';
      case 31:
        return '04:15';
      case 32:
        return '04:30';
      case 33:
        return '04:45';
      case 34:
        return '05:00';
      case 35:
        return '05:30';
      default:
        return 'إختر تاريخ الدخول أولا';
    }
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
      <Loading status={loadingStatus} page={"setProduct"} />
        <Navbar />
        <div className="top">
          <Goback className="topBack" title={<h1>Add New {title}</h1>} btn={<Link to=""><div></div></Link>} />
        </div>
        <div className="bottom">
          <div className="left">
            <div className="cardTitle">
              <h4>{title} Card</h4>
              <div className="printButton">
                  <button onClick={window.print} className="sendBtn"><b>Print</b></button>
              </div>
            </div>
            <div id="cardClient" className="card">
              <div className="cardLeft">
                <div className="item-L1"><h1>{uniqueId}</h1></div>
                <div className="item-L2"><h3>{clientName}</h3></div>
                <div className="item-L3"><h3>{clientPhone}</h3></div>
                <div className="item-L4"><h4>الوزن</h4></div>
                <div className="item-L5"><h4>اللترات</h4></div>
                <div className="item-L6"><h4>المردود</h4></div>
              </div>
              <div className="cardRight">
                <div className="item-R1">
                  <div><h3>الأكياس</h3></div>
                  <div><h1>{numberSacs}</h1></div>
                </div>
                <div className="item-R2">
                  <div><h3>الدلاء</h3></div>
                  <div><h1>{numberBidons}</h1></div>
                </div>
                <div className="item-R3">
                  <h5>يوم الوصول</h5>
                  <h6>{arivalDate}</h6>
                </div>
                <div className="item-R4">
                  <h5>يوم الدخول</h5>
                  <h6>{entryDate}</h6>
                </div>
                <div className="item-R5">
                  <h5>ساعة الدخول</h5>
                  <h6>{entryTime}</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>

            {inputs.map((input) => {
                return (
                  
                  input.type === "radio" ? 
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <div className="radioInput">
                      <input type={input.type} name="status" value="Passe"/>
                      <label>Passe</label>
                    </div>
                    <div className="radioInput">
                      <input type={input.type} name="status" value="Ne Passe Pas" defaultChecked/>
                      <label>Ne Passe Pas</label>
                    </div>
                    <div className="radioInput">
                      <input type={input.type} name="status" value="Pas présent"/>
                      <label>Pas présent</label>
                    </div>
                  </div>
                  : 
                  input.id === 6 ?
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input type={input.type} placeholder={input.placeholder} onChange={handleListTime} />
                  </div>
                  :
                  input.id === 3 ?
                  <select className="formInput" name="selectTime" id="selectTime" key={input.id} >
                    {arrayTime.map((e, i) =>
                      e === 0 && <option key={i} value={i}>{fetchArray(i)}</option>
                    )};
                  </select>
                  :
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input type={input.type} placeholder={input.placeholder} />
                  </div>

                )
              })}

              {title === "User" && 
                // return (
                  <div className="formInput checkbox">
                    <div className="checkbox">
                      <input type="checkbox" id="checkboxAdmin" name="checkboxAdmin" value="Admin"></input>
                      <label>Is Admin</label>
                    </div> 
                  </div>
                // )
              }
              <div className="formInput"><span id="msgRequest"></span></div>
              

              <div className="formInput">
                <button className="sendBtn">
                  <span id="sendLabel"><b>Send</b></span> 
                  <span><SyncIcon id="sendSpinner" className="icnSpinner" /></span></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default New