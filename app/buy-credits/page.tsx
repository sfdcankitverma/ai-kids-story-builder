"use client"
import { PayPalButtons } from '@paypal/react-paypal-js';
import React, { useContext, useEffect, useState } from 'react'
import { UserDetailContext } from '../_context/UserDetailContext';
import { Users } from '@/config/schema';
import { db } from '@/config/db';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

function BuyCredits() {
    const Options=[
        {
            id:1,
            price:1.99,
            credits:10
        },
        {
            id:2,
            price:3.99,
            credits:20
        },
        {
            id:3,
            price:5.99,
            credits:30
        },
        {
            id:4,
            price:9.99,
            credits:50
        }
    ]
    const [selectedOption,setSelectedOption]=useState<number>(0);
    const {userDetail,setUserDetail}=useContext(UserDetailContext);
    const router=useRouter();
    const notify = (msg:string) => toast(msg);
    const notifyError = (msg:string) => toast.error(msg);
    const OnPaymentSuccess=async()=>{
        const result=await db.update(Users)
        .set({
            credit:Options[selectedOption].credits+userDetail.credits
        }).where(eq(Users.userEmail,userDetail.userEmail));
        if(result){
            notify("Credit is Added!")
            setUserDetail((prev:any)=>({
                ...prev,
                ['credit']:Options[selectedOption].credits+userDetail.credits
            }))
            router.replace('/dashboard');
        }else{
            notifyError('Server Error')
        }
        
    }
  return (
    <div className='min-h-screen p-10 md:px-20 lg:px-40 text-center'>
        <h2 className='text-4xl font-bold text-primary'>
            Add More Credits</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 mt-10 gap-10 items-center justify-center'>
            <div>
                {Options.map((option,index)=>(
                    <div className={`p-6 my-3 border bg-primary text-center rounded-lg
                     text-white cursor-pointer hover:scale-105 transition-all
                    ${selectedOption==option.id&&'bg-black'}
                    `}
                     onClick={()=>setSelectedOption(option.id)}>
                        <h2>Get {option.credits} Credits= {option.credits} Stories</h2>
                        <h2 className='font-bold text-2xl'>${option.price}</h2>
                    </div>
                ))}
            </div>
            <div>
                <PayPalButtons style={{ layout: "vertical" }} 
                disabled={!selectedOption || selectedOption==0}
                // @ts-ignore
                onApprove={()=>OnPaymentSuccess()}
                onCancel={()=>notifyError("Payment Cancelled!")}
                createOrder={(data,actions)=>{
                    // @ts-ignore
                    return actions.order.create({
                        purchase_units:[
                            {
                                // @ts-ignore
                                amount:{
                                    value:Number(Options[selectedOption-1].price).toFixed(2),
                                    currency_code:'USD'
                                }
                            }
                        ]
                    })
                }}
                />
            </div>
        </div>
    </div>
  )
}

export default BuyCredits