import { NextResponse } from "next/server";
import Replicate from "replicate";
export const revalidate = 0

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
 
export async function GET(request: Request, {params}: {params: {id: string}}) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ detail: "Missing prediction ID" }, { status: 400 });
    }

    let prediction;
    try {
      prediction = await replicate.predictions.get(id);
    } catch (replicateError) {
      console.error("Replicate GET error:", replicateError);
      return NextResponse.json(
        { detail: `Replicate API error: ${replicateError instanceof Error ? replicateError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    if (prediction?.error) {
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Unexpected error in prediction GET API:", error);
    return NextResponse.json(
      { detail: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}