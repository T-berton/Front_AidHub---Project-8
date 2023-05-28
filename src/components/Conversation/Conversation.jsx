import Nav from '../Shared/Nav/Nav'
import './conversation.css'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { decodeToken  } from "react-jwt";
import { Icon } from '@iconify/react';
import profile_picture_1 from '../../assets/undraw_male_avatar_g98d.svg'



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

  async function fetchConversations(){
      try {
        const myDecodedToken = decodeToken(token);
        setCurrentUserId(myDecodedToken.user_id);      
        const response = await fetch(`http://localhost:4000/conversations?my_conversations=true`,{
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

  async function fetchMessage(conversationId){
    try {
      const response = await fetch(`http://localhost:4000/messages?conversation_id=${conversationId}`,{
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
  };
  
async function sendMessage(){
  try {
    const response = await fetch(`http://localhost:4000/messages`,{
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
      fetchConversations();
  },[]);

  useEffect(()=>{
    if (selectedConversation && !messages[selectedConversation]) {
      fetchMessage(selectedConversation);
    }
  },[selectedConversation]);
  
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
},[selectedConversation,CableApp?.cable]);


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
          <img src={profile_picture_1} alt='Profile Picture'/> 
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
                  <img src={profile_picture_1} alt='Profile Picture'/>  
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