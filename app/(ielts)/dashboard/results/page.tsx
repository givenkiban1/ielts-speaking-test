'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Score {
  fluency_coherence: number;
  lexical_resource: number;
  grammatical_range: number;
  pronunciation: number;
}

interface ResponseFeedback {
  strengths: string[];
  areas_for_improvement: string[];
  specific_examples: string[];
  tips: string[];
}

interface ResponseAnalysis {
  part: number;
  question: number;
  scores: Score;
  feedback: ResponseFeedback;
}

interface TestResults {
  overall_score: number;
  overall_feedback: string;
  responses: ResponseAnalysis[];
  improvement_areas: {
    fluency_coherence: string[];
    lexical_resource: string[];
    grammatical_range: string[];
    pronunciation: string[];
  };
}

export default function ResultsPage() {
  const [results, setResults] = useState<TestResults | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedResults = localStorage.getItem('speaking_test_results');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-8">No Results Found</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const ScoreCard = ({ category, score }: { category: string; score: number }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{category}</h3>
      <div className="flex items-center">
        <div className="text-3xl font-bold text-blue-600">{score.toFixed(1)}</div>
        <div className="ml-2 text-sm text-gray-500">/9</div>
      </div>
    </div>
  );

  const FeedbackSection = ({ title, items }: { title: string; items: string[] }) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="flex-shrink-0 w-4 h-4 mt-1 mr-2">
              {title.toLowerCase().includes('strength') ? '✓' : '•'}
            </span>
            <span className="text-gray-600">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Speaking Test Results</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Overall Score</h2>
            <div className="text-4xl font-bold text-blue-600">
              {results.overall_score?.toFixed(1)}
              <span className="text-lg text-gray-500 ml-1">/9</span>
            </div>
          </div>
          <p className="text-gray-600">{results.overall_feedback}</p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <ScoreCard category="Fluency & Coherence" score={results.responses[0].scores.fluency_coherence} />
          <ScoreCard category="Lexical Resource" score={results.responses[0].scores.lexical_resource} />
          <ScoreCard category="Grammatical Range" score={results.responses[0].scores.grammatical_range} />
          <ScoreCard category="Pronunciation" score={results.responses[0].scores.pronunciation} />
        </div>

        {/* Detailed Analysis */}
        <div className="space-y-8">
          {results.responses.map((response, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Part {response.part}, Question {response.question}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FeedbackSection title="Strengths" items={response.feedback.strengths} />
                <FeedbackSection title="Areas for Improvement" items={response.feedback.areas_for_improvement} />
                <FeedbackSection title="Examples from Your Response" items={response.feedback.specific_examples} />
                <FeedbackSection title="Improvement Tips" items={response.feedback.tips} />
              </div>
            </div>
          ))}
        </div>

        {/* Overall Improvement Areas */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-6">Key Areas for Improvement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeedbackSection title="Fluency & Coherence" items={results.improvement_areas.fluency_coherence} />
            <FeedbackSection title="Lexical Resource" items={results.improvement_areas.lexical_resource} />
            <FeedbackSection title="Grammatical Range" items={results.improvement_areas.grammatical_range} />
            <FeedbackSection title="Pronunciation" items={results.improvement_areas.pronunciation} />
          </div>
        </div>
      </div>
    </div>
  );
} 