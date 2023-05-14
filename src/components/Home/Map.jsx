import './map.css'

import { MapContainer,Marker,Popup,TileLayer } from 'react-leaflet'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Map(){

    const {isAuthenticated,getToken} = useContext(AuthContext);

    const [requests,setRequest] = useState([]);
    const [error,setError] = useState(null);

    async function fetchRequest(){
        try {
            const token = getToken();
            const response = await fetch("http://localhost:4000/requests",{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok){
                throw new Error(`HTTP ERROR : ${response.status}`);
            }
            const data = await response.json();
            setRequest(data);
        } catch (e) {
            setError((e));
        }
    }

    useEffect(()=>{
        fetchRequest();
    });

    return(
    <div className='map__background'>
        <div className='map__text'>
        <h2 className='map__subtitle'>The Map</h2>

                <h1 className='map__title'>Finding and helping people in need</h1>

            </div>
        <div className="map__container">
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className={`${isAuthenticated === true ? 'map' : 'map'}`}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                 requests.map((request)=>(
                        <Marker position={[request.latitude, request.longitude]}>
                        <Popup>
                            <div className='popup'>
                                <div className='popup__title'>
                                    Request n°{request.id} - {request.task_type}
                                </div>
                                <div className='popup__subtitle'>
                                    {request.description}
                                </div>
                                <div className='popup__button'>
                                    <Link to={`/request/${request.id}`}>Find out more</Link>
                                </div>
                            </div>

                        </Popup>
                     </Marker>
                    ))}
            </MapContainer>
            <div className='request__container'>
                <div className="request__list">
                    <h3 className='request__title'>Material Needs</h3>
                    <ul>
                        {
                            requests.filter((request)=>{return request.type ==="Material Need"})
                            .map((request)=>(
                                <li key={request.id} className='request__item'>
                                        <h3 className='request__item__title'>{request.title}</h3>
                                        <span className='request__item__arrow'></span>
                                        <p className='request__item__description'>{request.description}</p>                                           
                                </li>
                        ))}
                    </ul>
                </div>
                <div className="request__list">
                    <h3 className='request__title'>One-time Needs</h3>
                    <ul>
                        {
                            requests.filter((request)=>{return request.type ==="One-time Need"})
                            .map((request)=>(
                                <li key={request.id} className='request__item'>
                                        <h3 className='request__item__title'>{request.title}</h3>
                                        <span className='request__item__arrow'></span>
                                        <p className='request__item__description'>{request.description}</p>                                           
                                </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    )
}