import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {

    const { user } = useAuth()
    const router = useRouter()


    useEffect(() => {
        if(!user){
            router.push('/signup')
        }
    }, [router, user])



    return<>
    {user ? children: null}
    </>
     
    
}

export default ProtectedRoute;