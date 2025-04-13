"use client";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";
import { StoryData } from "@/config/schema";
import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import BookCoverPage from "../_components/BookCoverPage";
import StoryPages from "../_components/StoryPages";
import LastPage from "../_components/LastPage";
import { Button } from "@nextui-org/button";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

function ViewStory({ params }: any) {
  const [story, setStory] = useState<any>();
  const bookRef = useRef<any>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(params.id);
    getStory();
  }, []);

  const getStory = async () => {
    const result = await db
      .select()
      .from(StoryData)
      .where(eq(StoryData.storyId, params.id));

    console.log(result[0]);
    setStory(result[0]);
  };
  const coverImage = story?.coverImage
    ? JSON.parse(story.coverImage)?.imageUrl
    : "/pixel.png";

  return (
    <div className="p-10 md:px-20 lg:px-40 flex-col">
      <h2 className="font-bold text-4xl text-center p-10 bg-primary text-white">
        {story?.output?.storyTitle}
      </h2>
      <div className="relative">
        {/* @ts-ignore */}
        <HTMLFlipBook
          width={500}
          height={500}
          showCover={true}
          className="mt-10"
          useMouseEvents={false}
          ref={bookRef}
        >
          <div>
            <BookCoverPage imageUrl={coverImage} />
          </div>
          {[...Array(story?.output?.chapters?.length)].map((item, index) => (
            <div key={index} className="bg-white p-10 border">
              <StoryPages storyChapter={story?.output?.chapters[index]} />
            </div>
          ))}
        </HTMLFlipBook>
        {count != 0 && (
          <div
            className="absolute -left-5 top-[250px]"
            onClick={() => {
              bookRef.current?.pageFlip().flipPrev();
              setCount(count - 1);
            }}
          >
            <IoIosArrowDropleftCircle className="text-[40px] text-primary cursor-pointer" />
          </div>
        )}
        {count != story?.output?.chapters?.length - 1 && (
          <div
            className="absolute -right-5 top-[250px]"
            onClick={() => {
              bookRef.current?.pageFlip().flipNext();
              setCount(count + 1);
            }}
          >
            <IoIosArrowDroprightCircle className="text-[40px] text-primary cursor-pointer" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewStory;
