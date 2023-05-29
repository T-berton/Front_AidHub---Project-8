import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {toast} from 'react-toastify';
import Nav from "../Shared/Nav/Nav";
import { MapContainer,Marker,TileLayer} from 'react-leaflet'
import './requestdetail.css'
import { Icon } from '@iconify/react';
import { API_URL } from './config';



export default function RequestDetail(){
    const {requestId} = useParams();
    const {getToken} = useContext(AuthContext);

    const [request,setRequest] = useState(null);

    useEffect(()=>{
        async function fetchRequest(){
            try {
                const token = getToken();
                const response = await fetch(`${API_URL}/requests/${requestId}`,
                {
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type':'application/json'
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP ERROR : ${response.status}`)
                }
    
                const data = await response.json();
                setRequest(data);
            } catch (error) {
                toast.error(`${error}`)
            }
        }
        fetchRequest();
    },[requestId,getToken]);


    async function handleConversation(){
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/conversations`,
            {
                method:"POST",
                body:JSON.stringify({
                    conversation:{
                        "request_id":request.id
                    },
                    "requester_id":request.user_id,
                }),
                headers:{
                    'Content-type':'application/json',
                    'Authorization' : `Bearer ${token}`,
                }
            });

            if (!response.ok){
                throw new Error(`HTTP ERROR : ${response.status}`);
            }

            toast.success('Conversation created with the Requester'); // affiche une notification de succès

        } catch (error) {
            toast.error(`${error}`);

        }
    }

    return(
        <>
        <Nav/>
        <div className="container">
            {request ? (
                <>
            <div className="detail__text">
                <h1>{request.title}</h1>
                {request.task_type === "Material Need"?(
                    <div className='request__title'>
                        <Icon icon="mdi:folder-help" width={45} color='#968864'/>
                        <h3>Material Needs</h3>
                </div>
                ):(
                    <div className='request__title'>
                            <Icon icon="mdi:help-box-multiple" width={45} color='#968864'/>
                            <h3>One-Time Needs</h3>
                    </div>    
                )}
                <p>{request.description}</p>
                <button onClick={handleConversation} className="form__customsubmit">Help this person</button>
            </div>
            <MapContainer center={[request.latitude,request.longitude]} zoom={17} scrollWheelZoom={false} className="map">
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[request.latitude,request.longitude]}>
                </Marker>
            </MapContainer>
                </>
            ):(
                <p> Loading</p>
            )

            }
           
        </div>
        </>
    )

}