// frontend/src/app/tools/age-calculator/actions.ts
"use server";

import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN, // Set this in your .env file
});

export async function getTenureInsight(years: number, months: number) {
  try {
    const chatCompletion = await client.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2", // Use a text model for tenure
      messages: [
        {
          role: "user",
          content: `Write a one-sentence professional resume achievement for someone who has completed ${years} years and ${months} months of tenure. Focus on loyalty and growth.`,
        },
      ],
      max_tokens: 100,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error);
    return "Successfully calculated tenure! Use this data to highlight your professional consistency.";
  }
}