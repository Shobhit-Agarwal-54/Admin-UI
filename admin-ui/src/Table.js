import React, { useEffect, useState } from 'react'
import axios from "axios"
import moment from "moment";
import "./App.css";

const Table = () => {
    
    const[allOrder,setAllOrder]=useState([]);
    const[order,setOrder]=useState([]);
    const[showModal,setShowModal]=useState(false);
    const[clientName,setClientName]=useState();
    const[productName,setProductName]=useState();
    const[price,setPrice]=useState();
    const[quantity,setQuantity]=useState();
    const[orderId,setOrderId]=useState();
    const[balancedQuantity,setBalancedQuantity]=useState();
    const getAllOrders=async()=>{
       const {data}= await axios.get("http://localhost:8080/api/getAllOrders");
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
    await axios.post("http://localhost:8080/api/createOrderDetail",{ClientName:clientName,ProductName:productName,PriceOfProductPerKg:Number(price),QuantityOrdered:Number(quantity)});
}

const handleUpdate=async()=>{
    const {data}=await axios.patch("http://localhost:8080/api/updateOrderDetail",{
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
  const {data}=  await axios.delete("http://localhost:8080/api/deleteOrderDetail",
    {
    data:{id:id}
});
    window.location.reload();
}

  return (
    <div>
        {/* Table
        <button onClick={()=>
        setShowModal(true)}> TO Open Modal</button>
        {
            (showModal==true)?<div>Hello</div>:<div>false</div>
        } */}
        <div>
            <form >
                <input type='text' placeholder='Enter Client Name'  onChange={e=>setClientName(e.target.value)}/>
                <input type='text' placeholder='Enter Product Name'  onChange={e=>setProductName(e.target.value)}/>
                <input type='text' placeholder='Enter Price Per Kg'  onChange={e=>setPrice(e.target.value)}/>
                <input type='text' placeholder='Enter Quantity Ordered'  onChange={e=>setQuantity(e.target.value)}/>
                <button onClick={handleSubmit}>CREATE ORDER</button>
            </form>
        </div>
        <table>
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
                    order.map((user,index)=>(
                        user._id==orderId?
                        <tr>
                            <td>{user._id}</td>
                            <td><input type='text' onChange={e=>setClientName(e.target.value)} value={clientName}/></td>
                            <td><input  type="text" onChange={e=>setProductName(e.target.value)} value={productName}/></td>
                            <td><input type='text'  onChange={e=>setPrice(e.target.value)} value={price}/></td>
                            <td><input type='text' onChange={e=>setQuantity(e.target.value)}  value={quantity}/></td>
                            <td>{user.TotalPrice}</td>
                            <td><input type='text' onChange={e=>setBalancedQuantity(e.target.value)}  value={balancedQuantity}/></td>
                            <td>{moment(user.createdAt).format("DD:MM:YYYY")}</td>
                            <td>{user.Status}</td>
                            <td><button onClick={handleUpdate}>SAVE</button></td>
                        </tr>
                        :
                        <tr key={index}>
                            <td>{user._id}</td>
                            <td>{user.ClientName}</td>
                            <td>{user.ProductName}</td>
                            <td>{user.PriceOfProductPerKg}</td>
                            <td>{user.QuantityOrdered+"kg"}</td>
                            <td>{user.TotalPrice}</td>
                            <td>{user.BalancedQuantity+"kg"}</td>
                            <td>{moment(user.createdAt).format("DD:MM:YYYY")}</td>
                            <td>{user.Status}</td>
                            <td>
                                <button onClick={()=>{
                                    setOrderId(user._id);
                                    setProductName(user.ProductName);
                                    setClientName(user.ClientName);
                                    setPrice(user.PriceOfProductPerKg);
                                    setQuantity(user.QuantityOrdered);
                                    setBalancedQuantity(user.BalancedQuantity);
                                    }}>Edit</button>
                                <button onClick={()=>deleteOrder(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
  )
}

export default Table