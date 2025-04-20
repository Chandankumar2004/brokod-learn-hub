
export interface ContentAnalysis {
  clarity: number;
  relevance: number;
  depth: number;
  emotionalCues: string[];
}

export interface InterviewAnalysis {
  answer: string;
  feedback: string;
  grammarSuggestions: string;
  nextQuestion: string;
  contentAnalysis: ContentAnalysis;
  fillerWordsCount?: number;
  translatedText?: string | null;
}

export const analyzeResponse = (candidateText: string, currentQuestion: string): InterviewAnalysis => {
  const wordCount = candidateText.split(/\s+/).length;
  const containsSpecificExamples = /example|project|work|experience/i.test(candidateText);
  const containsTechnicalTerms = /react|node\.?js|web development|application/i.test(candidateText);
  const usesFillerWords = /(um|uh|like|you know|basically|actually)/gi.test(candidateText);
  
  // Count filler words for feedback
  const fillerWordsCount = (candidateText.match(/(um|uh|like|you know|basically|actually)/gi) || []).length;

  const emotionalCues = detectEmotionalCues(candidateText);
  const clarity = containsSpecificExamples ? 0.8 : 0.5;
  const relevance = containsTechnicalTerms ? 0.7 : 0.4;
  const depth = wordCount > 50 ? 0.9 : 0.6;

  // Generate personalized feedback
  let feedback = generateFeedback(containsSpecificExamples, containsTechnicalTerms);
  
  // Add confidence feedback
  if (emotionalCues.includes('Confident')) {
    feedback += " You demonstrated confidence in your response.";
  } else if (emotionalCues.includes('Uncertain')) {
    feedback += " Try to sound more confident in your response.";
  }
  
  // Add structure feedback
  if (wordCount < 30) {
    feedback += " Your answer was quite brief. Consider expanding with more details.";
  } else if (wordCount > 150) {
    feedback += " Your answer was comprehensive but could be more concise.";
  }
  
  // Grammar feedback
  let grammar = usesFillerWords ? 
    "Consider reducing filler words to make your response more concise and professional." : 
    "Articulation is clear and professional.";
    
  if (wordCount > 100) {
    grammar += " Watch for run-on sentences. Try to pause more frequently and use clearer sentence structure.";
  }
  
  // Generate adaptive follow-up question
  const nextQuestion = generateNextQuestion(currentQuestion, candidateText);

  return {
    answer: candidateText,
    feedback,
    grammarSuggestions: grammar,
    nextQuestion,
    contentAnalysis: {
      clarity,
      relevance,
      depth,
      emotionalCues
    },
    fillerWordsCount
  };
};

const detectEmotionalCues = (text: string): string[] => {
  const emotionalCues = [];
  if (text.includes('challenge') || text.includes('difficult')) {
    emotionalCues.push('Problem-solving');
  }
  if (text.includes('proud') || text.includes('achievement')) {
    emotionalCues.push('Confident');
  }
  if (text.includes('not sure') || text.includes('maybe')) {
    emotionalCues.push('Uncertain');
  }
  if (text.includes('learn') || text.includes('growth')) {
    emotionalCues.push('Growth-minded');
  }
  if (text.includes('team') || text.includes('collaborate')) {
    emotionalCues.push('Collaborative');
  }
  return emotionalCues.length ? emotionalCues : ['Neutral'];
};

const generateFeedback = (hasExamples: boolean, hasTechnicalTerms: boolean): string => {
  if (hasExamples && hasTechnicalTerms) {
    return "Excellent response! You provided specific technical details and demonstrated practical experience.";
  } else if (hasExamples) {
    return "Good use of examples. Try to include more technical context.";
  } else if (hasTechnicalTerms) {
    return "You demonstrated technical knowledge, but would benefit from providing specific examples from your experience.";
  }
  return "Provide more specific examples and technical details to strengthen your answer.";
};

const generateNextQuestion = (currentQuestion: string, candidateText: string): string => {
  // Look for specific technologies or skills mentioned
  const technicalKeywords = [
    'react', 'node.js', 'web development', 'project', 'application', 
    'python', 'javascript', 'typescript', 'angular', 'vue', 
    'java', 'c#', 'php', 'ruby', 'golang', 'aws', 'azure', 
    'cloud', 'devops', 'ci/cd', 'testing'
  ];
  
  const mentionedTech = technicalKeywords.find(keyword => 
    candidateText.toLowerCase().includes(keyword)
  );

  // Check for experience indicators
  const hasLeadershipExperience = /lead|manager|direct|team|supervise/i.test(candidateText);
  const hasProjectExperience = /project|implement|develop|create|build/i.test(candidateText);
  const hasChallengeExperience = /challenge|difficult|problem|issue|obstacle/i.test(candidateText);

  // Generate contextual follow-up questions
  if (mentionedTech) {
    return `Can you elaborate on a specific challenge you faced while working with ${mentionedTech} and how you overcame it?`;
  } else if (hasLeadershipExperience) {
    return "Tell me about a time when you had to make a difficult decision as a leader. What was the outcome?";
  } else if (hasProjectExperience) {
    return "What methodologies or frameworks do you typically use when managing your projects?";
  } else if (hasChallengeExperience) {
    return "How do you approach troubleshooting and resolving technical issues?";
  }

  // Default follow-up questions
  const defaultFollowUps = [
    "Tell me about a time when you had to learn a new technology quickly for a project.",
    "Can you describe a situation where you had to collaborate with a difficult team member?",
    "What's your approach to staying updated with the latest industry trends?",
    "How do you handle feedback on your work?",
    "What would you say is your greatest professional achievement to date?"
  ];
  
  // Return a random default follow-up
  return defaultFollowUps[Math.floor(Math.random() * defaultFollowUps.length)];
};
