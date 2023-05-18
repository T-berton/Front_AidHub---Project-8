import { createContext, useState } from "react"


export const NotifContext = createContext();

export default function NotifProvider({children}) {
    const [messageReceived,setMessageReceived] = useState('');

    return (
        <NotifContext.Provider value={{messageReceived,setMessageReceived}}>
            {children}
        </NotifContext.Provider>
    )
}