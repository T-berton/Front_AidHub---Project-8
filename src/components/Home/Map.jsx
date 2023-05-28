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
import {debounce} from "lodash"


export default function Map(){

    const {isAuthenticated,getToken} = useContext(AuthContext);
    const token = getToken();
    
    const debouncedFetchRequest = debounce(fetchRequest,1000);

    const [requests,setRequest] = useState([]);
    const [allRequestsCounter,setAllRequestsCounter] = useState([]);
    const [error,setError] = useState(null);
    const [openItemId,setOpenItemId] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const [selectedRequest,setSelectedRequest] = useState({});


    const iconMarker1 = new Leaflet.Icon({
        iconUrl: marker_1,
        iconSize: [35, 35],
      })
    const iconMarker2 = new Leaflet.Icon({
        iconUrl: marker_2,
        iconSize: [35, 35],
      })

      const [lastCenteredPosition, setLastCenteredPosition] = useState({});
      const [selectedLatitude, setSelectedLatitude] = useState();
      const [selectedLongitude, setSelectedLongitude] = useState();
    

    function MapEvents() {

      const map = useMapEvents({
            moveend: () =>{
                const center = map.getCenter();
                let lat = parseFloat(center.lat.toFixed(6));
                let lng = parseFloat(center.lng.toFixed(6));
                debouncedFetchRequest(lat,lng)
            }
        })   
        return null
    }
    function Test(){

        const map = useMap();

        useEffect(()=>{
            console.log('useEffect ran');
            if (selectedLatitude && selectedLongitude ) {
                console.log('useEffect ran inside if', selectedLatitude, selectedLongitude);
                map.flyTo([selectedLatitude,selectedLongitude],13);
                // setLastCenteredPosition(selectedRequest);
            }
        },[selectedLatitude,selectedLongitude])
      
    }

  

    useEffect(() => {
        // Appel initial à fetchRequest avec les coordonnées du centre par défaut
        fetchRequest(51.505, -0.09);
      }, []);

    async function fetchRequest(latitude,longitude){
        try {
            setIsLoading(true);
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
        finally{
            setIsLoading(false);
        }
    }

async function fetchAllRequests() {
    try {
        const response = await fetch(`http://localhost:4000/requests`, {  // Your API endpoint for all requests
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
        setError(e);
    }
    finally{
        setIsLoading(false);
    }
}

useEffect(()=>{
    if (isAuthenticated) {
        fetchAllRequests();
        const intervalFetch = setInterval(()=>{
            fetchAllRequests();
        },5000);
        return () => clearInterval(intervalFetch);
    }

},[]);


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
            <MapContainer center={[48.8588376, 2.2775176]} zoom={13} scrollWheelZoom={false} className={`${isAuthenticated === true ? 'map' : 'map'}`}>
                <MapEvents />
                <Test />
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
                            setSelectedLatitude(request.latitude);
                            setSelectedLongitude(request.longitude);
                            // setSelectedRequest({latitude:request.latitude,longitude:request.longitude})
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
                                    // setSelectedRequest({latitude:request.latitude,longitude:request.longitude})
                                    setSelectedLatitude(request.latitude);
                                    setSelectedLongitude(request.longitude)
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