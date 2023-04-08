import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useAuth } from "../context/AuthContext"


const SignUp = () => {
  const router = useRouter()
  const { user, signup } = useAuth()
  //console.log(user)
  
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const handleSignUp = async (e: any) => {
    e.preventDefault()
        try{
            await signup(data.email, data.password)
            router.push("/")
        } catch(err){
            //console.log(err)
        }

    //console.log(data)
  }

  return (
    <div className="flex min-h-full items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
  <div className="w-full max-w-md space-y-8 border-solid border-4 border-gray-300 py-8 px-4 rounded-xl">
    <div>
    <h1 className="mt-4 text-center text-4xl font-bold tracking-tight text-gray-900">👤</h1>
    <h2 className="mt-4 text-center text-5xl font-bold tracking-tight text-gray-900">Sign Up</h2>
     
    </div>
    <form className="mt-8 space-y-6" action="#" onSubmit={handleSignUp} method="POST">
      <input type="hidden" name="remember" value="true"></input>
      <div className="-space-y-px rounded-md shadow-sm">
        <div>
          <label className="sr-only">Email address</label>
          <input onChange={(e:any)=> setData({...data, email:e.target.value})}  value= {data.email} id="email-address" name="email" type="email"  required className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-800 md:text-md sm:leading-6" placeholder="Email address"></input>
        </div>
        <div>
          <label className="sr-only">Password</label>
          <input onChange={(e:any)=> setData({...data, password:e.target.value})}  value= {data.password} id="password" name="password" type="password"  required className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-800 md:text-md sm:leading-6" placeholder="Password"></input>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label  className="ml-2 block text-md text-gray-900 font-semibold">Already have an account</label>
        </div>

        <div className="text-md">
          <a href="/login" className="font-medium font-semibold text-indigo-600 hover:text-indigo-500">Log In</a>
        </div>
      </div>

      <div>
        <button type="submit" className="group relative flex w-full justify-center rounded-md bg-black py-2 px-3 text-md font-semibold text-white hover:bg-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-slate-50 group-hover:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
            </svg>
          </span>
          Sign Up
        </button>
      </div>
    </form>
  </div>
</div>
  )
}

export default SignUp;