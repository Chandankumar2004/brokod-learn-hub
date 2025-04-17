export const interviewQuestions = [
  "Tell me about yourself?",
  "What are your greatest strengths and how have you applied them in your career?",
  "Describe a challenging situation you faced at work and how you overcame it.",
  "Why do you want to work with our company specifically?",
  "Where do you see yourself professionally in 5 years?",
  "Describe a time when you had to work with a difficult team member. How did you handle it?",
  "What accomplishment are you most proud of and why?",
  "How do you handle stress and pressure in the workplace?",
  "What are you looking for in your next role?",
  "Do you have any questions for us about the position or company?"
];

// Enhanced structure for adaptive questioning
export const adaptiveQuestions = {
  "Tell me about yourself?": {
    followUps: [
      "Could you elaborate more on your experience with [technology mentioned]?",
      "What motivated your transition from [previous role] to [current interest]?",
      "How does your background align with this role?",
    ]
  },
  "What are your greatest strengths and how have you applied them in your career?": {
    followUps: [
      "Can you provide a specific example where you demonstrated [strength mentioned]?",
      "How do you think your [strength mentioned] would benefit our team?",
      "How do you work on improving these strengths?"
    ]
  },
  "Describe a challenging situation you faced at work and how you overcame it.": {
    followUps: [
      "What were the key lessons learned from that experience?",
      "How would you handle a similar situation differently now?",
      "How did this experience change your approach to problem-solving?"
    ]
  }
  // ... Additional adaptive questions can be added here
};
