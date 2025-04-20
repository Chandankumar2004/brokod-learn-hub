
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
}

export const analyzeResponse = (candidateText: string, currentQuestion: string): InterviewAnalysis => {
  const wordCount = candidateText.split(/\s+/).length;
  const containsSpecificExamples = /example|project|work|experience/i.test(candidateText);
  const containsTechnicalTerms = /react|node\.?js|web development|application/i.test(candidateText);
  const usesFillerWords = /(um|uh|like|you know|basically|actually)/gi.test(candidateText);

  const emotionalCues = detectEmotionalCues(candidateText);
  const clarity = containsSpecificExamples ? 0.8 : 0.5;
  const relevance = containsTechnicalTerms ? 0.7 : 0.4;
  const depth = wordCount > 50 ? 0.9 : 0.6;

  const feedback = generateFeedback(containsSpecificExamples, containsTechnicalTerms);
  const grammar = usesFillerWords ? 
    "Consider reducing filler words to make your response more concise and professional." : 
    "Articulation is clear and professional.";
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
    }
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
  }
  return "Provide more specific examples and technical details to strengthen your answer.";
};

const generateNextQuestion = (currentQuestion: string, candidateText: string): string => {
  const technicalKeywords = ['react', 'node.js', 'web development', 'project', 'application'];
  const mentionedTech = technicalKeywords.find(keyword => 
    candidateText.toLowerCase().includes(keyword)
  );

  if (mentionedTech) {
    return `Can you elaborate on a specific challenge you faced while working with ${mentionedTech} and how you overcame it?`;
  }

  return "Tell me about a time when you had to learn a new technology quickly for a project.";
};
