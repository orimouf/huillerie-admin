import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';


//temporary dtat
export const userColumns = [
    { field: "_id", headerName: "ID", width: 250},
    { field: "fullName", headerName: "User Full Name", width: 220, 
    renderCell: (params)=> {
        return (
            <div className="cellWithImg">
                {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
                <AccountCircleIcon className='userIcon' />
                {params.row.fullName}
            </div>
        )
    }},
    { field: "email", headerName: "Email", width: 160 },
    { field: "country", headerName: "Country", width: 140 },
    { field: "isAdmin", headerName: "IS", width: 80 },
    { field: "status", headerName: "Status", width: 80, 
    renderCell:(params)=>{
        return(
            <div className={`cellWithStatus ${params.row.status}`}>{params.row.status}</div>
        )
    } }

]

export const ordersColumns = [
    { field: "_id", headerName: "ID", width: 80},
    { field: "wilaya", headerName: "Wilaya", width: 100}, 
    { field: "daira", headerName: "Daira", width: 100}, 
    { field: "fullName", headerName: "Client Full Name", width: 180, 
    renderCell:(params)=>{
        return(
            `${params.row.firstName } ${params.row.lastName }`
        )
    }}, 
    { field: "numberTel1", headerName: "Num Téléphone", width: 120}, 
    { field: "orderProduct", headerName: "Product", width: 80,
    renderCell:(params)=>{
        return(
            `${params.row.cart.length }`
        )
    }},
    { field: "orderPrice", headerName: "Order Price", width: 100 },
    // { field: "address", headerName: "Client Address", width: 140 },
    { field: "recpMethod", headerName: "Reception Method", width: 150 }
]

export const emailsColumns = [
    { field: "_id", headerName: "ID", width: 200},
    { field: "clientIp", headerName: "Client IP", width: 200}, 
    { field: "clientEmail", headerName: "Client Email", width: 200},
    { field: "createdAt", headerName: "Created At", width: 200}

]
export const packageColumns = [
    { field: "id", headerName: "ID", width: 80},
    { field: "capital", headerName: "Capital", width: 120},
    { field: "month", headerName: "Months", width: 120 },
    { field: "profitPorcent", headerName: "Percentage", width: 120,
    renderCell:(params)=>{
        return(
            <div className={`cellWithPercentage`}>{params.row.profitPorcent} %</div>
        )
    }},
    { field: "profit", headerName: "Profit", width: 120 },
    { field: "status", headerName: "Status", width: 100, 
    renderCell:(params)=>{
        return(
            <div className={`cellWithStatus ${params.row.status}`}>{params.row.status}</div>
        )
    }},
    { field: "date", headerName: "Date", width: 220,
    renderCell:(params)=>{
        return(
            <div className={`cellWithDate`}>
                {params.row.date}  <span className="days">
                          ( {(params.row.leftDays < 0) ? Math.abs(params.row.leftDays) + " Days ago": params.row.leftDays+" Days Left"} )
                      </span>
            </div>
        )
    }},
    { field: "action", headerName: "Action", width: 160, 
    renderCell:(params)=>{
        return(
            (params.row.status === "Sended") ? 
            <div className="action View" >View</div> : 
                params.row.leftDays <= 0 ? <div className="action Send" >Send</div> :
                <div className="action Wait" >Coming soon</div> 
        )
    }}
]

export const ordersCartColumns = [
    { field: "id", headerName: "ID", width: 80},
    { field: "productPic", headerName: "Image", width: 100,
    renderCell:(params)=>{
        return(
            <div className='imgsize'><img className='imgsize' style={{width: "100%",height: "100%"}} src={params.row.productPic} alt={params.row.name} /></div>
        )
    }},
    { field: "productName", headerName: "Product Name", width: 120},
    { field: "productColor", headerName: "Color", width: 80,
    renderCell:(params)=>{
        return(
            <div className='cellColorContainer'>
                <span>{params.row.productColor}</span>
                <div className="cellColor" style={{backgroundColor: `${params.row.productColor}`}}></div>
            </div>
        )
    }},
    { field: "productPrice", headerName: "Product Price", width: 120 },
    { field: "productPromoPrice", headerName: "Product Promo Price", width: 120},
    { field: "productQty", headerName: "Qantity", width: 80 },
    { field: "totalPrice", headerName: "Total Price", width: 100 },
    { field: "isValable", headerName: "Status", width: 100, 
    renderCell:(params)=>{
        return(
            <div className={`cellWithStatus`}>{params.row.isValable ? "Available" : "Not Available"}</div>
        )
    }},
    { field: "isPromo", headerName: "Status", width: 100, 
    renderCell:(params)=>{
        return(
            <div className={`cellWithStatus`}>{params.row.isPromo ? "Promo" : "Not Promo"}</div>
        )
    }},
    { field: "action", headerName: "Action", width: 160, 
    renderCell:(params)=>{
        return(
            (params.row.status === "Sended") ? 
            <div className="action View" >View</div> : 
                params.row.leftDays <= 0 ? <div className="action Send" >Send</div> :
                <div className="action Wait" >Coming soon</div> 
        )
    }}
]

export const weeklyProfitColumns = [
    { field: "_id", headerName: "ID", width: 220},
    { field: "weekStart", headerName: "Week Start", width: 180},
    { field: "weekEnd", headerName: "Week End", width: 180 },
    { field: "profitPorcent", headerName: "Percentage", width: 100,
    renderCell:(params)=>{
        return(
            <div className={`cellWithPercentage`}>{params.row.profitRatio} %</div>
        )
    }},
    { field: "status", headerName: "Status", width: 120, 
    renderCell:(params)=>{
        return(
            <div className={`cellWithStatus ${params.row.status}`}>{params.row.status}</div>
        )
    }}
]

export const clientsColumns = [
    { field: "productPic", headerName: "Image", width: 60, 
    renderCell:(params)=>{
        return(
            <div className='imgsize'><img className='imgsize' src={params.row.productPic} alt={params.row.name} /></div>
        )
    }},
    { field: "_id", headerName: "ID", width: 220},
    { field: "qty", headerName: "Quantity", width: 100},
    { field: "name", headerName: "Name", width: 180},
    { field: "price", headerName: "Price", width: 100 },
    { field: "promoPrice", headerName: "Promo Price", width: 100 },
    { field: "isValable", headerName: "isValable", width: 120, 
    renderCell:(params)=>{
        return(
            <div className={`cellWithStatus ${params.row.isValable ? "Approved" : "Deny"}`}>{params.row.isValable ? "OUI" : "NON"}</div>
        )
    }},
    { field: "isPromo", headerName: "isPromo", width: 120, 
    renderCell:(params)=>{
        return(
            <div className={`cellWithStatus ${params.row.isPromo ? "Approved" : "Deny"}`}>{params.row.isPromo ? "OUI" : "NON"}</div>
        )
    }}
]

export const wilayaColumns = [
    { field: "code", headerName: "Code", width: 100},
    { field: "name", headerName: "Name", width: 200},
    { field: "ar_name", headerName: "Name Arabic", width: 200},
    { field: "dairas", headerName: "Dairas", width: 200, 
    renderCell:(params)=>{
        return(
            <div >{params.row.dairas.length}</div> 
        )
    }}
]

export const dairaColumns = [
    { field: "code", headerName: "Code", width: 100},
    { field: "name", headerName: "Name", width: 200},
    { field: "ar_name", headerName: "Name Arabic", width: 200},
    { field: "domicilePrice", headerName: "Domicile Price", width: 120},
    { field: "communes", headerName: "Communes", width: 100, 
    renderCell:(params)=>{
        return(
            <div>{params.row.communes.length}</div> 
        )
    }},
    { field: "stopDesk", headerName: "Stop Desk", width: 400, 
    renderCell:(params)=>{
        return(
            <div className='cellStopDesk'><ul>{params.row.stopDesk.map(sd => <li key={`${sd.name}${sd.id}`}>{`${sd.name} - ${sd.price}`}</li>)}</ul></div> 
        )
    }}
]

export const withdrawalColumns = [
    { field: "id", headerName: "ID", width: 300},
    { field: "profitPorcent", headerName: "Percentage", width: 200,
    renderCell:(params)=>{
        return(
            <div className={`cellWithPercentage`}>{params.row.profitPorcent} %</div>
        )
    }},
    { field: "status", headerName: "Status", width: 180, 
    renderCell:(params)=>{
        return(
            <div className={`cellWithStatus ${params.row.status}`}>{params.row.status}</div>
        )
    }},
    { field: "date", headerName: "Date", width: 300},
    { field: "action", headerName: "Action", width: 200, 
    renderCell:(params)=>{
        return(
            (params.row.status === "Sended") ? 
            <div className="action View" >View in Profil</div> : 
                <Link to="/pay" style={{ textDecoration: "none" }}>
                    <div className="action Send" >Withdrawal</div>
                </Link>
                
        )
    }}
]

export const packageRows = [
    {
        id: 1,
        name: "MINI",
        amount: "500",
        profitPorcent: [10,10,10,10,10,10,10,10,10,10],
        capitalPorcent: 10,
        WithdrawalEvery: "10 Days",
        totalWithdrawal: 10,
        myWithdrawal: 6,
        myWithdrawalAmount: "600",
        currentWeek: 6,
        startDate: "03/04/2022",
        finDate: "14/07/2022",
        status: "pending"//"pending""passive"
    },
    {
        id: 2,
        name: "MINI",
        amount: "1000",
        profitPorcent: [10,10,10,10,10,10,10,10,10,10],
        capitalPorcent: 10,
        WithdrawalEvery: "10 Days",
        totalWithdrawal: 10,
        myWithdrawal: 1,
        myWithdrawalAmount: "200",
        currentWeek: 18,
        startDate: "29/05/2022",
        finDate: "10/09/2022",
        status: "pending"//"pending""passive"
    },
]

// export const userRows = [
//     {
//         id: 1,
//         username: "Snow",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "active",
//         telegram: "SnowTed",
//         binanceEmail: "snow@gmail.com",
//         binanceHash: "Hssd09KS9skdsuns887sdnnusauhaJHBS",
//         capital: 300,
//     },
//     {
//         id: 2,
//         username: "jojo",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "pending",
//         email: "jojjo@gmail.com",
//         country: 45,
//     },
//     {
//         id: 3,
//         username: "nina",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "active",
//         email: "nina@gmail.com",
//         age: 20,
//     },
//     {
//         id: 4,
//         username: "maro",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "active",
//         email: "maro@gmail.com",
//         age: 35,
//     },
//     {
//         id: 5,
//         username: "mima",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "passive",
//         email: "mima@gmail.com",
//         age: 35,
//     },
//     {
//         id: 6,
//         username: "mama",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "passive",
//         email: "mama@gmail.com",
//         age: 60,
//     },
//     {
//         id: 7,
//         username: "nesrine",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "pending",
//         email: "nesrin@gmail.com",
//         age: 27,
//     },
//     {
//         id: 8,
//         username: "amir",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "active",
//         email: "amir@gmail.com",
//         age: 23,
//     },
//     {
//         id: 9,
//         username: "miro",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "active",
//         email: "miro@gmail.com",
//         age: 53,
//     },
//     {
//         id: 10,
//         username: "asSnow",
//         img: "https://images.pexels.com/photos/7536592/pexels-photo-7536592.jpeg",
//         status: "passive",
//         email: "assnow@gmail.com",
//         age: 30,
//     },
// ]