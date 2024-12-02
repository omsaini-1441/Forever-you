import React from 'react'

const NewsLetterBox = () => {

  const onSubmitHandler = (event) =>{
      event.preventDefault();
  }

  return (
    <div className='text-center ' >
      <p className='text-2xl font-medium text-gray-800 '>Subscribe Now & get 20% Off</p>
      <p className='text-gray-400 mt-3  '>
      Sign up today and unlock a special 20% discount on your first purchase. Don't miss out!
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3  '>
        <input className='w-full sm:flex-1 outline-none ' type="email" placeholder='Enter your email' required />
        <button className='bg-black text-white text-xs px-10 py-4 ' type='submit'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsLetterBox  
