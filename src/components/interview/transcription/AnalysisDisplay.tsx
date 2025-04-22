
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisDisplayProps {
  analysis: {
    contentAnalysis: {
      clarity: number;
      relevance: number;
      depth: number;
      emotionalCues: string[];
    };
    feedback: string;
    grammarSuggestions: string;
    nextQuestion: string;
  };
  showAnalysis: boolean;
  onToggleAnalysis: () => void;
}

export const AnalysisDisplay = ({
  analysis,
  showAnalysis,
  onToggleAnalysis,
}: AnalysisDisplayProps) => {
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

  return (
    <>
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

      {showAnalysis && (
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
        </div>
      )}
    </>
  );
};
