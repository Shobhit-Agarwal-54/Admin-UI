import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import moment from "moment";
import "./App.css";
import filter from 'lodash.filter';
import {FaSearch} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft,faArrowLeft,faAngleRight,faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Box, Button, Card } from '@mui/material';

const Table = () => {

    const[state]=useContext(AuthContext);
    useEffect(()=>{
        if(state.user && state.token)
        {

        }
        else
        {
            navigate("/");
        }   
    },[]);
    
    let monthShortNames=["","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEPT","OCT","NOV","DEC"];
    const[allOrder,setAllOrder]=useState([]);
    const[order,setOrder]=useState([]);
    const[showModal,setShowModal]=useState(false);
    const[clientName,setClientName]=useState();
    const[productName,setProductName]=useState();
    const[price,setPrice]=useState();
    const[quantity,setQuantity]=useState();
    const[orderId,setOrderId]=useState();
    const[balancedQuantity,setBalancedQuantity]=useState();
    const[currentPage,setCurrentPage]=useState(1);
    const[searchInput,setSearchInput]=useState("");
    const[searchedData,setSearchedData]=useState([]);

    const recordsPerPage=5;
    const lastIndex=currentPage*recordsPerPage;
    const firstIndex=lastIndex-recordsPerPage;
    var records=allOrder.slice(firstIndex,lastIndex);
    const npage=Math.ceil(allOrder.length/recordsPerPage);
    const numbers=[...Array(npage+1).keys()].slice(1);

    const getAllOrders=async()=>{
       const {data}= await axios.get("/api/getAllOrders");
       setAllOrder(data.Orders);
       setOrder(data.Orders);
       console.log(data.Orders);
    }
    useEffect(()=>{
        getAllOrders();
    },[]);

const handleSubmit=async()=>{
    console.log("Handle Function Executed");
    console.log(clientName+" "+ productName+" "+price+" "+quantity);
    await axios.post("/api/createOrderDetail",{ClientName:clientName,ProductName:productName,PriceOfProductPerKg:Number(price),QuantityOrdered:Number(quantity)});
    window.location.reload();
}

const handleUpdate=async()=>{
    const {data}=await axios.patch("/api/updateOrderDetail",{
        id:orderId,
        ClientName:clientName,
        ProductName:productName,
        PriceOfProductPerKg:price,
        QuantityOrdered:quantity,
        BalancedQuantity:balancedQuantity
    });
    setOrderId(-1);
    window.location.reload();
}

const deleteOrder=async(id)=>{
  const {data}=  await axios.delete("/api/deleteOrderDetail",
    {
    data:{id:id}
});
    window.location.reload();
}
const prevPage=()=>{
    if(currentPage!=1)
    {
        setCurrentPage(currentPage-1);
    }
  }

  const nextPage=()=>{
    if(currentPage!=npage)
    {
        setCurrentPage(currentPage+1);
    }
  }
  const changeToAPage=(pageNumber)=>{
    setCurrentPage(pageNumber);
  }

  const contains=({ClientName,ProductName,createdAt},query)=>{
    ClientName=ClientName.toLowerCase();
    ProductName=ProductName.toLowerCase();
    createdAt= moment(createdAt).format("DD:MM:YYYY");
    if(ClientName.includes(query)|| ProductName.includes(query)||createdAt.includes(query) )
      {
        return true;
      }
      else
      {
        return false;
      }
  }

  const handleSearch=(query)=>{
    const formattedQuery=query.toLowerCase();
    const result=filter(allOrder,(element)=>{
        return contains(element,formattedQuery);
    });
    setSearchedData(result);
  }
  const navigate=useNavigate();

  const handleLogOut=async (e)=>{
    e.preventDefault();
    localStorage.clear();
    state.token="";
    state.user="";
    navigate("/");
    alert("LogOut Successful");
  }
  return (
    <div className="All">
        <div >
            <div 
            className='text-end'
            >
                <FaSearch
                className='searchIcon'
                ></FaSearch>
            <input type='text'
            className='inputBox'
            placeholder='Search'
            value={searchInput}
            onChange={e=>{
                handleSearch(e.target.value);
                setSearchInput(e.target.value)
            }}
            ></input>
            <button 
            onClick={handleLogOut}
            className='logOutBtn'
            >Log Out</button>
            </div>
            
            <form >
                <input className='commonInputBox' type='text' placeholder='Enter Client Name'  onChange={e=>setClientName(e.target.value)}/>
                <input className='commonInputBox' type='text' placeholder='Enter Product Name'  onChange={e=>setProductName(e.target.value)}/>
                <input className='commonInputBox' type='text' placeholder='Enter Price Per Kg'  onChange={e=>setPrice(e.target.value)}/>
                <input className='commonInputBox' type='text' placeholder='Enter Quantity Ordered'  onChange={e=>setQuantity(e.target.value)}/>
                <button 
                // class="btn btn-primary " 
                class="createBtn"
                onClick={handleSubmit}>CREATE ORDER</button>
            </form>
        </div>
        <table >
            <thead>
                <tr>
                    <th>ORDER ID</th>
                    <th>CLIENT NAME</th>
                    <th>PRODUCT NAME</th>
                    <th>PRICE PER KG</th>
                    <th>QUANTITY ORDERED</th>
                    <th>TOTAL PRICE</th>
                    <th>Balanced Quantity</th>
                    <th>CREATED AT</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody>
                {
                    searchInput==""?
                    records.map((user,index)=>(
                        user._id==orderId?
                        <tr className='Row' >
                            <td>{user._id}</td>
                            <td><input type='text' onChange={e=>setClientName(e.target.value)} value={clientName}/></td>
                            <td><input  type="text" onChange={e=>setProductName(e.target.value)} value={productName}/></td>
                            <td><input type='text'  onChange={e=>setPrice(e.target.value)} value={price}/></td>
                            <td><input type='text' onChange={e=>setQuantity(e.target.value)}  value={quantity}/></td>
                            <td>{user.TotalPrice}</td>
                            <td><input type='text' onChange={e=>setBalancedQuantity(e.target.value)}  value={balancedQuantity}/></td>
                            <td>{                                                 
                            moment(user.createdAt).format("DD:MM:YYYY").substring(0,2)+" "+monthShortNames[ Number(moment(user.createdAt).format("DD:MM:YYYY").substring(3,5))]+ " "+ moment(user.createdAt).format("DD:MM:YYYY").substring(6)
                            }</td>
                            <td><p 
                            className={
                               user.Status=="PENDING"? "statusPending":"statusSuccess"
                                }>
                                {user.Status}</p></td>
                            <td><button 
                            class="btn btn-primary " 
                            onClick={handleUpdate}>SAVE</button></td>
                        </tr>
                        :
                        <tr className='Row' 
                        key={index}>
                            <td>{user._id}</td>
                            <td>{user.ClientName}</td>
                            <td>{user.ProductName}</td>
                            <td>{user.PriceOfProductPerKg}</td>
                            <td>{user.QuantityOrdered+"kg"}</td>
                            <td>{user.TotalPrice}</td>
                            <td>{user.BalancedQuantity+"kg"}</td>
                            <td>{                                                 
                            moment(user.createdAt).format("DD:MM:YYYY").substring(0,2)+" "+monthShortNames[ Number(moment(user.createdAt).format("DD:MM:YYYY").substring(3,5))]+ " "+ moment(user.createdAt).format("DD:MM:YYYY").substring(6)
                            }</td>
                            <td><p 
                            className={
                               user.Status=="PENDING"? "statusPending":"statusSuccess"
                                }>
                                {user.Status}</p></td>
                            <td>
                                <button
                                className='editBtn'
                                // class="btn btn-primary " 
                                onClick={()=>{
                                    setOrderId(user._id);
                                    setProductName(user.ProductName);
                                    setClientName(user.ClientName);
                                    setPrice(user.PriceOfProductPerKg);
                                    setQuantity(user.QuantityOrdered);
                                    setBalancedQuantity(user.BalancedQuantity);
                                    }}>
                                        <img
                                        className='edit' 
                                        alt='Edit'
                                        height="20px"
                                        width="20px"
                                        src="https://icons.veryicon.com/png/o/miscellaneous/two-color-webpage-small-icon/edit-247.png"></img>
                                    </button>
                                <button
                                class="deleteBtn"
                                 onClick={()=>deleteOrder(user._id)}>
                                   <img
                                   src="https://cdn-icons-png.freepik.com/512/1345/1345874.png"
                                   height={"20px"}
                                   width={"20px"}
                                   alt="delete"
                                   className='delete'
                                   ></img>
                                    </button>
                            </td>
                        </tr>
                    ))
                    :
                    searchedData.map((user,index)=>(
                        user._id==orderId?
                        <tr className='Row' >
                            <td>{user._id}</td>
                            <td><input type='text' onChange={e=>setClientName(e.target.value)} value={clientName}/></td>
                            <td><input  type="text" onChange={e=>setProductName(e.target.value)} value={productName}/></td>
                            <td><input type='text'  onChange={e=>setPrice(e.target.value)} value={price}/></td>
                            <td><input type='text' onChange={e=>setQuantity(e.target.value)}  value={quantity}/></td>
                            <td>{user.TotalPrice}</td>
                            <td><input type='text' onChange={e=>setBalancedQuantity(e.target.value)}  value={balancedQuantity}/></td>
                            <td>{                                                 
                            moment(user.createdAt).format("DD:MM:YYYY").substring(0,2)+" "+monthShortNames[ Number(moment(user.createdAt).format("DD:MM:YYYY").substring(3,5))]+ " "+ moment(user.createdAt).format("DD:MM:YYYY").substring(6)
                            }</td>
                            <td><p 
                            className={
                               user.Status=="PENDING"? "statusPending":"statusSuccess"
                                }>
                                {user.Status}</p></td>
                            <td><button 
                            class="btn btn-primary " 
                            onClick={handleUpdate}>SAVE</button></td>
                        </tr>
                        :
                        <tr className='Row' 
                         key={index}>
                            <td>{user._id}</td>
                            <td>{user.ClientName}</td>
                            <td>{user.ProductName}</td>
                            <td>{user.PriceOfProductPerKg}</td>
                            <td>{user.QuantityOrdered+"kg"}</td>
                            <td>{user.TotalPrice}</td>
                            <td>{user.BalancedQuantity+"kg"}</td>
                            <td>{                                                 
                            moment(user.createdAt).format("DD:MM:YYYY").substring(0,2)+" "+monthShortNames[ Number(moment(user.createdAt).format("DD:MM:YYYY").substring(3,5))]+ " "+ moment(user.createdAt).format("DD:MM:YYYY").substring(6)
                            }</td>
                            <td><p 
                            className={
                               user.Status=="PENDING"? "statusPending":"statusSuccess"
                                }>
                                {user.Status}</p></td>
                            <td>
                                <button 
                                className='editBtn'
                                onClick={()=>{
                                    setOrderId(user._id);
                                    setProductName(user.ProductName);
                                    setClientName(user.ClientName);
                                    setPrice(user.PriceOfProductPerKg);
                                    setQuantity(user.QuantityOrdered);
                                    setBalancedQuantity(user.BalancedQuantity);
                                    }}>
                                        <img
                                        className='edit' 
                                        alt='Edit'
                                        height="20px"
                                        width="20px"
                                        src="https://icons.veryicon.com/png/o/miscellaneous/two-color-webpage-small-icon/edit-247.png"></img>
                                    </button>
                                <button 
                                class="deleteBtn"
                                onClick={()=>deleteOrder(user._id)}>
                                    <img
                                   src="https://cdn-icons-png.freepik.com/512/1345/1345874.png"
                                   height={"20px"}
                                   width={"20px"}
                                   alt="delete"
                                   className='delete'
                                   ></img>
                                </button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        {
            searchInput==""?
        // <nav className='icons'>
        //     <div className='text-end'>
        //     <ul 
        //     className='pagination '>
        //         <li>
        //         <FontAwesomeIcon
        //         onClick={()=>changeToAPage(1)}
        //         icon={faArrowLeft} />
        //         </li>
        //     <li>
                // <FontAwesomeIcon 
                // onClick={prevPage}
                // icon={faChevronLeft} />
        //     </li>
        //     <li>
            // <FontAwesomeIcon
            // onClick={nextPage}
            // icon={faAngleRight} />
        //     </li>
        //     <li>
            // <FontAwesomeIcon
            // onClick={()=>changeToAPage(npage)}
            // icon={faArrowRight} />
        //     </li>
        //     </ul>
        //     </div>

            // </nav>
    
            // :""
            <div className=''>
            <Box 
            sx={{ 
             display:"flex",
             float:"right"
            }}>
                <p 
                style={
                    {
                        font:"10px",
                        fontWeight:"bold"

                    }
                    }>
                    Page {currentPage} of {npage}</p>
                <button
                onClick={()=>changeToAPage(1)}
                style={{
                    backgroundColor:"white",
                    border:"0px solid white"}}>
            <FontAwesomeIcon
            icon={faArrowLeft} />
            </button>

                <button
                onClick={prevPage}
                style={{
                    backgroundColor:"white",
                    border:"0px solid white"}}>
        <FontAwesomeIcon 
                icon={faChevronLeft} />
            </button>

            <button
            onClick={nextPage}
                style={{
                    backgroundColor:"white",
                    border:"0px solid white"}}>
            <FontAwesomeIcon  
            icon={faAngleRight} />
            </button>

            <button
            onClick={()=>changeToAPage(npage)}
                style={{
                    backgroundColor:"white",
                    border:"0px solid white"}}>
            <FontAwesomeIcon
            icon={faArrowRight} />
           </button>
    </Box>
    </div>
            :
            ""
        }
           
        </div>
      )
    
    }
    
    export default Table

                {/* <li className='page-item'>
                <a href='#'
                 className='page-link'
                onClick={prevPage}
                >PREV</a>
                </li> 
                {
                    numbers.map((n,i)=>(
                        <li className={`page-item ${currentPage===n?'active':''}`} key={i}>
                            <a 
                            href='#' 
                            className='page-link'
                            onClick={()=>changeToAPage(n)}>
                            {n}
                            </a>
                        </li>
                    ))
                }

                <li className='page-item'>
                <a href='#' 
                className='page-link'
                onClick={()=>changeToAPage(1)}
                >
                  FIRST  
                </a>
                </li>

                <li className='page-item'>
                <a href='#' 
                className='page-link'
                onClick={()=>changeToAPage(npage)}
                >
                  LAST  
                </a>
                </li> */}
                
               
                 {/* <li className='page-item'>
                <a href='#' 
                className='page-link'
                onClick={nextPage}
                >
                  NEXT  
                </a>
                </li>  */}
            