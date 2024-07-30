import React,{Children, createContext,useState,useEffect} from "react";
import axios from "axios";
// context
const AuthContext=createContext();

// provider
const AuthProvider=({children})=>{
    // global state

    const[state,setState]=useState({
        user:null,
        token:"",
    });

    // default axios settings
    axios.defaults.baseURL="https://backend-truck-order-app.onrender.com";
    axios.defaults.headers.common["Authorization"]=`Bearer ${state?.token}`;
    // initial local storage data
    // useEffect is written so that on reloading the app we are directed to home page if we were logged in previously
    useEffect(()=>{
        const loadLocalStorageData=async()=>{
            const data = localStorage.getItem('@user');
            console.log("Loading Local Storage data");
            let loginData=JSON.parse(data);
            console.log(loginData);
            setState({...state,user:loginData?.user,token:loginData?.token});
        };
        loadLocalStorageData();  
    },[]
);

return (
    <AuthContext.Provider value={[state,setState]}>
        {children}
    </AuthContext.Provider>
)
}
export{AuthContext,AuthProvider}