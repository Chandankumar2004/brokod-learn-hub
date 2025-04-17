
interface AIAnalysisSectionProps {
  isAnalyzing: boolean;
  aiAnalysis: string | null;
  grammarAnalysis: string | null;
}

export const AIAnalysisSection = ({ 
  isAnalyzing, 
  aiAnalysis, 
  grammarAnalysis 
}: AIAnalysisSectionProps) => {
  return (
    <div className="p-4 h-[calc(100vh-12rem)]">
      {isAnalyzing ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
            <p>Analyzing your answer...</p>
          </div>
        </div>
      ) : aiAnalysis ? (
        <div className="border rounded-lg p-6 mb-4 bg-green-50 dark:bg-green-900/20">
          <h2 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">
            AI Feedback
          </h2>
          <div className="prose dark:prose-invert">
            <p className="whitespace-pre-wrap">{aiAnalysis}</p>
            
            {grammarAnalysis && (
              <div className="mt-4 p-3 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded">
                <p className="font-medium text-yellow-800 dark:text-yellow-400">{grammarAnalysis}</p>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Improvement Tips:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use specific examples from your past experience</li>
                <li>Quantify your achievements when possible</li>
                <li>Connect your skills to the job requirements</li>
                <li>Practice with clearer enunciation and pacing</li>
                <li>Maintain confident body language and eye contact</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-center p-8">
          <div>
            <p className="text-lg mb-4">Submit your answer to receive AI analysis and feedback</p>
            <p className="text-sm text-gray-500">The AI will review your response and provide personalized feedback to help improve your interview skills</p>
          </div>
        </div>
      )}
    </div>
  );
};
