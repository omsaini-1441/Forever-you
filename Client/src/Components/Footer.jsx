import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm  '>
            {/* Logo and description section */}
            <div>
                <img src={assets.logo} className='mb-5 w-32 ' alt="" />
                <p className='w-full md:w-2/3 text-gray-600 ' >
                Forever You is your trusted companion in discovering products that inspire and elevate your lifestyle. With a focus on quality, convenience, and customer satisfaction, we're committed to enhancing your shopping experience every step of the way.
                </p>
            </div>

            {/* Company links */}
            <div>
                <p className='text-xl font-medium mb-5' >COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600  '>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            {/* Contact information */}
            <div>
                <p className='text-xl font-medium mb-5  '>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600 '>
                    <li>+91-7719487204</li>
                    <li>contact@foreveryou.com</li>
                </ul>
            </div>
        </div>

        {/* Footer copyright */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center  '>Copyright {new Date().getFullYear()}@ forever.com - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
