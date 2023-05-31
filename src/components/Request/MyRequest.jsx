import { useContext, useEffect, useState } from 'react'
import Nav from '../Shared/Nav/Nav'
import './myrequest.css'
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import { API_URL } from '../../config';
import { DotLoader } from 'react-spinners';




export default function MyRequest(){
    const {getToken} = useContext(AuthContext);
    const [requests,setRequests] = useState(null);
    const token = getToken();
    const [isLoading,setLoading] = useState(false);



    useEffect(()=>{
        async function fetchData(){
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/requests?my_requests=true`,{
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok){
                    throw new Error(`HTTP ERROR: ${response.status}`);
                }
    
                const response_json = await response.json();
                setRequests(response_json);
    
            } catch (error) {
                toast.error(`${error}`);
            }finally{
                setLoading(false);
            }
        }
        fetchData();
    },[token])

    async function handleRepublish(request_id) {
        try {
            const response = await fetch(`http://localhost:400/requests/${request_id}`,{
                method:"PUT",
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request:{
                        "closed": false,
                        "published_at": new Date().toISOString(),
                    }
                })
            });
            

        if (!response.ok){
            throw new Error(`HTTP ERROR: ${response.status}`)
        }
            
        } catch (error) {
            toast.error(`${error}`)

        }
    }

    async function handleDelete(request_id) {
        try {
            const response = await fetch(`${API_URL}/requests/${request_id}`,{
                method: "DELETE",
                headers:{
                    "Authorization": `Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            });
            if (!response.ok){
                throw new Error(`HTTP ERROR : ${response.status}`)
            }
            toast.success("Request Deleted")
            setRequests(requests.filter(request=>request.id !== request_id))
        } catch (error) {
            toast.error(`${error}`)            
        }
    }

    return(
        <>
        <Nav/>
        <div className='container'>
            {isLoading && <div className='loading-spinner'><DotLoader color='#424241'/></div>}
            <h1>My <span className='text-secondary'>pending requests</span></h1>
            <div className='myrequest__grid'>
                {requests && requests.length !== 0 ? (
                requests.map((request) => (
                <div className="myrequest__card">
                    <h2>{request.title}</h2>
                    <h3>{request.task_type}</h3>
                    <p>{request.description}. This request is {request.status} and {request.user_counter} users are helping for this request.</p>
                    {request.closed && request.user_counter < 5 && new Date() - new Date(request.published_at) > 24 * 60 * 60 * 1000 ? (
                        <button className="button-republish" onClick={() => handleRepublish(request.id)}>Republish</button>
                    ) : (
                        <></>
                    )}
                    <button onClick={() => handleDelete(request.id)} className="button-delete"><Icon icon="ep:success-filled" className="button__icon-delete" /></button>
                </div>
                ))
                ) : (
                    <div>No Request Found</div>
                )}
            </div> 
        </div>
        </>
    )
}