import './footer.css'
import logo from '../../../assets/logo_light.svg'
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { useContext } from 'react';


function Footer(){

    const {isAuthenticated,logOut} = useContext(AuthContext)

    return(
        <footer className='footer'>
            <div className='footer__container'>
                <div className='footer__socials'>
                    <div className='footer__logo'>
                        <img src={logo} alt ="Logo AidHub"/>
                    </div>
                    <div className='footer__social__network'>
                        <a href='https://www.facebook.com/'><Icon icon="iconoir:facebook" className='footer__icon' /></a>
                        <a href='https://www.twitter.com/'><Icon icon="iconoir:twitter" className='footer__icon'/></a>
                        <a href='https://www.instagram.com/'><Icon icon="iconoir:instagram" className='footer__icon'/></a>
                        <a href='https://www.linkedin.com/'><Icon icon="iconoir:linkedin" className='footer__icon'/></a>

                    </div>
                </div>
                <div className='footer__pages'>
                    <h2 className='footer__title'>Pages</h2>
                    {isAuthenticated ? (
                                    <ul className='footer__list'>
                                    <li>
                                        <Link to={`/`} className='footer__item'>Home</Link>
                                    </li>
                                    <li>
                                        <Link to={`/`} className='footer__item'>Conversations</Link>
                                    </li>
                                    <li>
                                        <Link to={`/`} className='footer__item'>Map</Link>
                                    </li>
                                    <li>
                                        <Link to={`/`} className='footer__item'>Submit A Request</Link>
                                    </li>
                                    <li>
                                        <Link to={`/`} className='footer__item' onClick={logOut}>SIGN OUT</Link>
                                    </li>
                                </ul>
                    ):(
                        <ul className='footer__list'>
                        <li>
                            <Link to={`/`} className='footer__item'>Home</Link>
                        </li>
                        <li>
                            <Link to={`/`} className='footer__item'>Sign In</Link>
                        </li>
                        <li>
                            <Link to={`/`} className='footer__item'>Sign Up</Link>
                        </li>
                    </ul>
                    )}               
                </div>
                <div className='footer__contactus'>
                    <h2 className='footer__title'>Company</h2>

                    <ul className='footer__list'>
                        <li>
                            <Link to={`/`} className='footer__item'>Policy Privacy</Link>
                        </li>
                        <li>
                            <Link to={`/`} className='footer__item'>Terms of Use</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='hr'>
                <hr/>
            </div>
                <div className='footer__copyright'>
                © 2023 | Developped by Thomas Berton  
                </div>
        </footer>
    )
}

export default Footer