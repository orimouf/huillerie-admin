import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"

const List = (props) => {

  return (
    <div className='list'>
      <Sidebar />
      <div className="listContainer">
        <Navbar/>
        <Datatable title={props.title} page={props.page} />
      </div>
    </div>
  )
}

export default List