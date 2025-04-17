
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

// This structure could be used in the future for adaptive questioning
export const adaptiveQuestions = {
  "Tell me about yourself?": {
    followUps: [
      "Could you expand more on your experience with [technology mentioned]?",
      "What motivated your transition from [previous role] to [current interest]?",
      "How does your background prepare you for this specific role?"
    ]
  },
  "What are your strengths and weaknesses?": {
    followUps: [
      "Can you provide a specific example where you demonstrated [strength mentioned]?",
      "How are you working to improve on [weakness mentioned]?",
      "How do you think your [strength mentioned] would benefit our team?"
    ]
  }
};
