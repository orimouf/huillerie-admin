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

const New = ({ inputs, title }) => {

  const accessTokenObj = JSON.parse(localStorage.getItem('user')).accessToken  
  const [product, setProduct] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        entryTime: e.target[5].value,
        totalPrice: "0",
        paymentPrice: "0",
        restPrice: "0",
        paymentStatus: false,
        status: "Ne Passe Pas", //e.target[6].value,
        buckets5L: "0",
        otherBuckets: "0" 
      }

    if (title !== "User") { 
      if (jsonData.clientName !== "" && jsonData.phone !== "" && jsonData.nbrSacs !== "" && jsonData.nbrBuckets !== ""
       && jsonData.arrivalDate !== "" && jsonData.entryDate !== "" && jsonData.entryTime !== "" && jsonData.status !== "" ) {

      const postClient =  async () => { 
        await Instance.post(`/clients/`, jsonData, {
          headers: { token: `Bearer ${accessTokenObj}`,"Access-Control-Allow-Origin": "*" }
        })
        .then(res => {
          const client = res.data;
          console.log(client);
          
          // setProduct(product)
          document.getElementById("msgRequest").style.display = "none"
          document.getElementsByClassName("sendBtn")[0].style = "pointer-events: all"
          document.getElementById("sendLabel").style = "display: block"
          document.getElementById("sendSpinner").style = "display: none"       
          // popup msg in 5s
          TopPopUpMsg(5, `${title} ${client.clientName} is added successfully.`)
          document.getElementById("input-4").style = "display: block";
          document.getElementById("input-5").style = "display: block";
          document.getElementById("input-6").style = "display: block";
          document.getElementById("file-4").innerHTML = "";
          document.getElementById("file-5").innerHTML = "";
          document.getElementById("file-6").innerHTML = "";
          e.target.reset()
        }) 
        .catch(function (error) {
          console.log(error);
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
        e.target[6].value ? e.target[6].style.borderBottom = "1px solid gray" : e.target[6].style.borderBottom = "2px solid red"
        e.target[7].value ? e.target[7].style.borderBottom = "1px solid gray" : e.target[7].style.borderBottom = "2px solid red"
        e.target[8].value ? e.target[8].style.borderBottom = "1px solid gray" : e.target[8].style.borderBottom = "2px solid red"
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

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <Goback className="topBack" title={<h1>Add New {title}</h1>} btn={<Link to=""><div></div></Link>} />
        </div>
        <div className="bottom">
          <div className="left">
            <h4>{title} Card</h4>
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>

            {inputs.map((input) => {
                return (
                  
                  input.type === "radio" ? 
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <div className="radioInput">
                      <input type={input.type} name="status" value=""/>
                      <label>Passe</label>
                    </div>
                    <div className="radioInput">
                      <input type={input.type} name="status" value=""/>
                      <label>Ne Passe Pas</label>
                    </div>
                    <div className="radioInput">
                      <input type={input.type} name="status" value=""/>
                      <label>Pas présent</label>
                    </div>
                  </div>
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