"use client";

import { getStoredRegistrationData, getCurrentTestSession, storeTestSession, clearTestSession } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

import { Mic, MicOff, ArrowRight, Clock, CirclePlay } from 'lucide-react';
import { useTestStore } from '@/store/testStore';
import { testParts } from '@/data/testData';
import { Timer } from '@/components/Timer';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { TestSession } from '@/types';

type Props = {}

function page({}: Props) {

  const registrationData = getStoredRegistrationData();
  const isDemo = false;
  const router = useRouter();

  if (!registrationData) {
    console.log("user not found");

    // redirect to home
    router.push('/get-started');

  }

  const currentTestSession = getCurrentTestSession();
  

  const { session, setRecording, nextQuestion, updateTimeRemaining, updatePreparation, startTest, loadSession } = useTestStore();
  
  const currentPart = testParts[session.currentPart];
  const currentQuestion = currentPart?.questions[session.currentQuestion];
  const isPreparationPhase = session.isPreparation;
  const [testId, setTestId] = useState<string | null>(null);

  const { startRecording, stopRecording, audioUrl } = useAudioRecorder();

  useEffect(()=>{
    console.log("current part ", session.currentPart);
    console.log("current question", session.currentQuestion);

    if (currentTestSession) {
      console.log("test session found");
      console.log(currentTestSession);
      setTestId(currentTestSession.id);

      // load the test session
      loadSession(currentTestSession as TestSession);
      console.log("loaded test session");
      
    }
    else {
      // generate a new test id
      console.log("generating new test id");
  
      const timestamp = new Date().getTime();
      const testId = `${registrationData.email}_${timestamp}`;
      setTestId(testId);
    }

  }, []);


  const handleRecordToggle = async () => {
    updatePreparation(false);
    if (!session.isRecording) {
      await startRecording();
      setRecording(true);
    } else {
      const audioBlob = stopRecording();
      setRecording(false);
      
      if (audioBlob) {
        // Save audio blob to local storage
        const audioKey = `recording_part${session.currentPart + 1}_q${session.currentQuestion + 1}`;
        const timestamp = new Date().toISOString();
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          localStorage.setItem(audioKey, base64Audio);
          localStorage.setItem(`${audioKey}_metadata`, JSON.stringify({
            timestamp,
            partIndex: session.currentPart,
            questionIndex: session.currentQuestion
          }));
        };
      }
    }
  };

  const handleNext = () => {
    if (session.isRecording) {
      handleRecordToggle();
    }

    // add checks here to make sure that user recorded an answer
    // ie. try to fetch current question's recording from blob...


    nextQuestion();
  };

  const handleTimerComplete = () => {
    updatePreparation(false);
    if (isPreparationPhase) {
      setRecording(true);
    } else if (session.isRecording) {
      setRecording(false);
      nextQuestion();
    }
  };

  const handleReset = () => {
    // Clear all stored items from this test session
    if (testId)
    clearTestSession(testId!);
    
    // Reset the test state
    loadSession({
      id: '',
      currentPart: -1,
      currentQuestion: -1,
      isRecording: false,
      isPreparation: false,
      timeRemaining: 0,
      results: [],
    });

    // Force reload the page to ensure clean state
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 text-start">IELTS Speaking Practice</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentPart && currentQuestion ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              {/* Progress indicator */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-gray-900">{currentPart.title}</h2>
                  <p className="text-sm text-gray-500">{currentPart.description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Question {session.currentQuestion + 1} of {currentPart.questions.length}
                </div>
              </div>

              {/* Question section */}
              <div className="border-t border-b border-gray-200 py-4">
                {isPreparationPhase ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-amber-600">
                      <Clock className="w-5 h-5" />
                      <h3 className="text-lg font-medium">Preparation Time</h3>
                    </div>
                    <p className="text-gray-600">Prepare your answer for:</p>
                  </div>
                ) : (
                  <h3 className="text-lg font-medium text-gray-900">Question</h3>
                )}
                <p className="mt-2 whitespace-pre-line">{currentQuestion.text}</p>
              </div>

              {/* Timer section */}
              {isPreparationPhase &&
              <Timer
                duration={ isDemo ? 5 : currentQuestion.preparationTime!}
                onComplete={handleRecordToggle}
              />
              }

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRecordToggle}
                  disabled={isPreparationPhase && session.timeRemaining > 0}
                  className={`inline-flex items-center px-4 py-2 rounded-md ${
                    isPreparationPhase
                      ? 'bg-gray-300 cursor-not-allowed'
                      : session.isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {session.isRecording ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </button>
                {!isPreparationPhase && (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Next Question
                  </button>
                )}
              </div>
            </div>
          </div>
        ) :
        (session.currentPart == -1 || session.currentQuestion == -1) ?

        <>
          <p className="text-xl font-semibold mb-4">Welcome to the IELTS Speaking Test</p>
          <p className="text-gray-600 mb-6">You are about to begin a simulated IELTS speaking test. The test consists of three parts and will take approximately 11-14 minutes. Make sure your microphone is working properly before starting.</p>
          <button
            className={`inline-flex items-center px-4 py-2 rounded-md ${
                'bg-blue-600 text-white hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            onClick={()=>{
              startTest(testId!);

              // initialize the session object in local storage
              storeTestSession({
                id: testId!,
                currentPart: 0,
                currentQuestion: 0,
                isRecording: false,
                isPreparation: true,
                timeRemaining: 30,
                results: [],
              });

            }}
          >
              
            <>
              <CirclePlay className="w-5 h-5 mr-2" />
              Start Test
            </>
          </button>
        </>

        :

        (
          <div className="text-center">
            <h2 className="text-xl font-semibold">Test Complete</h2>
            <p className="mt-2">Your responses have been recorded.</p>
            <button
              onClick={handleReset}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-red-400 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Test
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default page