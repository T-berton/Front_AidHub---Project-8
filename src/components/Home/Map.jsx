import './map.css'

import { MapContainer,Marker,Popup,TileLayer} from 'react-leaflet'
import { useContext, useEffect, useMemo, useState,useCallback} from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Leaflet from 'leaflet'
import marker_1 from '../../assets/map_marker_1.png'
import marker_2 from '../../assets/map_marker_2.png'
import {debounce} from "lodash"
import { toast } from 'react-toastify';
import { API_URL } from './config';



export default function Map(){

    const {isAuthenticated,getToken} = useContext(AuthContext);
    const token = getToken();
    

    const [requests,setRequest] = useState([]);
    const [allRequestsCounter,setAllRequestsCounter] = useState([]);
    const [openItemId,setOpenItemId] = useState(null);
    const [map,setMap] = useState(null);

    function MapEvents({map}) {

        const onMove = useCallback(() => {
            let lat = parseFloat(map.getCenter().lat);
            let lng = parseFloat(map.getCenter().lng);
            debouncedFetchRequest(lat,lng)
            console.log("coucou")
            }, [map])

        useEffect(() => {
            map.on('moveend', onMove)
            return () => {
                map.off('moveend', onMove)
            }
            }, [map, onMove])

        return null
    }  

   

    const fetchRequest=  useCallback(async(latitude,longitude)=>{
        try {
            const response = await fetch(`${API_URL}/requests?latitude=${latitude}&longitude=${longitude}`,{
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
            toast.error(`${e}`)
        }
 
    },[token]);

    const debouncedFetchRequest = debounce(fetchRequest,100);

    useEffect(() => {
        // Appel initial à fetchRequest avec les coordonnées du centre par défaut
        fetchRequest(51.505, -0.09);
      }, [fetchRequest]);



useEffect(()=>{
    async function fetchAllRequests() {
        try {
            const response = await fetch(`${API_URL}/requests`, {  // Your API endpoint for all requests
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok){
                throw new Error(`HTTP ERROR : ${response.status}`);
            }
            const data = await response.json();
    
            setAllRequestsCounter(data.length);
        } catch (e) {
            toast.error(`${e}`)
        }
    }
    if (isAuthenticated) {
        fetchAllRequests();
        const intervalFetch = setInterval(()=>{
            fetchAllRequests();
        },10000);
        return () => clearInterval(intervalFetch);
    }

},[isAuthenticated,token]);

const displayMap = useMemo(
    () => {
        const iconMarker1 = new Leaflet.Icon({
            iconUrl: marker_1,
            iconSize: [35, 35],
        })
        const iconMarker2 = new Leaflet.Icon({
            iconUrl: marker_2,
            iconSize: [35, 35],
        })
        return(
        <MapContainer center={[48.8588376, 2.2775176]} zoom={13} scrollWheelZoom={false} ref={setMap} className={`${isAuthenticated === true ? 'map' : 'map'}`}>        
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
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
            )
        },[requests,isAuthenticated]);


    return(
    <div className='map__background'>
        <div className='map__text'>
        <h2 className='map__subtitle'>The Map</h2>

                <h1 className='map__title'>Finding and helping people in need</h1>
               {isAuthenticated && (
                <p>{allRequestsCounter} requests not yet solved</p>
               )}    

        </div>
        <div className="map__container">
            {
                map ? <MapEvents map={map} />: null
            }
            {displayMap}
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
                        <li key={request.id} className='request__item' onClick={()=>{
                            map.flyTo([request.latitude, request.longitude], 15);
                        }}>
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
                            <h3>One-Time Needs</h3>
                        </div>                        
                        <ul className='request__list'>
                            {
                                requests.filter((request)=>{return request.task_type ==="One-time Need"})
                                .map((request)=>(
                            <li key={request.id} className='request__item'>
                                <div className='request__item__container' onClick={()=>{
                                    map.flyTo([request.latitude, request.longitude], 14);

                                }}>
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
