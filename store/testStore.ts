import { create } from 'zustand';
import type { TestSession, TestResult } from '../types';
import { testParts } from '../data/testData';
import { storeTestSession } from '@/lib/actions';

interface TestStore {
  session: TestSession;
  results: TestResult[];
  startTest: (id: string) => void;
  nextQuestion: () => void;
  setRecording: (isRecording: boolean) => void;
  updatePreparation: (isPreparation: boolean) => void;
  updateTimeRemaining: (time: number) => void;
  loadSession: (session: TestSession) => void;
  addResult: (result: TestResult) => void;
}

export const useTestStore = create<TestStore>((set) => ({
  session: {
    id: '',
    currentPart: -1,
    currentQuestion: -1,
    isRecording: false,
    isPreparation: false,
    timeRemaining: 0,
    results: [],
  },
  results: [],
  startTest: (id) => set((state) => ({
    session: {
      ...state.session,
      id,
      currentPart: 0,
      currentQuestion: 0,
      isRecording: false,
      isPreparation: true,
      timeRemaining: 30,
    },
  })),
  nextQuestion: () => set((state) => {
    const currentPart = state.session.currentPart;
    const currentQuestion = state.session.currentQuestion;
    
    // Get the next question index
    let nextQuestion = currentQuestion + 1;
    let nextPart = currentPart;
    let isPreparation = false;

    // If we've reached the end of questions in the current part
    if (nextQuestion >= testParts[currentPart].questions.length) {
      nextQuestion = 0;
      nextPart = currentPart + 1;
    }

    // Check if the next question is a long-turn question that needs preparation
    if (nextPart < testParts.length && 
        testParts[nextPart].questions[nextQuestion].preparationTime! > 0) {
      isPreparation = true;
    }

    storeTestSession({
      ...state.session,
      currentPart: nextPart,
      currentQuestion: nextQuestion,
      isPreparation,
      isRecording: false,
      timeRemaining: testParts[nextPart]?.questions[nextQuestion]?.preparationTime!,
    })

    return {
      session: {
        ...state.session,
        currentPart: nextPart,
        currentQuestion: nextQuestion,
        isPreparation,
        isRecording: false,
        timeRemaining: testParts[nextPart]?.questions[nextQuestion]?.preparationTime!,
      },
    };
  }),
  setRecording: (isRecording) => set((state) => ({
    session: {
      ...state.session,
      isRecording,
      isPreparation: isRecording ? false : state.session.isPreparation,
    },
  })),
  updateTimeRemaining: (time) => set((state) => ({
    session: {
      ...state.session,
      timeRemaining: time,
    },
  })),
  updatePreparation: (isPreparation) => set((state) => ({
    session: {
      ...state.session,
      isPreparation,
    },
  })),
  loadSession: (session) => set({session})
  // set((state) => { 
  //   const currentPart = state.session.currentPart;
  //   const currentQuestion = state.session.currentQuestion;
  //   let isPreparation = false;
    
  //   // Check if the next question is a long-turn question that needs preparation
  //   if (currentPart < testParts.length && 
  //     testParts[currentPart].questions[currentQuestion].preparationTime! > 0) {
  //     isPreparation = true;
  //   }

    
  //   return {
  //     session: {
  //       ...session,
  //       isRecording: false,
  //       isPreparation,
  //       timeRemaining: testParts[currentPart].questions[currentQuestion].preparationTime!,
  //     }
  //   }

  // })
  ,
  addResult: (result) => set((state) => ({
    results: [...state.results, result],
  })),
}));