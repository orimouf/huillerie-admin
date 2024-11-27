import "./ItemBanner.css"

function ItemBanner(props) {

    let itemPath = `/single/${props._id}`

    if (props.isInCart) {
        itemPath = `/cart`
    }
    
    return (
        
        <div className="col-lg-12 shop-info-grid text-center mt-4">
            <div className="product-shoe-info shoe">
                <div className="men-thumb-item">
                    <img src={props.productPic} className="img-item" alt={props.productPic} />
                </div>
                <div className="item-info-product">
                    <h5 className="mb-0">{props.name}</h5>
                    <div className="item-price mb-1">
                        <b>{props.price}</b>
                        <b className="devise">.00 Da</b>
                    </div>
                </div>
            </div>
        </div>
            
    );
  }
  
  export default ItemBanner;