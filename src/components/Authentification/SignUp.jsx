import './signup.css'
import { Link,useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react'
import {toast } from 'react-toastify';

export default function SignUp(){
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [governmentFile,setGovernmentFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate();


    const governmentFileName = useRef();

    async function sendData(){
        try {

            const filePattern = /\.(pdf|jpg|jpeg|png)$/;
            if (!governmentFile) throw new Error('No file selected');
            if (governmentFile == null) throw new Error("This field is mandatory.")
            if (!filePattern.test(governmentFile.name)) throw new Error("Unsupported file format. Please upload a .pdf, .jpg, .jpeg or .png file");

            const formData = new FormData();
            formData.append('user[first_name]',firstName);
            formData.append('user[last_name]',lastName);
            formData.append('user[email]',email);
            formData.append('user[password]',password);
            formData.append('user[government_file]',governmentFile);
            
            const response = await fetch("http://localhost:4000/users",{
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {throw new Error(`This is an HTTP Error ${response.status}`)
        }

            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setGovernmentFile(null);

            governmentFileName.current.value = '';
            toast.success('Registration confirmed !', {
                onClose: () => navigate('/')
              });

        } catch (error) {
            toast.error(`${error}`);
    
        }
    }

    const handleFirstName = (event)=>{
        setFirstName(event.target.value);
    }
    const handleLastName = (event) =>{
        setLastName(event.target.value);
    }
    const handleEmail = (event) =>{
        setEmail(event.target.value);
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
    }
    const handleGovernmentFile = (event) => {
        setGovernmentFile(event.target.files[0]);
        setFileName(event.target.files[0].name);

    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        sendData();
    }

    return(
        <div className='signup'>  
            <div className='signup__container'>
                <div className='signup__left'>
                    <h3 className='signup__title'>Let's get you started</h3>
                    <form className='signup__form' onSubmit={handleSubmit}>
                        <div className='signup__form__item'>
                            <label className='sign__up__form__label'>First name</label>
                            <input type='text' value={firstName} onChange={handleFirstName} placeholder='Steven' className='sign__up__form_input' required/>
                        </div>
                        <div className='signup__form__item'>
                            <label className='sign__up__form__label'>Last name</label>
                            <input type='text' value={lastName} onChange={handleLastName} placeholder='Spielberg' className='sign__up__form_input' required/>
                        </div>
                        <div className='signup__form__item'>
                            <label className='sign__up__form__label'>Email address</label>
                            <input type='text' value={email} onChange={handleEmail} placeholder='yourname@email.com'className='sign__up__form_input' pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'  required/>
                        </div>
                        <div className='signup__form__item'>
                            <label className='sign__up__form__label'>Create password</label>
                            <input type='password' value={password} onChange={handlePassword} placeholder='•••••••••' className='sign__up__form_input' minLength="8" required/>
                            <p className='sign_up__password'>Password must contain a minimum of 8 characters</p>
                        </div>
                        <div className='signup__form__item'>
                            <label htmlFor='fileUpload' className='signup__form__customsubmit'>Government file</label>
                            <span className='signup__form__submit_description'>Submit a copy of a government-approved ID (approved formats: .jpg, .png, .pdf).</span>
                            <p className='signup__fileName'>{fileName}</p>
                            <input id='fileUpload' type='file' ref={governmentFileName} onChange={handleGovernmentFile} className='hidden'/>
                        </div>

                        <input type='submit' value={`Sign in`} className='form__submit'/>
                        <p>Already a user? <Link to={`/sign_in`}>Login</Link></p>
                    </form>
                </div>
                <div className='signup__right'>
                    <ul className='signup__nav'>

                        <li>
                        <Link to={`/`} className='signup__nav__item nav__item'>Home</Link>
                        </li>
                        <li>
                        <Link to={`/sign_in`} className='signup__nav__item nav__item signup__nav__btn nav__btn'>SIGN IN</Link>
                        </li>
                    </ul>
                    <div className='signup__quote'>
                        <h1>"Alone we can do so little; together we can do so much."</h1>
                        <p>- Hellen Keller</p>
                    </div>
                </div>
            </div>
        </div>
    )
}