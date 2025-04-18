
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TranscriptionSectionProps {
  isTranscribing: boolean;
  transcribedText: string;
  onTranscribedTextChange: (text: string) => void;
  onTranscriptSubmit: () => void;
  analysis?: {
    feedback: string;
    grammarSuggestions: string;
    nextQuestion: string;
  };
  showAnalysis: boolean;
  onToggleAnalysis: () => void;
}

export const TranscriptionSection = ({
  isTranscribing,
  transcribedText,
  onTranscribedTextChange,
  onTranscriptSubmit,
  analysis,
  showAnalysis,
  onToggleAnalysis
}: TranscriptionSectionProps) => {
  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
      <h3 className="font-medium text-lg mb-2">Your Answer</h3>
      {isTranscribing ? (
        <div className="flex items-center justify-center p-6">
          <div className="inline-block w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mr-3"></div>
          <p>Transcribing your answer...</p>
        </div>
      ) : (
        <>
          <Textarea 
            className="w-full min-h-[120px]" 
            placeholder="Your answer will appear here after recording, or you can type/paste it manually..."
            value={transcribedText}
            onChange={(e) => onTranscribedTextChange(e.target.value)}
          />
          
          {analysis && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Analysis & Feedback</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleAnalysis}
                  className="p-1 h-8"
                >
                  {showAnalysis ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              {showAnalysis && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-blue-700 dark:text-blue-300">{analysis.feedback}</p>
                  </div>
                  
                  {analysis.grammarSuggestions && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <p className="text-yellow-700 dark:text-yellow-300">
                        Grammar Suggestions:
                      </p>
                      <p>{analysis.grammarSuggestions}</p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-green-700 dark:text-green-300">
                      Next Question:
                    </p>
                    <p>{analysis.nextQuestion}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button
              onClick={onTranscriptSubmit}
              className="gap-2"
              disabled={isTranscribing || !transcribedText.trim()}
            >
              Submit Answer
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
