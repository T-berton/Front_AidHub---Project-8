import { useContext, useState,useEffect } from 'react'
import Nav from '../Shared/Nav/Nav'
import './submitrequest.css'
import {useNavigate } from 'react-router-dom'
import { MapContainer,Marker,Popup,TileLayer,useMapEvents } from 'react-leaflet'
import { AuthContext } from '../../contexts/AuthContext';
import {toast} from 'react-toastify';
import { API_URL } from '../../config';
import { DotLoader } from 'react-spinners';


export default function SubmitRequest(){

    const [title,setTitle] = useState('');
    const [typeTask,setTypeTask] = useState('Material Need');
    const [description,setDescription] = useState('');
    const [latitude,setLatitude] = useState(null);
    const [longitude,setLongitude] = useState(null);
    const [position,setPosition] = useState(null);
    const {getToken} = useContext(AuthContext);
    const [isLoading,setLoading] = useState(false);
    const [userPosition, setUserPosition] = useState([48.8566, 2.3522]);
    const [map,setMap] = useState(null);
    const navigate = useNavigate();


    const token = getToken();

    async function sendData(){
        setLoading(true);
        try {

            if (latitude==null||longitude==null) throw new Error("Choose a location on the map")

            const response = await fetch(`${API_URL}/requests`,{
                method: "POST",
                body: JSON.stringify({
                   request:{
                    "title":title,
                    "task_type":typeTask,
                    "description":description,
                    "latitude":latitude,
                    "longitude":longitude,
                }}),
                headers:{
                    'Content-type':'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            });

            if (!response.ok){
                console.log(await response.json()); // imprimer le corps de la réponse
                throw new Error(`HTTP Error : ${response.status}`);
            }


            setDescription('');
            setLatitude(null);
            setLongitude(null);
            setTitle('');
            setTypeTask("Material Need");
            navigate('/')
            toast.success('Request submitted successfully'); // affiche une notification de succès
        } catch (error) {
            toast.error(`${error}`);
        }finally{
            setLoading(false);
        }
    }

    const handleSubmit = ((e)=>{
        e.preventDefault();
        sendData();
    })

    function LocationMarker(){
        useMapEvents({
            click(e){
                let lat = parseFloat(e.latlng.lat.toFixed(10));
                let lng = parseFloat(e.latlng.lng.toFixed(10));
                setPosition(e.latlng);
                setLatitude(lat);
                setLongitude(lng);
                map.flyTo(e.latlng,map.getZoom());
            },
        });

        if (position !== null) {
            return <Marker position={position}>
                <Popup>You need help here</Popup>
            </Marker>
        }
        else 
        return null
    }
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = [position.coords.latitude,position.coords.longitude];
                setUserPosition(pos);
                if (map) map.flyTo(pos,13);          
            });
        } else {
            toast.error("Geolocation not supported");
        }
    }, [map]);


    return(
        <div>
            <Nav/>
                    <form className='submitrequest__form submitrequest__container' onSubmit={handleSubmit}>
                    {isLoading && <div className='loading-spinner'><DotLoader color='#424241'/></div>}
                        <div className='submitrequest__left'>
                            <h1>
                                Submit a <span className='text-secondary'>request</span>
                            </h1>
                            <h2>Submit a request swiftly, conveniently and simply by pinpointing your location. Aid others by identifying a problem or opportunity for improvement.</h2>
                            <div className='submit__request__form__item form__item'>
                                <label className='form__label'>Title of the Request</label>
                                <input className='form__input' type='text' value={title} onChange={e => setTitle(e.target.value)} required/>
                            </div>
                            <div className='submit__request__form__item form__item'>
                                <label className='form__label'>Type of the Request</label>
                                <select className='form__input' value={typeTask} onChange={e => setTypeTask(e.target.value)} required>
                                    <option value="Material Need">Material Need</option>
                                    <option value="One-time Need">One-time Need</option>
                                </select>
                            </div>
                            <div className='submit__request__form__item form__item'>
                                <label className='form__label'>Tell us more about what you need</label>
                                <textarea className='form__input submit__form__textarea' maxLength={250} type='text' value={description} onChange={e => setDescription(e.target.value)} required/>
                            </div>
                        </div>
                        <div className='submitrequest__right'>
                        <label className='form__label'>Where do you need help ?</label>
                        <MapContainer center={userPosition} zoom={13} ref={setMap} scrollWheelZoom={false} className='submitrequest__mapcontainer'>
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        detectRetina={true}
                        />
                        <LocationMarker/>
                        </MapContainer>
                        </div>
                        <input type='submit' value={`Submit request`} className='form__submit request__submit' disabled={isLoading}/>
                    </form>

        </div>
    )
}