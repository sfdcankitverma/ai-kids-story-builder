import React from 'react'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import Image from "next/image";
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/react';

type StoryItemType={
    story:{id:number,
    storyType:string,
    ageGroup:string,
    coverImage:string,
    imageStyle:string,
    output:[]|any,
    storyId:string,
    storySubject:string,
    userEmail:string,
    userImage:string,
    userName:string}
}
function StoryItemCard({story}:StoryItemType) {
    const coverImage = story?.coverImage
    ? JSON.parse(story.coverImage)?.imageUrl
    : "/pixel.png";
  return (
    <Link href={'/view-story/'+story?.storyId}>
        <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5
        hover:scale-105 transition-all cursor-pointer">
        <Image
          alt="Card example background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src={coverImage}
          height={500}
          width={500}
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className="text-black text-md">
                {story?.output?.storyTitle}
            </p>
          </div>
          <Button className="text-tiny" color="primary" radius="full" size="sm">
            Read Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default StoryItemCard