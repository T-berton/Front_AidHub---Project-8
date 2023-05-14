
import './signin.css'
import sign_in_design from '../../assets/sign_in.svg'
import logo from '../../assets/logo.svg'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignIn(){

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('')

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
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
                        <input type='text' value={password} onChange={handlePassword} placeholder='•••••••••' className='login__form_input'  required/>
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