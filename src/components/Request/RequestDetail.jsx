import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function RequestDetail(){
    const {requestId} = useParams();

    const [request,setRequest] = useState(null);
    const [error,setError] = useState(null);
    async function fetchRequest(){
        try {
            const response = await fetch(`http://localhost:4000/requests/${requestId}`);

            if (!response.ok) {
                throw new Error(`HTTP ERROR : ${response.status}`)
            }

            const data = await response.json();
            setRequest(data);
        } catch (error) {
            setError(error);
        }
    }
    useEffect(()=>{
        fetchRequest();
    },[requestId]);


    function handleConversation(){
        try {
            
        } catch (error) {
            
        }
    }

    return(
        <div>
            <h1>{request.title}</h1>
            <p>{request.description}</p>
            <button onClick={handleConversation}>Help this person</button>
        </div>
    )

}