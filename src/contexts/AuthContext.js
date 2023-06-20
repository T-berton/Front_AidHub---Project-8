import { useEffect, useState, createContext } from 'react';
import ActionCable from 'actioncable';


export const AuthContext = createContext();

export function AuthProvider({children}){

    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [CableApp,setCableApp] = useState(null);
    const [Loading,setLoading] = useState(true);

    useEffect(()=>{
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(token !== null);
        if(token && !CableApp?.cable){
            const newCableApp = {}
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'ws://localhost:4000';
            newCableApp.cable = ActionCable.createConsumer(`${backendUrl}/cable?token=${token}`);
            setCableApp(newCableApp);
        } 
        setLoading(false);
    },[CableApp?.cable,isAuthenticated]);
    
    useEffect(()=>{
        if (!isAuthenticated && CableApp && CableApp.cable) {
            CableApp.cable.disconnect();
            setCableApp(null);
          }
    },[isAuthenticated,CableApp]);

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
     <AuthContext.Provider value={{isAuthenticated,logIn,logOut,getToken,CableApp,Loading}}>
        {children}
     </AuthContext.Provider>
    )
}
