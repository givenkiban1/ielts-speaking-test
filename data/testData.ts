import type { TestPart } from '../types';

export const testParts: TestPart[] = [
  {
    id: 'part1',
    title: 'Part 1: Introduction and Interview',
    duration: 300, // 5 minutes
    description: 'In this part, you will answer general questions about yourself and familiar topics.',
    questions: [
      {
        id: 'q1_1',
        text: 'Could you tell me about your hometown?',
        type: 'basic',
        preparationTime: 30,
      },
      {
        id: 'q1_2',
        text: 'What do you like to do in your free time?',
        type: 'basic',
        preparationTime: 30,
      },
      {
        id: 'q1_3',
        text: 'Do you work or are you a student?',
        type: 'basic',
        preparationTime: 30,
      },
    ],
  },
  {
    id: 'part2',
    title: 'Part 2: Long Turn',
    duration: 120, // 2 minutes
    description: 'Speak about the given topic for 1-2 minutes. You will have 1 minute to prepare.',
    questions: [
      {
        id: 'q2_1',
        text: 'Describe a place you like to visit in your free time. You should say:\n- where it is\n- when you first visited it\n- what you do there\n- and explain why you like visiting this place.',
        type: 'long-turn',
        preparationTime: 60,
      },
    ],
  },
  {
    id: 'part3',
    title: 'Part 3: Discussion',
    duration: 300, // 5 minutes
    description: 'In this part, you will discuss more abstract questions related to the topic from Part 2.',
    questions: [
      {
        id: 'q3_1',
        text: 'Why do you think some places become popular tourist destinations?',
        type: 'follow-up',
        preparationTime: 30,
      },
      {
        id: 'q3_2',
        text: 'How has tourism changed in your country in recent years?',
        type: 'follow-up',
        preparationTime: 60,
      },
      {
        id: 'q3_3',
        text: 'What impact does tourism have on local communities?',
        type: 'follow-up',
        preparationTime: 60,
      },
    ],
  },
];