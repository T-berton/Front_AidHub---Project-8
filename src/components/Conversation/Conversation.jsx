import Nav from '../Shared/Nav/Nav'
import './conversation.css'
import { useContext, useEffect, useState,useCallback } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { decodeToken  } from "react-jwt";
import { Icon } from '@iconify/react';
import profile_picture_1 from '../../assets/undraw_male_avatar_g98d.svg'
import { API_URL } from './config';



export default function Conversation(){

  const {getToken,CableApp,Loading} = useContext(AuthContext);
  const [conversations,setConversation] = useState(null);
  const [currentUserId,setCurrentUserId] = useState(null);
  const [selectedConversation,setSelectedConversation] = useState(null);
  const [messages,setMessages] = useState({});
  const [subscription,setSubscription] = useState(null);
  const [messageSent,setMessageSent] = useState("");
  const token = getToken();
  

  const [otherUser,setOtherUser] = useState();

  
  const fetchMessage = useCallback(async (conversationId) => {
    try {
      const response = await fetch(`${API_URL}/messages?conversation_id=${conversationId}`,{
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok){
        throw new Error(`${response.status}`);
    }

    const message_json = await response.json();
    console.log(message_json);
    setMessages(prevMessages =>({...prevMessages,[conversationId]:message_json}));
      
    } catch (error) {
      toast.error(`${error}`);
    }
  },[token]);
  
async function sendMessage(){
  try {
    const response = await fetch(`${API_URL}/messages`,{
        method:"POST",
        body: JSON.stringify({
          "message":{
            "conversation_id":selectedConversation,
            "content":messageSent,
          } 
        }),
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok){
        throw new Error(`${response.status}`);
    }
    setMessageSent("")
  } catch (error) {
    toast.error(`${error}`);
  }
}


  useEffect(()=>{
    async function fetchConversations(){
      try {
        const myDecodedToken = decodeToken(token);
        setCurrentUserId(myDecodedToken.user_id);      
        const response = await fetch(`${API_URL}/conversations?my_conversations=true`,{
              headers:{
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });

          if (!response.ok){
              throw new Error(`HTTP ERROR: ${response.status}`);
          }

          var response_json = await response.json();
          response_json = response_json.map((conversation)=>{
            return{
              ...conversation,
              otherUser: conversation.conversation_users.filter((conversation_user)=>{return conversation_user.user_id !== myDecodedToken.user_id })[0]
            }
          })

          setConversation(response_json);
          console.log(response_json);


      } catch (error) {
          toast.error(`${error}`)
      }
  }

      fetchConversations();
  },[token]);

  useEffect(()=>{
    if (selectedConversation && !messages[selectedConversation]) {
      fetchMessage(selectedConversation);
    }
  },[selectedConversation,fetchMessage,messages]);
  
  useEffect(()=>{
    if (selectedConversation && CableApp?.cable) {
        if (subscription){
            subscription.unsubscribe();
        }
        
        const newSubscription = CableApp.cable.subscriptions.create({
            channel: "MessagesChannel",
            conversation_id: selectedConversation,
        },{
            received: (newMessage) =>{
                if (newMessage.message && newMessage.message.user) {
                    setMessages(prevData=>({...prevData,[selectedConversation]:[...prevData[selectedConversation],newMessage.message]}));
                } else {
                    console.error("Received Message without user information")
                }
            }
        });
        setSubscription(newSubscription);
    } else {
        if (!selectedConversation) {
            console.warn("No conversation is selected");
        }
        if (!CableApp?.cable) {
            console.error("WebSocket connection is not available");
        }
    }
    return ()=>{
        if (subscription) {
            subscription.unsubscribe();
        }
    };
},[selectedConversation,CableApp?.cable,subscription]);


  if (Loading) {
    return <div>Loading...</div>;
}
  
return(
  <>
    <Nav/>
    <div className='conversation__container'>
      <div className='conversation__header'>
        <div className='conversation__header__title'>
          <h3>
            Chat & Help
          </h3>
        </div>
        <div className='conversation__header__user'>
          <img src={profile_picture_1} alt='Profile'/> 
          {
            otherUser && (
              <p>{otherUser.user?.first_name} {otherUser.user?.last_name}</p>
            )
          }
        </div>
      </div>
      <div className='conversation__chat'>
        <div className='conversation__list'>
          <ul>
            {conversations ? (
              conversations.map((conversation)=>(
              <li key={conversation.id} onClick={()=>{setSelectedConversation(conversation.id);setOtherUser(conversation.otherUser)}}>
                <div className='conversation__list__header'>
                  <img src={profile_picture_1} alt='Profile'/>  
                  <div>
                      {conversation.otherUser && (
                          <h3>
                            {conversation.otherUser.user?.first_name} {conversation.otherUser.user?.last_name}
                          </h3>
                        )
                      }
                    <p>
                      {conversation.request.title}
                    </p>
                    <p>{conversation.request.task_type}</p>
                  </div>
                </div>
              </li>
              ))
            ):(
              <div>No Conversation Found</div>
            )    
            }
          </ul>
        </div>
        <div className='conversation__box'>
          <div className='conversation__box__message'>
          {
              selectedConversation && messages[selectedConversation] ? (
              <>
                {
                messages[selectedConversation].map((message, index) => {
                  return (
                      <div key={index} className={message.user_id === currentUserId ? 'messages__blue': 'messages__green'}> 
                          <h3>{message.user.first_name} {message.user.last_name}</h3>
                          <p>{message.content}</p>
                      </div>
                  );
                })}
              </>
              ):(
                <div>No Messages Found</div>
              )
            }
          </div>
          <div className='conversation__box__btn'>
            <input type="text" placeholder='Type your text here' value={messageSent} onChange={e => {setMessageSent(e.currentTarget.value)}}/>
            <button onClick={e=>{e.preventDefault(); sendMessage();}}>
            <Icon icon="material-symbols:send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)
}