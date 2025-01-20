"use client";

import React, { useState, useEffect } from 'react';
import { getCurrentTestSession } from '@/lib/actions';
import { testParts } from '@/data/testData';
import { useRouter } from 'next/navigation';
import { TestSession } from '@/types';

interface RecordingMetadata {
  timestamp: string;
  partIndex: number;
  questionIndex: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [transcriptions, setTranscriptions] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [recordings, setRecordings] = useState<{[key: string]: boolean}>({});
  const [metadata, setMetadata] = useState<{[key: string]: RecordingMetadata}>({});
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessedResults, setHasProcessedResults] = useState(false);

  useEffect(() => {
    
    // Get test session
    const session = getCurrentTestSession();
    setTestSession(session);

    // Check for existing results
    const existingResults = localStorage.getItem('speaking_test_results');
    setHasProcessedResults(!!existingResults);

    // Check for recordings, metadata, and transcriptions
    testParts.forEach((part, partIndex) => {
      part.questions.forEach((_, questionIndex) => {
        const audioKey = `recording_part${partIndex + 1}_q${questionIndex + 1}`;
        const hasRecording = localStorage.getItem(audioKey) !== null;
        const metadataStr = localStorage.getItem(`${audioKey}_metadata`);
        const transcriptionStr = localStorage.getItem(`${audioKey}_transcription`);
        
        if (hasRecording) {
          setRecordings(prev => ({ ...prev, [audioKey]: true }));
        }
        
        if (metadataStr) {
          setMetadata(prev => ({ 
            ...prev, 
            [audioKey]: JSON.parse(metadataStr) 
          }));
        }

        if (transcriptionStr) {
          setTranscriptions(prev => ({
            ...prev,
            [audioKey]: transcriptionStr
          }));
        }
      });
    });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleTranscribe = async (partIndex: number, questionIndex: number) => {
    const audioKey = `recording_part${partIndex + 1}_q${questionIndex + 1}`;
    const base64Audio = localStorage.getItem(audioKey);
    
    if (!base64Audio) {
      console.error('No recording found for this question');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, [audioKey]: true }));
      
      // Convert base64 to blob
      const base64Data = base64Audio.split(',')[1];
      const binaryData = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
      
      const audioBlob = new Blob([uint8Array], { type: 'audio/webm' });

      // Create FormData
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      // Send to OpenAI Whisper API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Transcription response:', data);
      
      if (data.error) {
        throw new Error(`Transcription failed: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
      }

      // Save transcription to localStorage and state
      localStorage.setItem(`${audioKey}_transcription`, data.text);
      setTranscriptions(prev => ({
        ...prev,
        [audioKey]: data.text
      }));

    } catch (error) {
      console.error('Transcription error:', error);
      alert(`Failed to transcribe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(prev => ({ ...prev, [audioKey]: false }));
    }
  };

  const handleProcessResponses = async () => {
    setIsProcessing(true);
    try {
      const responsesData = testParts.map((part, partIndex) => {
        return part.questions.map((question, questionIndex) => {
          const audioKey = `recording_part${partIndex + 1}_q${questionIndex + 1}`;
          const transcription = localStorage.getItem(`${audioKey}_transcription`);
          return {
            partIndex: partIndex + 1,
            questionIndex: questionIndex + 1,
            question: question.text,
            transcription: transcription || null
          };
        });
      }).flat();

      const response = await fetch('/api/analyze-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses: responsesData }),
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Save results to localStorage
      localStorage.setItem('speaking_test_results', JSON.stringify(result));
      
      // Redirect to results page
      router.push('/dashboard/results');

    } catch (error) {
      console.error('Error processing responses:', error);
      alert('Failed to process responses. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!testSession) {
    return <div>No test session found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Test Review</h1>
          <div className="flex gap-4">
            {hasProcessedResults && (
              <button
                onClick={() => router.push('/dashboard/results')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                View Results
              </button>
            )}
            <button
              onClick={handleProcessResponses}
              disabled={isProcessing}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : hasProcessedResults ? 'Reprocess Responses' : 'Process Responses'}
            </button>
          </div>
        </div>
        
        {testParts.map((part, partIndex) => (
          <div key={partIndex} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{part.title}</h2>
            
            {part.questions.map((question, questionIndex) => {
              const audioKey = `recording_part${partIndex + 1}_q${questionIndex + 1}`;
              const hasRecording = recordings[audioKey];
              const recordingMetadata = metadata[audioKey];
              const hasTranscription = !!transcriptions[audioKey];

              return (
                <div key={questionIndex} className="bg-white rounded-lg shadow p-6 mb-4">
                  <p className="text-gray-700 mb-4">{question.text}</p>
                  
                  {hasRecording ? (
                    <div className="space-y-4">
                      {recordingMetadata && (
                        <p className="text-sm text-gray-500">
                          Recorded on: {formatDate(recordingMetadata.timestamp)}
                        </p>
                      )}
                      
                      {!hasTranscription && (
                        <button
                          onClick={() => handleTranscribe(partIndex, questionIndex)}
                          disabled={loading[audioKey]}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {loading[audioKey] ? 'Transcribing...' : 'Transcribe Response'}
                        </button>
                      )}
                      
                      {transcriptions[audioKey] && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Transcription:</h4>
                          <p className="text-gray-600 bg-gray-50 p-4 rounded">
                            {transcriptions[audioKey]}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No recording found</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
