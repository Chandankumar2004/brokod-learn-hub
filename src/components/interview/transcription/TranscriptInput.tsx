
import { Languages, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptInputProps {
  interviewerText: string;
  candidateText: string;
  onCandidateTextChange: (text: string) => void;
  translatedText: string | null;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  isTranslating: boolean;
  fillerWordCount: number;
}

export const TranscriptInput = ({
  interviewerText,
  candidateText,
  onCandidateTextChange,
  translatedText,
  showTranslation,
  onToggleTranslation,
  isTranslating,
  fillerWordCount,
}: TranscriptInputProps) => {
  return (
    <div className="space-y-4 mb-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2">Interviewer:</p>
        <p className="text-gray-700 dark:text-gray-300">{interviewerText}</p>
      </div>
      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-sm text-green-700 dark:text-green-300">Candidate:</p>
          <div className="flex gap-2">
            {translatedText && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                onClick={onToggleTranslation}
              >
                <Languages className="h-4 w-4 mr-1" />
                {showTranslation ? "Show Original" : "Show Translation"}
              </Button>
            )}
          </div>
        </div>
        
        {showTranslation && translatedText ? (
          <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
            <p className="text-gray-700 dark:text-gray-300">{translatedText}</p>
            {isTranslating && (
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 border-2 border-t-yellow-500 border-r-transparent border-b-yellow-500 border-l-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-xs text-yellow-600 dark:text-yellow-400">Translating...</span>
              </div>
            )}
          </div>
        ) : null}
        
        <Textarea 
          className="w-full min-h-[120px] mb-2 bg-white/50 dark:bg-black/10" 
          placeholder="Your spoken answer will appear here after recording..."
          value={candidateText}
          onChange={(e) => onCandidateTextChange(e.target.value)}
        />
        
        {fillerWordCount > 0 && (
          <div className="mt-1 text-xs text-orange-600 dark:text-orange-400 flex items-center">
            <Volume2 className="h-3 w-3 mr-1" />
            You used filler words {fillerWordCount} times in your answer.
          </div>
        )}
      </div>
    </div>
  );
};
