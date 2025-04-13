import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
// export async function POST(req:NextRequest) {

// const data=await req.json();
// const {prompt}=data;
// const replicate = new Replicate({
//     auth:process.env.REPLICATE_API_TOKEN
// });

// const input = {
//     prompt: prompt,
//     output_format:"png",
//     output_quality:80,
//     aspect_ratio:"1:1"
// };
// console.log("🔥 Hit /api/generate-image route");
// console.log("🧠 Prompt:", prompt);

// const rawOutput:any = await replicate.run("black-forest-labs/flux-schnell", { input });
// const output = rawOutput as string[];

// for (const [index, item] of Object.entries(output)) {
//     await writeFile(`output_${index}.webp`, item);
//   }  
// console.log("Raw Replicate Output:", JSON.stringify(output, null, 2));
// if (!output || !output[0]) { throw new Error("No image URL returned from Replicate") }

// return NextResponse.json({"imageUrl":output[0]})
// }
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { prompt } = data;

  console.log("🔥 Hit /api/generate-image route");
  console.log("🧠 Prompt:", prompt);

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
  });

  try {
    // Step 1: Create prediction
    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-schnell",
      input: {
        prompt,
      },
    });

    console.log("🚀 Prediction started:", prediction.id);

    // Step 2: Poll until complete
    let completed;
    for (let i = 0; i < 10; i++) {
      const latest = await replicate.predictions.get(prediction.id);
      console.log(`🔄 Polling attempt ${i + 1}: ${latest.status}`);
      if (latest.status === "succeeded" || latest.status === "failed") {
        completed = latest;
        break;
      }
      await new Promise((res) => setTimeout(res, 2000)); // wait 2s
    }

    if (!completed || completed.status !== "succeeded") {
      throw new Error("Prediction failed or did not complete in time");
    }

    console.log("✅ Prediction completed. Output:", completed.output);

    // Step 3: Return output
    return NextResponse.json({ imageUrl: completed.output[0]});


  } catch (error: any) {
    console.error("❌ Error in image generation:", error.message);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}