"use client"
import React, { useContext, useState } from 'react'
import StorySubjectInput from './_components/StorySubjectInput'
import StoryType from './_components/StoryType'
import AgeGroup from './_components/AgeGroup'
import ImageStyle from './_components/ImageStyle'
import { Button } from '@nextui-org/button'
import { chatSession } from '@/config/GeminiAi'
import { db } from '@/config/db'
import { StoryData, Users } from '@/config/schema'
//@ts-ignore
import uuid4 from "uuid4";
import CustomLoader from './_components/CustomLoader'
import axios from 'axios'
import router, { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { toast } from 'react-toastify'
import { UserDetailContext } from '../_context/UserDetailContext'
import { eq } from 'drizzle-orm'
const CREATE_STORY_PROMPT=process.env.NEXT_PUBLIC_CREATE_STORY_PROMPT
export interface fieldData{
  fieldName:string,
  fieldValue:string
}
export interface formDataType{
  storySubject:string,
  storyType:string,
  imageStyle:string,
  ageGroup:string
}
function CreateStory() {

  const [formData, setFormData]=useState<formDataType>();
  const [loading,setLoading]=useState(false);
  // const router=useRouter();
  const notify = (msg:string) => toast(msg);
  const notifyError = (msg:string) => toast.error(msg);
  const {user}=useUser();
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  /** 
  * used to add data to form
  * @param data
  */
  const onHandleUserSelection=(data:fieldData)=>{
    setFormData((prev:any)=>({
      ...prev,
      [data.fieldName]:data.fieldValue
    }));
    console.log(formData)
  }

  const GenerateStory=async()=>{

    if(userDetail.credit<=0){
      notifyError('You do not have enough credits!');
      return ;
    }

    setLoading(true);
    const FINAL_PROMPT=CREATE_STORY_PROMPT
    ?.replace('{ageGroup}',formData?.ageGroup??'')
    .replace('{storyType}',formData?.storyType??'')
    .replace('{storySubject}',formData?.storySubject??'')
    .replace('{imageStyle}',formData?.imageStyle??'')
    // Generate AI Story
      try{
        const result=await chatSession.sendMessage(FINAL_PROMPT || "Hello, world!");
        const story=JSON.parse(result?.response.text());
        const imageResp=await axios.post('/api/generate-image',{
          prompt:'Add text with title:'+story?.storyTitle+
          " in bold text for book cover, "+story?.storyCoverPrompt?.alt
        })
        
        const AiImageUrl=imageResp?.data?.imageUrl

        const imageResult=await axios.post('/api/save-image',{
          url:AiImageUrl
        });

        const FirebaseStorageImageUrl=imageResult.data;
        console.log(imageResult.data);

        const resp:any= await SaveInDB(result?.response.text(),FirebaseStorageImageUrl);
        console.log(resp);
        notify("Story Generated")
        await UpdateUserCredits();
        // router?.replace('/view-story/'+resp[0].storyId)
        setLoading(false);
      }catch(e){
        console.log(e);
        notifyError('Server Error, Try again')
        setLoading(false);
      }

    // Save in DB

    // Generate Image
    // @param output
    // @returns
  }
  const SaveInDB=async(output: string, imageUrl: string)=>{
    const recordId=uuid4();
    setLoading(true)
    
    try{
      const result=await db.insert(StoryData).values({
          storyId:recordId,
          ageGroup:formData?.ageGroup,
          imageStyle:formData?.imageStyle,
          storySubject:formData?.storySubject,
          storyType:formData?.storyType,
          output:JSON.parse(output),
          coverImage:imageUrl,
          userEmail:user?.primaryEmailAddress?.emailAddress,
          userImage:user?.imageUrl,
          userName:user?.fullName
      }).returning({storyId:StoryData?.storyId})
      setLoading(false);
      return result;
    }
    catch(e){
      setLoading(false);
    }
  }

  const UpdateUserCredits=async()=>{
    const result=await db.update(Users).set({
      credit:Number(userDetail?.credit-1)
    }).where(eq(Users.userEmail,user?.primaryEmailAddress?.emailAddress??''))
    .returning({id:Users.id})
  }

  return (
    <div className='p-10 md:px-20 lg:px-40'>
    <h2 className='font-extrabold text-[70px] text-primary text-center'>CREATE YOUR STORY</h2>
    <p className='text-2xl text-primary text-center'>Unlock your creativity with AI: Craft stories like never before! Let our AI bring your imagination to life, one story at a time.</p>
    
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-14'>
      
      {/* Story Subject */}
      <StorySubjectInput userSelection={onHandleUserSelection} />

      {/* Story type */}
      <StoryType userSelection={onHandleUserSelection}/>
      {/* Age Group */}
      <AgeGroup userSelection={onHandleUserSelection}/>
      {/* Image Style */}
      <ImageStyle userSelection={onHandleUserSelection}/>
    </div>
    <div className='flex justify-end my-10 flex-col items-end'>
      <Button color='primary' 
      disabled={loading}
      className='p-10 text-2xl'
      onPress={GenerateStory}>Generate Story</Button>
      <span>1 Credit will be used</span>
    </div>
    <CustomLoader isLoading={loading} />
    </div>
  )
}

export default CreateStory