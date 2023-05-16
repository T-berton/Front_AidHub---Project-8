import './map.css'

import { MapContainer,Marker,Popup,TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Leaflet from 'leaflet'
import marker_1 from '../../assets/map_marker_1.png'
import marker_2 from '../../assets/map_marker_2.png'
import PulseLoader from "react-spinners/ClipLoader"


export default function Map(){

    const {isAuthenticated,getToken} = useContext(AuthContext);

    const [requests,setRequest] = useState([]);
    const [error,setError] = useState(null);
    const [openItemId,setOpenItemId] = useState(null);
    

    const iconMarker1 = new Leaflet.Icon({
        iconUrl: marker_1,
        iconSize: [35, 35],
      })
    const iconMarker2 = new Leaflet.Icon({
        iconUrl: marker_2,
        iconSize: [35, 35],
      })

    

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
                        requests.filter((request)=>{return request.task_type ==="One-time Need"}).map((request)=>(
                        <Marker position={[request.latitude, request.longitude]} icon={iconMarker1}>
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
                    {
                        requests.filter((request)=>{return request.task_type ==="Material Need"}).map((request)=>(
                        <Marker position={[request.latitude, request.longitude]} icon={iconMarker2}>
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
                <div className="request__container__list">
                    <div className='request__title'>
                        <Icon icon="mdi:folder-help" width={45} color='#968864'/>
                        <h3>Material Needs</h3>
                    </div>
                    <ul className='request__list'>
                        {
                            requests.filter((request)=>{return request.task_type ==="Material Need"})
                            .map((request)=>(
                        <li key={request.id} className='request__item'>
                            <div className='request__item__container'>
                                <div className='request__item__title'>{request.title}</div>
                                <span className='request__item__arrow' onClick={() => {
                                        if (openItemId === request.id) {
                                            setOpenItemId(null);
                                        } else {
                                            setOpenItemId(request.id);
                                        }
                                    }}>
                                        {openItemId === request.id ? 
                                            <Icon icon="ic:round-keyboard-double-arrow-up" width={25} color='#424241'/>
                                            : 
                                            <Icon icon="ic:round-keyboard-double-arrow-down" width={25} color='#424241'/>
                                        }
                                    </span>
                                </div>
                            {openItemId === request.id && (
                                <div className='request__item__description'>
                                    <p>{request.description}</p>
                                    <Link to={`/request/${request.id}`} className='request__item__btn'>Find out more</Link>
                                </div>
                            )}
                        </li>
                        ))}
                    </ul>
                </div>
                    <div className="request__container__list">
                        <div className='request__title'>
                            <Icon icon="mdi:help-box-multiple" width={45} color='#968864'/>
                            <h3>Material Needs</h3>
                        </div>                        
                        <ul className='request__list'>
                            {
                                requests.filter((request)=>{return request.task_type ==="One-time Need"})
                                .map((request)=>(
                            <li key={request.id} className='request__item'>
                                <div className='request__item__container'>
                                    <div className='request__item__title'>{request.title}</div>
                                    <span className='request__item__arrow' onClick={() => {
                                            if (openItemId === request.id) {
                                                setOpenItemId(null);
                                            } else {
                                                setOpenItemId(request.id);
                                            }
                                        }}>
                                            {openItemId === request.id ? 
                                            <Icon icon="ic:round-keyboard-double-arrow-up" width={25} color='#424241'/>
                                            : 
                                            <Icon icon="ic:round-keyboard-double-arrow-down" width={25} color='#424241' />
                                            }
                                        </span>
                                    </div>
                                {openItemId === request.id && (
                                    <div className='request__item__description'>
                                        <p>{request.description}</p>
                                        <Link to={`/request/${request.id}`} className='request__item__btn'>Find out more</Link>
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