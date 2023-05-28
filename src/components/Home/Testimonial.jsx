import './testimonial.css'
import user_1 from '../../assets/user_1.svg'
import user_stars from '../../assets/user_stars.svg'
import user_2 from '../../assets/user_2.svg'
import user_3 from '../../assets/user_3.svg'

export default function Testimonial(){
    return(
       <div className='container'>
            <div className='testimonial__text'>
                <h2 className='testimonial__subtitle'>Testimonials</h2>
                <h1 className='testimonial__title'>What our community members say about us</h1>
            </div>
            <div className='testimonial__grid'>
                <div className='testimonial__card'>
                    <div className='testimonial__card__img'>
                        <img src={user_1} alt="Profil user" />
                    </div>
                    <h3 className='testimonial__card__name'>
                        Steven Spielberg
                    </h3>
                    <div className='testimonial__card__stars'>
                        <img src={user_stars} alt="Stars" />
                    </div>
                    <p className='testimonial__card__comment'>
                    "I can't believe how amazing this platform is! It connected me with people who genuinely wanted to help."
                    </p>
                </div>
                <div className='testimonial__card'>
                    <div className='testimonial__card__img'>
                        <img src={user_2} alt="Profil user" />
                    </div>
                    <h3 className='testimonial__card__name'>
                        Steven Spielberg
                    </h3>
                    <div className='testimonial__card__stars'>
                        <img src={user_stars} alt="Stars" />
                    </div>
                    <p className='testimonial__card__comment'>
                    "I can't believe how amazing this platform is! It connected me with people who genuinely wanted to help."
                    </p>
                </div>
                <div className='testimonial__card'>
                    <div className='testimonial__card__img'>
                        <img src={user_3} alt="Profil user" />
                    </div>
                    <h3 className='testimonial__card__name'>
                        Steven Spielberg
                    </h3>
                    <div className='testimonial__card__stars'>
                        <img src={user_stars} alt="Stars" />
                    </div>
                    <p className='testimonial__card__comment'>
                    "I can't believe how amazing this platform is! It connected me with people who genuinely wanted to help."
                    </p>
                </div>
            </div>
       </div> 
    )
}