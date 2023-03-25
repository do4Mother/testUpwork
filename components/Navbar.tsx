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
      
      <Link className="hover:scale-105" href="/" passHref>
        <img className="block h-8 w-auto lg:hidden " src="/rbai.png" alt="Your Company"></img>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex flex-shrink-0 items-center ">
        <Link className="hover:scale-105" href="/" passHref>
          
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