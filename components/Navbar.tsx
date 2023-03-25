import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
  const { user, logout } = useAuth()
  console.log("Navbar rendered");
    return(
<>

      <nav className="bg-gray-800">
  <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div className="relative flex h-16 items-center justify-between">
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
      
        <button type="button" className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
         
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
         
          <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex flex-shrink-0 items-center ">
        <Link className="hover:scale-105" href="/" passHref>
          <img className="block h-8 w-auto lg:hidden " src="/rbai.png" alt="Your Company"></img>
          <img className="hidden h-8 w-auto lg:block lg:h-14" src="/rbai.png" alt="Your Company"></img>
          </Link>
        </div>
        
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
       
       
        <div className="relative ml-3">
          <div>
          {user ? (
          <button type="button" className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            
            <Link className="text-gray-100 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-md  font-black" href="/" onClick={() => {logout()}}>Log Out</Link>

          </button>
           ): (
            <>

<button type="button" className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            
            <Link className="text-gray-100 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-md font-black" href="/login" passHref>Login</Link>
              
          </button>
          <button type="button" className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            
        <Link  className="text-gray-100 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-md font-black" href="/signup" passHref>Sign Up</Link>

        </button>
        </>
        )}
          </div>


         
        </div>
        
      </div>
    </div>
  </div>


  
</nav>

</>
)

};
export default Navbar;