import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const ANALYSIS_PROMPT = `You are an expert IELTS Speaking examiner. Analyze the following speaking test responses and provide your analysis in JSON format with the following structure:

{
  "overall_score": number,
  "overall_feedback": string,
  "responses": [
    {
      "part": number,
      "question": number,
      "scores": {
        "fluency_coherence": number,
        "lexical_resource": number,
        "grammatical_range": number,
        "pronunciation": number
      },
      "feedback": {
        "strengths": string[],
        "areas_for_improvement": string[],
        "specific_examples": string[],
        "tips": string[]
      }
    }
  ],
  "improvement_areas": {
    "fluency_coherence": string[],
    "lexical_resource": string[],
    "grammatical_range": string[],
    "pronunciation": string[]
  }
}

Ensure all scores are between 0-9. Be thorough but concise in your feedback. Use specific examples from the responses.

The responses are:
`;

export async function POST(request: Request) {
  try {
    const { responses } = await request.json();

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json({ 
        error: 'Invalid request format' 
      }, { status: 400 });
    }

    // Format responses for the prompt
    const formattedResponses = responses
      .filter(r => r.transcription)
      .map(r => `Part ${r.partIndex}, Question ${r.questionIndex}:
Question: ${r.question}
Response: ${r.transcription}
`).join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert IELTS Speaking examiner. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: ANALYSIS_PROMPT + formattedResponses
        }
      ],
      temperature: 0.7,
    });

    const analysis = JSON.parse(completion.choices[0].message.content!);
    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze responses',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 