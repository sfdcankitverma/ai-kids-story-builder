"use client"
import { db } from '@/config/db';
import { Users } from '@/config/schema';
import { ClerkProvider, useUser } from '@clerk/nextjs'
import { NextUIProvider } from '@nextui-org/react'
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { UserDetailContext } from './_context/UserDetailContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function Provider({children}:{children: React.ReactNode}) {

  const [userDetail,setUserDetail]=useState<any>();
  const {user}=useUser();

useEffect(()=>{
  user&&saveNewUserIfNotExist();
},[user])

  const saveNewUserIfNotExist=async()=>{
    // check if user exists
    const userResp=await db.select().from(Users)
    .where(eq(Users.userEmail,user?.primaryEmailAddress?.emailAddress??''))

    console.log("Existing user", userResp);
    // if not, add user to db 
    if(!userResp[0])
    {
      const result=await db.insert(Users).values({
        userEmail:user?.primaryEmailAddress?.emailAddress,
        userImage:user?.imageUrl,
        userName:user?.fullName
      }).returning({
        userEmail:Users.userEmail,
        userName:Users.userName,
        userImage:Users.userImage,
        credit:Users.credit
      })
      console.log("New User", result[0]);
      setUserDetail(result[0]);
    }else{
      setUserDetail(userResp[0]);
    }
  }
  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID??'' }}>

    <NextUIProvider>
        {children}
        <ToastContainer />
    </NextUIProvider>
    </PayPalScriptProvider>
    </UserDetailContext.Provider>
  )
}

export default Provider