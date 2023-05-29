
import './signin.css'
import sign_in_design from '../../assets/sign_in.svg'
import logo from '../../assets/logo.svg'
import { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import {toast } from 'react-toastify';
import { API_URL } from './config';


export default function SignIn(){

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {isAuthenticated,logIn} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        sendData();
    }

    useEffect(()=>{
        if(isAuthenticated) navigate('/');
    })

    async function sendData(){
        try {
            const response = await fetch(`${API_URL}/auth/login`,{
                method: 'POST',
                body: JSON.stringify({
                    "email":email,
                    "password":password,
                }),
                headers:{
                    'Content-type': 'application/json',
                }
            });

            if(!response.ok) throw new Error(`HTTP Error : ${response.status}`)

            const json_response = await response.json();
            const token = json_response.token;
            logIn(token);
            setEmail('');
            setPassword('');
            navigate('/');

        } catch (error) {
            toast.error(`Connexion error: ${error}`);

            
        }
    }

    return(
        <div className='login__container'>
            <div className='login__nav__container'>
                <ul className='login__nav'>
                <li>
                <Link to={`/`} className='login__nav__item nav__item'>Home</Link>
                </li>
                <li>
                <Link to={`/sign_up`} className='login__nav__item nav__item login__nav__btn nav__btn'>SIGN UP</Link>
                </li>
                </ul>
            </div>
            <img src={sign_in_design} alt="Design curves"  className='login__design'/>
            <div className='login__card'>
                <div className='login__container__logo'>
                    <img src={logo} alt="Logo AidHub" className='login__logo' />
                </div>
                <h1 className='login__card__title'>Sign Into Your Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className='login__form__item'>
                        <label className='login__form__label'> Email</label>
                        <input type='text' value={email} onChange={handleEmail} placeholder='myemail@email.com' className='login__form_input'  required/>
                    </div>
                    <div className='login__form__item'>
                        <label className='login__form__label'>Password</label>
                        <input type='password' value={password} onChange={handlePassword} placeholder='•••••••••' className='login__form_input'  required/>
                    </div>
                    <div className='login__form__item'>
                        <input type='submit' value={`Sign in`} className='login__form__submit'/>
                        <p>No account? Sign up <Link to={`/sign_up`}>here</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )

}