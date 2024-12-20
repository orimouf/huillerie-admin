import './loading.scss'
import SyncIcon from '@mui/icons-material/Sync';

const Datatable = ({ status, page }) => {
  let marginStyle
  if(page === "setProduct" || "wilaya") {
    marginStyle = "0"
  } else {
    marginStyle =  ""
  }

  return (
    <div className="loadingContainer" style={{display: status ? "flex" : "none", margin: marginStyle}}><SyncIcon className="icnSpinner" /></div>
  )
}

export default Datatable