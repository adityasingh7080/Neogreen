import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side call directly to Render
    const response = await fetch("https://neogreen-7321.onrender.com/api/v1/calculator/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Prevent server-side caching on Next.js
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: "Backend request failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}