import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Volume2, MessageSquare, Languages } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { supportedLanguages } from "@/utils/translation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TranscriptionSectionProps {
  isTranscribing: boolean;
  transcribedText: string;
  onTranscribedTextChange: (text: string) => void;
  onTranscriptSubmit: () => void;
  analysis?: {
    feedback: string;
    grammarSuggestions: string;
    nextQuestion: string;
    contentAnalysis: {
      clarity: number;
      relevance: number;
      depth: number;
      emotionalCues: string[];
    };
    fillerWordsCount?: number;
    translatedText?: string | null;
  };
  showAnalysis: boolean;
  onToggleAnalysis: () => void;
  isTranslating?: boolean;
  translatedText?: string | null;
  onLanguageChange?: (language: string) => void;
  selectedLanguage?: string;
  fillerWordCount?: number;
}

export const TranscriptionSection = ({
  isTranscribing,
  transcribedText,
  onTranscribedTextChange,
  onTranscriptSubmit,
  analysis,
  showAnalysis,
  onToggleAnalysis,
  isTranslating = false,
  translatedText = null,
  onLanguageChange,
  selectedLanguage = "english",
  fillerWordCount = 0
}: TranscriptionSectionProps) => {
  const [showTranslation, setShowTranslation] = useState(false);

  const handleSubmit = () => {
    if (!transcribedText.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }
    onTranscriptSubmit();
  };

  const renderAnalysisScore = (score: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${score * 100}%` }}
          />
        </div>
        <span className="text-sm">{Math.round(score * 100)}%</span>
      </div>
    );
  };

  const [interviewerText, candidateText] = parseTranscription(transcribedText);

  const handleCandidateTextChange = (newCandidateText: string) => {
    const updatedText = `Interviewer: ${interviewerText}\nCandidate: ${newCandidateText}`;
    onTranscribedTextChange(updatedText);
  };

  const handleLanguageChange = (value: string) => {
    if (onLanguageChange) {
      onLanguageChange(value);
    }
  };

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Interview Transcript</h3>
        <div className="flex items-center gap-2">
          {onLanguageChange && (
            <Select 
              value={selectedLanguage} 
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.toLowerCase()} value={lang.toLowerCase()}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {analysis && (
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
          )}
        </div>
      </div>

      {isTranscribing ? (
        <div className="flex items-center justify-center p-6">
          <div className="inline-block w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mr-3"></div>
          <p>Transcribing interview...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
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
                        onClick={() => setShowTranslation(!showTranslation)}
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
                  onChange={(e) => handleCandidateTextChange(e.target.value)}
                />
                
                {fillerWordCount > 0 && (
                  <div className="mt-1 text-xs text-orange-600 dark:text-orange-400 flex items-center">
                    <Volume2 className="h-3 w-3 mr-1" />
                    You used filler words {fillerWordCount} times in your answer.
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full mt-2"
              disabled={isTranscribing || !transcribedText.trim()}
            >
              Submit Answer for Analysis
            </Button>
          </div>
          
          {analysis && showAnalysis && (
            <div className="space-y-4 mt-6 border-t pt-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Response Analysis:</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Clarity</label>
                    {renderAnalysisScore(analysis.contentAnalysis.clarity)}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Relevance</label>
                    {renderAnalysisScore(analysis.contentAnalysis.relevance)}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Depth</label>
                    {renderAnalysisScore(analysis.contentAnalysis.depth)}
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2">Emotional Cues:</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.contentAnalysis.emotionalCues.map((cue, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-sm">
                        {cue}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Feedback:</h4>
                <p className="text-gray-700 dark:text-gray-300">{analysis.feedback}</p>
                
                {analysis.fillerWordsCount && analysis.fillerWordsCount > 0 && (
                  <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <p className="text-orange-700 dark:text-orange-300">
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      Tip: You used filler words like "um" and "uh" {analysis.fillerWordsCount} times. Try to pause instead.
                    </p>
                  </div>
                )}
              </div>
              
              {analysis.grammarSuggestions && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Language Improvements:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{analysis.grammarSuggestions}</p>
                </div>
              )}
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Follow-up Question:</h4>
                <p className="text-gray-700 dark:text-gray-300">{analysis.nextQuestion}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const parseTranscription = (text: string): [string, string] => {
  const parts = text.split('\n');
  let interviewerText = "";
  let candidateText = "";
  
  parts.forEach(part => {
    if (part.startsWith("Interviewer:")) {
      interviewerText = part.replace("Interviewer:", "").trim();
    } else if (part.startsWith("Candidate:")) {
      candidateText = part.replace("Candidate:", "").trim();
    }
  });
  
  return [interviewerText, candidateText];
};
