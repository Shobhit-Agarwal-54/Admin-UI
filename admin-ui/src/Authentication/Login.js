import React, { useContext, useEffect, useState } from 'react'
import {Link,useNavigate} from "react-router-dom"
import axios from 'axios';
import { AuthContext } from '../Context/authContext';
const Login = () => {

    const navigate=useNavigate();
    const [state,setState]=useContext(AuthContext);

    useEffect(()=>{
        if(state.token && state.user)
        {
            navigate("table");
        }
    },[state]);

    const[formData,setFormData]=useState({
        email:"",
        password:"",
    });
    const[loading,setLoading]=useState(false);
    const[loginData,setLoginData]=useState();

    const handleSubmitAdmin=async (e)=>{
        try {
            e.preventDefault();  
            setLoading(true);
            if( !formData.email || !formData.password)
                {
                    setLoading(false);
                     alert("Please fill all the details");
                     return;
                }
                setLoading(false);
                const {data}= await axios.post("/api/AdminLogin",{email:formData.email,password:formData.password});
                
                alert(data.message);
                data.user.password="";
                setLoginData(data);    
            //   console.log("Login Details ===>",{email:formData.email,password:formData.password});
             if(data.user &&data.token)
             {
              await localStorage.setItem("@user", JSON.stringify(
                {token:data.token,user:data.user}));
                setState(
                    {
                        token:data.token,
                        user:data.user}
                );
              navigate("table");
            }
            } catch (error) {
                alert("Invalid Email or password");
                setLoading(false);
                console.log(error);
            }
        }

  return (
    <div class="container">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <div class="signup-form">
                    <form
                        class="mt-5 border p-4 bg-light shadow"
                        
                    >
                        <h4 class="mb-5 text-secondary">Login To Your Account</h4>
                        <div class="row">
                            <div class="mb-3 col-md-12">
                                <label>
                                    Email <span class="text-danger">*</span>
                                </label>
                                <input
                                type="email"
                                name="email"
                                class="form-control"
                                placeholder='Enter Email'
                                autoComplete='off'
                                onChange={(event)=>{
                                    setFormData({...formData,email:event.target.value})
                                }}
                                />   
                            </div>

                            <div class="mb-3 col-md-12">
                                <label>
                                    Password <span class="text-danger">*</span>
                                </label>
                                <input
                                type='password'
                                name="password"
                                class="form-control"
                                placeholder='Enter Password'
                                onChange={(event)=>{
                                    setFormData({...formData,password:event.target.value})
                                }}
                                />     
                            </div>
                            <div class="col-md-12">
                                <button 
                                class="btn btn-primary "
                                onClick={handleSubmitAdmin}
                                >Login</button>
                            </div>
                        </div>
                    </form>
                    <p>
                        If you don't have an account , Please Create One
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login