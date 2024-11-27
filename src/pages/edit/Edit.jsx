import "./edit.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useState, useEffect } from "react"
import SyncIcon from '@mui/icons-material/Sync';
import Goback from "../../components/goback/Goback";
import { TopPopUpMsg } from "../../components/popupmsg/js/topmsg"
import ItemBanner from "../../components/ItamBanner/ItemBanner"
import { useParams } from 'react-router-dom'
import Loading from "../../components/loading/Loading"
import Instance from '../../context/Instance'

const Edit = ({ title }) => {

  const accessTokenObj = JSON.parse(localStorage.getItem('user')).accessToken  

  const [product, setProduct] = useState([]);
  const [ loadingStatus, setLoadingStatus ] = useState(true)
  const params = useParams();

    useEffect(function () {
      setLoadingStatus(true)

      const fetchProductData = async () => {
        await Instance.get(`/products/find/${params.productId}`, {
          headers: {}
        })
        .then(res => {
          const productRows = res.data
          setLoadingStatus(false)
          setProduct(productRows)
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
        });
      }
      fetchProductData()
          
    },[ accessTokenObj])

  const fetchImageUploads = async (formData, id) => {
    let publicIdOldImage;

    await Instance.post(`/uploads/image/`, formData,  
      { headers: { token: `Bearer ${accessTokenObj}` } })
      .then(res => {
        if (res.status === 201) {
            if(id === 2) { 
                publicIdOldImage = {"publicId": cloudinaryPublicId(product.productPic)} 
                fetchCloudinaryDelete(publicIdOldImage, "image");
                handleUpdate("frontImage", res.data.imageUrl);
            }
            if(id === 4) { 
                publicIdOldImage = {"publicId": cloudinaryPublicId(product.pathPic1)} 
                fetchCloudinaryDelete(publicIdOldImage, "image");
                handleUpdate("Image1", res.data.imageUrl);
            }
            if(id === 6) { 
                publicIdOldImage = {"publicId": cloudinaryPublicId(product.pathPic2)} 
                fetchCloudinaryDelete(publicIdOldImage, "image");
                handleUpdate("Image2", res.data.imageUrl);
            }
            if(id === 8) { 
                publicIdOldImage = {"publicId": cloudinaryPublicId(product.pathPic3)} 
                fetchCloudinaryDelete(publicIdOldImage, "image");
                handleUpdate("Image3", res.data.imageUrl);
            }

            document.getElementById("sendLabel-"+id).style = "display: block";
            document.getElementById("input-" + id).value = "";
            document.getElementById("file-" + id).innerHTML = "<p><b>Image Upload</b></p>";
            document.getElementById("spinner-" + id).style = "display: none";
            document.getElementById("input-" + id).style = "display: block";
        } else {
            console.log(res.data.message);
            document.getElementById("sendLabel-"+id).style = "display: block";
            document.getElementById("input-" + id).value = "";
            document.getElementById("file-" + id).innerHTML = "";
            document.getElementById("spinner-" + id).style = "display: none";
            document.getElementById("input-" + id).style = "display: block";
        }
      }) 
      .catch(function (error) {
        if (error) {
            document.getElementById("input-" + id).style = "display: block";
            document.getElementById("sendLabel-"+id).style = "display: block";
            document.getElementById("input-" + id).value = "";
            document.getElementById("file-" + id).innerHTML = "";
            document.getElementById("spinner-" + id).style = "display: none";
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
            const publicIdOldVideo = {"publicId": cloudinaryPublicId(product.pathVideo)} 
            fetchCloudinaryDelete(publicIdOldVideo, "video");
            handleUpdate("video", res.data.videoUrl);

            document.getElementById("input-10").value = "";
            document.getElementById("file-10").innerHTML = "<p><b>Video Upload</b></p>";
            document.getElementById("spinner-10").style = "display: none";
            document.getElementById("sendLabel-10").style = "display: block";
            document.getElementById("input-10").style = "display: block";
        } else {
          console.log(res.data.message);
        }
      }) 
      .catch(function (error) {
        if (error) {
            document.getElementById("sendLabel-10").style = "display: block";
            document.getElementById("spinner-10").style = "display: none";
            document.getElementById("input-10").value = "";
            document.getElementById("input-10").style = "display: block";
        }
        if (error.response) {
            if (error.response.data.code === 11000) {
              console.log(error.response.data);
            }
        }
    });
  }

  const fetchCloudinaryDelete = async (formData, type) => {
    await Instance.delete(`/uploads/${type}`, {
        headers: { },
        data : formData
    })
      .then(res => {
        if (res.status === 201) {
            // console.log(res.data);
        } else {
            // console.log(res.data);
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

  const handleUploadSingleImage = (id) => {  
    try {
      let file = document.getElementById("input-"+id).files[0]
       
      document.getElementById("sendLabel-"+id).style = "display: none";
      document.getElementById("input-"+id).style = "display: none";
      document.getElementById("spinner-"+id).style = "display: block";
  
      const formData = new FormData();
      formData.append('image', file);
        
      fetchImageUploads(formData, id) 

    } catch (error) {
      console.log(error);
    }
  }

  const handleUploadVideo = () => {  
    try {
        let file = document.getElementById("input-10").files[0]
        
        document.getElementById("sendLabel-10").style = "display: none";
        document.getElementById("input-10").style = "display: none";
        document.getElementById("spinner-10").style = "display: block";
  
        const formData = new FormData();
        formData.append('video', file);
        
        fetchVideoUploads(formData) 

    } catch (error) {
      console.log(error);
    }
  }

  const cloudinaryPublicId = (path) => {
    const pathArr = path.split("/");
    const i = pathArr.length;
    const arr = pathArr[i-1].split(".");
    return `${pathArr[i-3]}/${pathArr[i-2]}/${arr[0]}`;
  }

  const handleUpdate = async (input, value = "") => {

    if (input === "name") {
      document.getElementById("spn"+input).style = "display: block"
      document.getElementById("sendLabel"+input).style = "display: none"
      let newName = document.getElementById("inputName").value
      product.name = newName
    }
    if (input === "color") {
      document.getElementById("spn"+input).style = "display: block"
      document.getElementById("sendLabel"+input).style = "display: none"
      let newColor = document.getElementById("inputColor").value
      product.color = newColor
    }
    if (input === "qty") {
      document.getElementById("spn"+input).style = "display: block"
      document.getElementById("sendLabel"+input).style = "display: none"
      let newQty = document.getElementById("inputQty").value
      product.qty = newQty
    }
    if (input === "price") {
      document.getElementById("spn"+input).style = "display: block"
      document.getElementById("sendLabel"+input).style = "display: none"
      let newPrice = document.getElementById("inputPrice").value
      product.price = newPrice
    }
    if (input === "promoPrice") {
      document.getElementById("spn"+input).style = "display: block"
      document.getElementById("sendLabel"+input).style = "display: none"
      let newPromoPrice = document.getElementById("inputPromoPrice").value
      product.promoPrice = newPromoPrice
    }
    if (input === "descrption") {
      document.getElementById("spn"+input).style = "display: block"
      document.getElementById("sendLabel"+input).style = "display: none"
      let newDescrption = document.getElementById("inputDescrption").value
      product.productDescrption = newDescrption
    }
    if (input === "frontImage") {
        product.productPic = value
    }
    if (input === "Image1") {
        product.pathPic1 = value
    }
    if (input === "Image2") {
        product.pathPic2 = value
    }
    if (input === "Image3") {
        product.pathPic3 = value
    }
    if (input === "video") {
        product.pathVideo = value
    }
    
    await Instance.put(`/products/${product._id}`, product,  
    { headers: { token: `Bearer ${accessTokenObj}` } })
    .then(res => {
      if (res.status === 200) {
        document.getElementById("spn"+input).style = "display: none"
        document.getElementById("sendLabel"+input).style = "display: block"
        setProduct(res.data)
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

  return (
    <div className="edit">
      <Sidebar />
      <div className="editContainer">
        <Navbar />
        <Loading status={loadingStatus} page={"setProduct"} />
        <div className="top">
          <Goback className="topBack" title={<h1>Edit {title}</h1>} btn={<div></div>} />
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

            <div className="form" >
                <div className="formLeft">
                    <div className="formInput mb-4">
                        <label>Product Full Name</label>
                        <input id="inputName" type="text" placeholder="Product Full Name" defaultValue={product.name} />
                        <button className="updateBtn" onClick={e => handleUpdate("name")}>
                            <span id="sendLabelname"><b>Update Name</b></span> 
                            <span><SyncIcon id="spnname" className="icnSpinner" /></span>
                        </button>
                    </div>
                    <div className="formInput mb-4">
                        <label>Product Color</label>
                        <input id="inputColor" type="text" placeholder="Product Color" defaultValue={product.color} />
                        <button className="updateBtn" onClick={e => handleUpdate("color")}>
                            <span id="sendLabelcolor"><b>Update Color</b></span> 
                            <span><SyncIcon id="spncolor" className="icnSpinner" /></span>
                        </button>
                    </div>
                    <div className="formInput mb-4">
                        <label>Product Quantity</label>
                        <input id="inputQty" type="text" placeholder="Product Quantity" defaultValue={product.qty} />
                        <button className="updateBtn" onClick={e => handleUpdate("qty")}>
                            <span id="sendLabelqty"><b>Update Quantity</b></span> 
                            <span><SyncIcon id="spnqty" className="icnSpinner" /></span>
                        </button>
                    </div>
                    <div className="formInput mb-4">
                        <label>Product Price</label>
                        <input id="inputPrice" type="text" placeholder="Product Price" defaultValue={product.price} />
                        <button className="updateBtn" onClick={e => handleUpdate("price")}>
                            <span id="sendLabelprice"><b>Update Price</b></span> 
                            <span><SyncIcon id="spnprice" className="icnSpinner" /></span>
                        </button>
                    </div>
                    <div className="formInput mb-4">
                        <label>Product Promo Price</label>
                        <input id="inputPromoPrice" type="text" placeholder="Product Promo Price" defaultValue={product.promoPrice} />
                        <button className="updateBtn" onClick={e => handleUpdate("promoPrice")}>
                            <span id="sendLabelpromoPrice"><b>Update Promo Price</b></span> 
                            <span><SyncIcon id="spnpromoPrice" className="icnSpinner" /></span>
                        </button>
                    </div>
                    <div className="formInput mb-4">
                        <label>Product Descrption ...</label>
                        <input id="inputDescrption" type="text" placeholder="Product Descrption ..." defaultValue={product.productDescrption} />
                        <button className="updateBtn" onClick={e => handleUpdate("descrption")}>
                            <span id="sendLabeldescrption"><b>Update Descrption</b></span> 
                            <span><SyncIcon id="spndescrption" className="icnSpinner" /></span>
                        </button>
                    </div>
                    <div className="formInput mb-4">
                        <div className="imgDisplay"><video src={product.pathVideo} width="100%" height="300px" controls></video></div>
                        <label>Product Video</label>
                        <input id="input-10" type="file" accept="video/*" />
                        <span id="file-10"></span>
                        <button className="updateBtn" onClick={e=>handleUploadVideo()}>
                            <span id="sendLabel-10"><b>Update Video</b></span> 
                            <span><SyncIcon id="spinner-10" className="icnSpinner" /></span>
                        </button>
                    </div>
                </div>
                <div className="formRight">
                    <div className="formInput mb-4">
                        <div className="imgDisplay"><img src={product.productPic} alt="Product Front" /></div>
                        <label>Product Front Image</label>
                        <input id="input-2" type="file" accept="image/*" />
                        <span id="file-2"></span>
                        <button className="updateBtn" onClick={e=>handleUploadSingleImage(2)}>
                            <span id="sendLabel-2"><b>Update Front Image</b></span> 
                            <span><SyncIcon id="spinner-2" className="icnSpinner" /></span>
                        </button>
                    </div> 
                    <div className="formInput mb-4">
                        <div className="imgDisplay"><img src={product.pathPic1} alt="Product 1" /></div>
                        <label>Product 1 Image</label>
                        <input id="input-4" type="file" accept="image/*" />
                        <span id="file-4"></span>
                        <button className="updateBtn" onClick={e=>handleUploadSingleImage(4)}>
                            <span id="sendLabel-4"><b>Update Image 1</b></span> 
                            <span><SyncIcon id="spinner-4" className="icnSpinner" /></span>
                        </button>
                    </div>
                    <div className="formInput mb-4">
                        <div className="imgDisplay"><img src={product.pathPic2} alt="Product 2 " /></div>
                        <label>Product 2 Image</label>
                        <input id="input-6" type="file" accept="image/*" />
                        <span id="file-6"></span>
                        <button className="updateBtn" onClick={e=>handleUploadSingleImage(6)}>
                            <span id="sendLabel-6"><b>Update Image 2</b></span> 
                            <span><SyncIcon id="spinner-6" className="icnSpinner" /></span>
                        </button>
                    </div>
                    <div className="formInput mb-4">
                        <div className="imgDisplay"><img src={product.pathPic3} alt="Product 3 " /></div>
                        <label>Product 3 Image</label>
                        <input id="input-8" type="file" accept="image/*" />
                        <span id="file-8"></span>
                        <button className="updateBtn" onClick={e=>handleUploadSingleImage(8)}>
                            <span id="sendLabel-8"><b>Update Image 3</b></span> 
                            <span><SyncIcon id="spinner-8" className="icnSpinner" /></span>
                        </button>
                    </div>
                </div>

              <div className="formInput"><span id="msgRequest"></span></div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Edit