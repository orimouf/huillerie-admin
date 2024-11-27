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
  const [img0, setImg0] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [viodeUrl, setViodeUrl] = useState("");
  const [product, setProduct] = useState([]);

  const fetchImageUploads = async (formData, type, number) => {
    await Instance.post(`/uploads/image/`, formData,  
      { headers: { token: `Bearer ${accessTokenObj}` } })
      .then(res => {
        if (res.status === 201) {
          if (type === "Many") {
            document.getElementById("spinner-5").style = "display: block";
            if (number === 0) {
              setImg1(res.data.imageUrl);
              document.getElementById("spinner-5").style = "display: none";
              document.getElementById("input-5").value = "";
              document.getElementById("input-5").style = "display: none";
              document.getElementById("file-5").innerHTML += "<p><b>Image 1 Upload</b></p>";
            }
            if (number === 1) {
              setImg2(res.data.imageUrl);
              document.getElementById("spinner-5").style = "display: none";
              document.getElementById("input-5").value = "";
              document.getElementById("file-5").innerHTML += "<p><b>Image 2 Upload</b></p>";
            }
            if (number === 2) {
              setImg3(res.data.imageUrl);
              document.getElementById("spinner-5").style = "display: none";
              document.getElementById("input-5").value = "";
              document.getElementById("file-5").innerHTML += "<p><b>Image 3 Upload</b></p>";
            }
          } if (type === "Single") {
            setImg0(res.data.imageUrl);
            document.getElementById("input-4").value = "";
            document.getElementById("file-4").innerHTML = "<p><b>Image Upload</b></p>";
            document.getElementById("spinner-4").style = "display: none";
          }
        } else {
          console.log(res.data.message);
        }
      }) 
      .catch(function (error) {
        if (error) {
          if (type === "Many") {
            document.getElementById("spinner-5").style = "display: none";
            document.getElementById("input-5").value = "";
            document.getElementById("input-5").style = "display: block";
          } else if (type === "Single") {
            document.getElementById("spinner-4").style = "display: none";
            document.getElementById("input-4").value = "";
            document.getElementById("input-4").style = "display: block";
          }
        }
        if (error.response) {
            if (error.response.data.code === 11000) {
              console.log(error.response.data);
            }
        }
      });
  }

  const fetchVideoUploads = async (formData) => {

    await Instance.post(`/uploads/video/`, formData,  
      { headers: { token: `Bearer ${accessTokenObj}` } })
      .then(res => {
        if (res.status === 201) {
          setViodeUrl(res.data.videoUrl);
          document.getElementById("input-6").value = "";
          document.getElementById("file-6").innerHTML = "<p><b>Video Upload</b></p>";
          document.getElementById("spinner-6").style = "display: none";
        } else {
          console.log(res.data.message);
        }
      }) 
      .catch(function (error) {
        if (error) {
          document.getElementById("spinner-6").style = "display: none";
          document.getElementById("input-6").value = "";
          document.getElementById("input-6").style = "display: block";
        }
        if (error.response) {
            if (error.response.data.code === 11000) {
              console.log(error.response.data);
            }
        }
    });
  }

  const handleUploadSingleImage = (file) => {  
    try {
      document.getElementById("input-4").style = "display: none";
      document.getElementById("spinner-4").style = "display: block";
  
      const formData = new FormData();
      formData.append('image', file);
        
      const imageUrl = fetchImageUploads(formData, "Single", 3) 
  
      if (imageUrl === "Image Not Upload") {
        document.getElementById("input-4").style = "display: block;border-bottom: 2px solid red;";
        document.getElementById("spinner-4").style = "display: none";
      }
    } catch (error) {
      console.log("---------" + error);
    }
  }

  const handleUploadManyImage = (e) => {  
    try {
      const inputs = e.target
      const selectedFiles = [...inputs.files];

      document.getElementById("input-5").style = "display: none";
      document.getElementById("spinner-5").style = "display: block";
  
      selectedFiles.map( (image, i) => {
        if (i <= 2) {
          const formData = new FormData();
          formData.append('image', image);
  
          fetchImageUploads(formData, "Many", i) 
        }
        return i
      })
        
      document.getElementById("input-5").style = "display: block;border-bottom: 2px solid green;";
      document.getElementById("spinner-5").style = "display: none";
    } catch (error) {
      console.log(error);
    }
  }

  const handleUploadVideo = (file) => {  
    try {
      document.getElementById("input-6").style = "display: none";
      document.getElementById("spinner-6").style = "display: block";
  
      const formData = new FormData();
      formData.append('video', file);
        
      const imageUrl = fetchVideoUploads(formData) 
  
      if (imageUrl === "Image Not Upload") {
        document.getElementById("input-6").style = "display: block;border-bottom: 2px solid red;";
        document.getElementById("spinner-6").style = "display: none";
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let jsonData = {}

    document.getElementsByClassName("sendBtn")[0].style = "pointer-events: none"
    document.getElementById("sendLabel").style = "display: none"
    document.getElementById("sendSpinner").style = "display: block"

    title === "User" ? 
      jsonData = {
        fullName: e.target[0].value,
        email: e.target[1].value,
        password: e.target[3].value,
        country: e.target[2].value,
        isAdmin: e.target[4].checked,
      } : 
      jsonData = {
        name: e.target[0].value,
        color: e.target[7].value,
        price: e.target[2].value,
        promoPrice: e.target[4].value,
        qty: e.target[8].value,
        productPic: img0,
        pathPic1: img1,
        pathPic2: img2,
        pathPic3: img3,
        pathVideo: viodeUrl,
        pathPicVideo: "https://res.cloudinary.com/dtfbpvtyg/image/upload/v1711601110/doflamingo/default_images/tnwpzvhzvpisjw13eato.jpg",
        productDescrption: e.target[6].value,
        isValable: true,
        isPromo: false
      }

    if (title === "Product") { 
      if (jsonData.name !== "" && jsonData.color !== "" && jsonData.price !== "" && jsonData.promoPrice !== "" && jsonData.productPic !== "" 
      && jsonData.pathPic1 !== "" !== "" && jsonData.pathVideo !== "" && jsonData.productDescrption !== "" && jsonData.qty !== "" ) {

        await Instance.post(`/products/`, jsonData, {
          headers: { token: `Bearer ${accessTokenObj}`}
        })
        .then(res => {
          const product = res.data;
          setProduct(product)
          document.getElementById("msgRequest").style.display = "none"
          document.getElementsByClassName("sendBtn")[0].style = "pointer-events: all"
          document.getElementById("sendLabel").style = "display: block"
          document.getElementById("sendSpinner").style = "display: none"       
          // popup msg in 5s
          TopPopUpMsg(5, `${title} ${product.name} is added successfully.`)
          document.getElementById("input-4").style = "display: block";
          document.getElementById("input-5").style = "display: block";
          document.getElementById("input-6").style = "display: block";
          document.getElementById("file-4").innerHTML = "";
          document.getElementById("file-5").innerHTML = "";
          document.getElementById("file-6").innerHTML = "";
          setImg0("");setImg1("");setImg2("");setImg3("");setViodeUrl("");
          e.target.reset()
        }) 
        .catch(function (error) {
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
            <div className="showContainer">
              {product.length !== 0 ? <ItemBanner key={product._id} _id={product._id} name={product.name} productPic={product.productPic} price={product.price} 
              promoPrice={product.promoPrice} isValable={product.isValable} isPromo={product.isPromo} /> 
              : <img className="noImage" src="https://media.istockphoto.com/vectors/no-image-available-sign-vector-id936182806?k=20&m=936182806&s=612x612&w=0&h=pTQbzaZhCTxWEDhnJlCS2gj65S926ABahbFCy5Np0jg="alt="" />}
            </div>
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>

              {title === "Product" && inputs.map((input) => {
                return (
                  input.type !== "file" ? <div key={input.id} className="formInput">
                                <label>{input.label}</label>
                                <input type={input.type} placeholder={input.placeholder} defaultValue={input.defaultValue} />
                              </div>
                  
                  : input.id === 4 ? <div key={input.id} className="formInput">
                  <label>Product Front Image</label>
                  <input id={"input-4"} type="file" accept="image/*" onChange={e=>handleUploadSingleImage(e.target.files[0])} />
                  <span><SyncIcon id={"spinner-4"} className="icnSpinner" /></span><span id={"file-4"}></span>
                </div> : input.id === 5 ? <div key={input.id} className="formInput">
                  <label>Product Auther Image</label>
                  <input id={"input-5"} type="file" accept="image/*" onChange={e=>handleUploadManyImage(e)} multiple />
                  <span><SyncIcon id={"spinner-5"} className="icnSpinner" /></span><span id={"file-5"}></span>
                </div> : <div key={input.id} className="formInput">
                  <label>Product Video</label>
                  <input id={"input-6"} type="file" accept="video/*" onChange={e=>handleUploadVideo(e.target.files[0])} />
                  <span><SyncIcon id={"spinner-6"} className="icnSpinner" /></span><span id={"file-6"}></span>
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