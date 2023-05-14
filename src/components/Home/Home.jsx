import './home.css'

import Nav from '../Shared/Nav/Nav'
import Footer from '../Shared/Footer/Footer'
import { Link } from 'react-router-dom'
import hero_banner from '../../assets/hero.svg'
import Testimonial from './Testimonial'
import HowDoesItWork from './HowDoesItWork'
import Map from './Map'

function Home() {
return (
    <>
    <Nav/>
        <div className='container home__grid'>
            <div className='home__text'>
                <h1 className='home__text__title'>Innovative solutions for your assistance needs</h1>
                <p className='home__text__subtitle'>Discover all the support resources you need in one place.</p>
                <Link to={`/`} className='btn'>JOIN US NOW !</Link>
                <div className='home__text__keynumbers'>
                    <div className='home__text__keynumbers__item'>
                        <h1 className='home__text__keynumbers__item__title'>300+</h1>
                        <p className='home__text__keynumbers__item__subtitle'>Requests Solved</p>
                    </div>
                    <div className='home__text__keynumbers__item'>
                        <h1 className='home__text__keynumbers__item__title'>1000+</h1>
                        <p className='home__text__keynumbers__item__subtitle'>Community Members</p>
                    </div>
                    <div className='home__text__keynumbers__item'>
                        <h1 className='home__text__keynumbers__item__title'>5+</h1>
                        <p className='home__text__keynumbers__item__subtitle'>Years Experience</p>
                    </div>
                </div>
            </div>
            <div className='home__img'>
                <img src={hero_banner} alt="World Map" className='img' />
            </div>
        </div>
        <Map/>
        <HowDoesItWork/>
        <Testimonial/>
    <Footer/>
    </>
)
}

export default Home 