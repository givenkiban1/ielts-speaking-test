import { NextResponse } from 'next/server';

// Change from POST to post - this is the required naming convention
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ 
        error: 'No audio file provided or invalid file format' 
      }, { status: 400 });
    }

    // Log file details for debugging
    console.log('File size:', file.size);
    console.log('File type:', file.type);

    if (file.size === 0) {
      return NextResponse.json({ 
        error: 'Audio file is empty' 
      }, { status: 400 });
    }

    // Create new FormData for Lemonfox API
    const lemonfoxFormData = new FormData();
    lemonfoxFormData.append('file', file);
    lemonfoxFormData.append('language', 'english');
    lemonfoxFormData.append('response_format', 'json');

    const response = await fetch('https://api.lemonfox.ai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LEMONFOX_API_KEY}`,
      },
      body: lemonfoxFormData,
    });

    const data = await response.json();

    // Log the Lemonfox response for debugging
    console.log('Lemonfox API response:', data);

    if (!response.ok) {
      return NextResponse.json({ 
        error: data.error?.message || 'Lemonfox API error',
        details: data.error,
        status: response.status
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      error: 'Failed to transcribe audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 