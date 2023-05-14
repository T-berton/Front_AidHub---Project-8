import './howdoesitwork.css'
import step1 from '../../assets/step1.svg'
import step2 from '../../assets/step2.svg'
import step3 from '../../assets/step3.svg'
import step4 from '../../assets/step4.svg'




export default function HowDoesItWork()
{
    return(
            <div className='container step__container'>
                <div className='step__text'>
                    <h1 className='step__text__title'>How does it work ?</h1>
                    <p className='step__text__subtitle'>Explore the various stages involved in joining our app, and begin offering assistance or seeking help from others.</p>
                </div>
                <div className='step__content'>
                    <div className='step__content__item'>
                        <div className='step__content__item__img'>
                            <img src={step1} alt="Step 1" className='img' />
                        </div>
                        <div className='step__content__item__text'>
                            <h3 className='step__content__item__text__title'>Sign Up</h3>
                            <p className='step__content__item__text__subtitle'>Create your free account and join our ever-growing community of helpers.</p>
                        </div>
                    </div>
                    <div className='step__content__item'>
                        <div className='step__content__item__img'>
                            <img src={step2} alt="Step 2" className='img' />
                        </div>
                        <div className='step__content__item__text'>
                            <h3 className='step__content__item__text__title'>Find Help</h3>
                            <p className='step__content__item__text__subtitle'>Browse the interactive map to discover requests for assistance in your neighborhood.</p>
                        </div>
                    </div>
                    <div className='step__content__item'>
                        <div className='step__content__item__img'>
                            <img src={step3} alt="Step 3" className='img'/>
                        </div>
                        <div className='step__content__item__text'>
                            <h3 className='step__content__item__text__title'>Offer Help</h3>
                            <p className='step__content__item__text__subtitle'>Volunteer your time and talents to make a difference in someone's life.</p>
                        </div>
                    </div>
                    <div className='step__content__item'>
                        <div className='step__content__item__img'>
                            <img src={step4} alt="Step 4" className='img' />
                        </div>
                        <div className='step__content__item__text'>
                            <h3 className='step__content__item__text__title'>Submit a Request</h3>
                            <p className='step__content__item__text__subtitle'>Easily ask for help for yourself or on behalf of someone else in just a few clicks.</p>
                        </div>
                    </div>
                </div>
            </div>
    )
}