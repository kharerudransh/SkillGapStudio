import axios from "axios";

const authApiInstance=axios.create({
    baseURL: 'http://localhost:3000/api/auth/',
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
});

export async function register({username, email, password, contactNo, age, profession}){
    try{
        const response=await authApiInstance.post('/register',{
        username, email, password, contactNo, age, profession
        })
        return response.data;
    }
    catch (err) {
        console.error(
            "Registration error:",
            err.response?.data || err.message
        );

        throw err;
    }
}


export async function login({email, password}){
    try{
        const response=await authApiInstance.post('/login',{
            email,password
        });
        return response.data;
    }
    catch (err) {
        console.error(
            "Login error:",
            err.response?.data || err.message
        );

        throw err;
    }
}


export async function logout(){
    try{
        const response=await authApiInstance.get('/logout',{});
        return response.data;
    }
    catch (err) {
        console.error(
            "Logout error:",
            err.response?.data || err.message
        );

        throw err;
    }
}

export async function getMe(){
    try{
        const response=await authApiInstance.get('/getMe');
        return response.data;
    }
    catch (err) {
        console.error(
            "Failed to fetch user data:",
            err.response?.data || err.message
        );

        throw err;
    }
}
