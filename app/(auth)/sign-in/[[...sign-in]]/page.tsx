import { SignIn } from '@clerk/nextjs'
import Image from 'next/image';

export default function Page() {
  return (
    <><div className='grid grid-cols-1 md:grid-cols-2 min-h-screen'>
    {/* Left Side - Image */}
    <div className='flex justify-center items-center'>
      <Image 
        src='/login.png' 
        alt='login' 
        width={500} 
        height={700} 
        className='w-full h-auto object-contain' 
      />
    </div>

    {/* Right Side - Sign In */}
    <div className='flex justify-center items-center'>
      <SignIn />
    </div>
  </div></>
  )
}