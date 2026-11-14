import { useAuth } from "../hooks/useAuth";
import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { Navigate, useNavigate } from "react-router-dom";

const Protected = ({children}) => {
    const {loading,user}=useAuth();
    
    if(loading){
        return <div className="flex items-center justify-center h-screen">
            <ThreeDots color="#1155cc" height={30} width={30} />    
        </div>
    }
    if(!user){
        return <Navigate to={'/login'}/>;
    }
    return children;
  
}
export default Protected