import { useContext } from "react";
import { AuthContext } from "../state/auth.context";
import {
    register,
    login,
    logout,
    getMe
} from "../services/auth.services";
import { useNavigate } from "react-router-dom";
export const useAuth=()=>{
    const context=useContext(AuthContext);
    const {user, setUser ,loading , setLoading} = context;
    const navigate = useNavigate();
    

    async function handleRegister({username, email, password, contactNo, age, profession}){
        try{
            setLoading(true);
            const data=await register({username, email, password, contactNo, age, profession});
            setUser(data.user);
            navigate("/home");
            return data.user;
        }
        catch(error){
            throw Error(error?.message || "Error");
        }
        finally{
            setLoading(false);
        }
    }


    async function handleLogin({email,password}){
        try{
            setLoading(true);
            const data=await login({email,password});
            setUser(data.user);
            navigate("/home");
            return data.user;
        }
        catch(error){
            throw Error(error?.message || "Error");
        }
        finally{
            setLoading(false);
        }
    }

    async function handleLogout(){
        try{
            setLoading(true);
            await logout();
            setUser(null);
        }
        catch(error){
            throw Error(error?.message || "Error");
        }
        finally{
            setLoading(false);
        }
    }

    async function handleGetMe(){
        try{
            setLoading(true);
            const data=await getMe();
            setUser(data.user);
            return data.user;
        }
        catch(error){
            throw Error(error?.message || "Error");
        }
        finally{
            setLoading(false);
        }
    }

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
        handleGetMe
    };

}
