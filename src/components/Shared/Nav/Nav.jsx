import './nav.css'
import { Link } from 'react-router-dom'
import logo from '../../../assets/logo.svg'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext } from 'react'
import { Fade as Hamburger } from 'hamburger-react'


function Nav() {
    const {isAuthenticated,logOut} = useContext(AuthContext);
    return(
        <nav className='nav'>
            <Link to={`/`}>
                <img src={logo} alt="Logo Aidhub" />
            </Link> 
            <div className="nav__mobile">
                <Hamburger label="Show menu" rounded duration={0.8} color="#968864" onToggle={toggled =>{
                    const navListe = document.querySelector(".nav__list");
                    if (toggled) {
                        navListe.setAttribute('data-visible',true);
                    }
                    else {
                        navListe.setAttribute('data-visible',false);
                    }
                }}/>
                </div>
            {isAuthenticated ? (
                <>
                 <ul className='nav__list' data-visible="false">
                 <li>
                     <Link to={`/`} className='nav__item'>Home</Link>
                 </li>
                 <li>
                     <Link to={`/conversation`} className='nav__item'>My conversation</Link>
                 </li>
                 <li>
                     <Link to={`/myrequest`} className='nav__item'>My Request</Link>
                 </li>
                 <li>
                     <Link to={`/submit_request`} className='nav__item'>Submit a request</Link>
                 </li>
                 {/* <li>
                     <Link to={`/`} className='nav__item nav__btn'>MY PROFIL</Link>
                 </li> */}
                 <li>
                     <Link to={`/sign_out`} className='nav__item nav__btn nav__btn-dark'>SIGN OUT</Link>
                 </li>
             </ul>
             </>
            ) : (
                <>
                <ul className='nav__list' data-visible="false">
                <li>
                    <Link to={`/`} className='nav__item'>Home</Link>
                </li>
                <li>
                    <Link to={`/sign_in`} className='nav__item nav__btn'>SIGN IN</Link>
                </li>
                <li>
                    <Link to={`/sign_up`} className='nav__item nav__btn nav__btn-dark'>SIGN UP</Link>
                </li>
            </ul>
            </>
            )}
        </nav>
    )
    
}

export default Nav