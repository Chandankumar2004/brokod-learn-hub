
export interface ContentAnalysis {
  clarity: number;
  relevance: number;
  depth: number;
  emotionalCues: string[];
}

export interface InterviewAnalysis {
  feedback: string;
  grammarSuggestions: string;
  nextQuestion: string;
  contentAnalysis: ContentAnalysis;
}

export const analyzeResponse = (candidateText: string): InterviewAnalysis => {
  const wordCount = candidateText.split(/\s+/).length;
  const containsSpecificExamples = /example|instance|case|situation/i.test(candidateText);
  const containsNumbers = /\d+/.test(candidateText);
  const usesFillerWords = /(um|uh|like|you know|basically|actually)/gi.test(candidateText);

  const emotionalCues = detectEmotionalCues(candidateText);
  const clarity = containsSpecificExamples ? 0.8 : 0.5;
  const relevance = wordCount > 50 ? 0.7 : 0.4;
  const depth = containsNumbers && containsSpecificExamples ? 0.9 : 0.6;

  const feedback = generateFeedback(containsSpecificExamples, containsNumbers);
  const grammar = usesFillerWords ? 
    "Consider reducing filler words to make your response more concise and professional." : 
    "";
  const nextQuestion = generateNextQuestion(candidateText, wordCount);

  return {
    feedback,
    grammarSuggestions: grammar,
    nextQuestion,
    contentAnalysis: {
      clarity,
      relevance,
      depth,
      emotionalCues
    }
  };
};

const detectEmotionalCues = (text: string): string[] => {
  const emotionalCues = [];
  if (text.includes('challenge') || text.includes('difficult')) {
    emotionalCues.push('Challenged');
  }
  if (text.includes('proud') || text.includes('success')) {
    emotionalCues.push('Confident');
  }
  if (text.includes('learn') || text.includes('growth')) {
    emotionalCues.push('Growth-minded');
  }
  if (text.includes('team') || text.includes('collaborate')) {
    emotionalCues.push('Collaborative');
  }
  if (emotionalCues.length === 0) {
    emotionalCues.push('Neutral');
  }
  return emotionalCues;
};

const generateFeedback = (hasExamples: boolean, hasNumbers: boolean): string => {
  if (hasExamples && hasNumbers) {
    return "Excellent use of specific examples and quantifiable achievements! Your answer demonstrates strong communication skills.";
  } else if (hasExamples) {
    return "Good use of specific examples. Consider adding more quantifiable results to strengthen your answer.";
  }
  return "Try to include specific examples and numbers to make your answer more impactful.";
};

const generateNextQuestion = (text: string, wordCount: number): string => {
  if (text.toLowerCase().includes("project") || text.toLowerCase().includes("experience")) {
    return "What specific challenges did you face in this project/experience, and how did you overcome them?";
  } else if (text.toLowerCase().includes("team") || text.toLowerCase().includes("collaboration")) {
    return "Can you elaborate on your role within the team and how you contributed to its success?";
  } else if (wordCount < 50) {
    return "Could you provide more details about a specific situation that demonstrates this?";
  }
  return "How would you apply these skills/experiences in our company?";
};
