import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react'

export const AuthContext = createContext();

export function AuthProvider({children}){

    const [isAuthenticated,setIsAuthenticated] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(token !== null);
    },[]);

    function logIn(token){
        setIsAuthenticated(true);
        localStorage.setItem("authToken",token);
    }

    function logOut(token){
        setIsAuthenticated(false);
        localStorage.removeItem("authToken");
    }

    function getToken(){
        return localStorage.getItem("authToken");
    }

    return (
     <AuthContext.Provider value={{isAuthenticated,logIn,logOut,getToken}}>
        {children}
     </AuthContext.Provider>
    )
}