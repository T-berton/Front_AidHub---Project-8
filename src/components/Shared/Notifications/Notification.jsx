// import { useContext, useEffect } from 'react'
// import './notification.css'
// import { NotifContext } from '../../../contexts/NotificationContext'
// import {toast } from 'react-toastify';
// import { Link } from 'react-router-dom';


// export default function Notification(){

//     const {receivedMessage} = useContext(NotifContext);

//     useEffect(()=>{
//         if (receivedMessage){
//             toast.info(
//                 <div>
//                     <p>{receivedMessage}</p>  
//                     <Link to={'/submit_request'}>Republish your request</Link>
//                 </div>
//             )
//         }
//     },[receivedMessage])


//     return null
// }