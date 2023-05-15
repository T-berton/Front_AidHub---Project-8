import './map.css'

import { MapContainer,Marker,Popup,TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Map(){

    const {isAuthenticated,getToken} = useContext(AuthContext);

    const [requests,setRequest] = useState([]);
    const [error,setError] = useState(null);
    const [openItemId,setOpenItemId] = useState(null);
    

    function MapEvents() {
        const map = useMap();

        useMapEvents({
            moveend: () =>{
                const center = map.getCenter();
                fetchRequest(center.lat,center.lng);
            }
        })   
        return null
    }

  

    useEffect(() => {
        // Appel initial à fetchRequest avec les coordonnées du centre par défaut
        fetchRequest(51.505, -0.09);
      }, []);

    async function fetchRequest(latitude,longitude){
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:4000/requests?latitude=${latitude}&longitude=${longitude}`,{
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


    return(
    <div className='map__background'>
        <div className='map__text'>
        <h2 className='map__subtitle'>The Map</h2>

                <h1 className='map__title'>Finding and helping people in need</h1>

            </div>
        <div className="map__container">
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className={`${isAuthenticated === true ? 'map' : 'map'}`}>
                <MapEvents />
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
                            requests.filter((request)=>{return request.task_type ==="Material Need"})
                            .map((request)=>(
                                <li key={request.id} className='request__item'>
                        <h3 className='request__item__title'>{request.title}</h3>
                        <span className='request__item__arrow' onClick={() => {
                            if (openItemId === request.id) {
                                setOpenItemId(null);
                            } else {
                                setOpenItemId(request.id);
                            }
                        }}>
                            {openItemId === request.id ? '▲' : '▼'}
                        </span>
                        {openItemId === request.id && (
                            <div className='request__item__description'>
                                <p>{request.description}</p>
                                <Link to={`/request/${request.id}`}>Find out more</Link>
                            </div>
                        )}
                    </li>
                        ))}
                    </ul>
                </div>
                <div className="request__list">
                    <h3 className='request__title'>One-time Needs</h3>
                    <ul>
                        {
                            requests.filter((request)=>{return request.task_type ==="One-time Need"})
                            .map((request)=>(
                                <li key={request.id} className='request__item'>
                                <h3 className='request__item__title'>{request.title}</h3>
                                <span className='request__item__arrow' onClick={() => {
                                    if (openItemId === request.id) {
                                        setOpenItemId(null);
                                    } else {
                                        setOpenItemId(request.id);
                                    }
                                }}>
                                    {openItemId === request.id ? '▲' : '▼'}
                                </span>
                                {openItemId === request.id && (
                                    <div className='request__item__description'>
                                        <p>{request.description}</p>
                                        <Link to={`/request/${request.id}`}>Find out more</Link>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    )
}