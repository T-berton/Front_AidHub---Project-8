import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react'
import ActionCable from 'actioncable';

export const AuthContext = createContext();

export function AuthProvider({children}){

    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [CableApp,setCableApp] = useState({});

    useEffect(()=>{
        const token = localStorage.getItem("authToken");
        if (token){
            const cable = ActionCable.createConsumer(`ws://localhost:4000/cable?token=${token}`);
            const cableApp = { cable };
            setCableApp(cableApp);
        }
        else {
            setCableApp(null)
        }
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
     <AuthContext.Provider value={{isAuthenticated,logIn,logOut,getToken,CableApp}}>
        {children}
     </AuthContext.Provider>
    )
}