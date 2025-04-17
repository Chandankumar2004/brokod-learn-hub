
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Minimize, Maximize } from "lucide-react";

interface QuestionsSectionProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  question: string;
  userAnswer: string | null;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  minimized: boolean;
  onToggleMinimize: () => void;
}

export const QuestionsSection = ({
  currentQuestionIndex,
  totalQuestions,
  question,
  userAnswer,
  onNextQuestion,
  onPreviousQuestion,
  minimized,
  onToggleMinimize
}: QuestionsSectionProps) => {
  return (
    <div className="p-4 h-[calc(100vh-12rem)] flex flex-col">
      <div className="border rounded-lg p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="text-blue-600 dark:text-blue-400 font-semibold">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleMinimize} 
            className="p-1 h-auto"
          >
            {minimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
          </Button>
        </div>
        
        <h2 className="text-xl font-bold mb-4">
          {question}
        </h2>
        
        {!minimized && userAnswer && (
          <div className="mt-4 text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Your Answer:</h3>
              <p className="whitespace-pre-wrap">{userAnswer}</p>
            </div>
          </div>
        )}
        
        {!userAnswer && !minimized && (
          <p className="italic text-gray-500">Submit your answer using the form on the left</p>
        )}
      </div>
      
      <div className="flex justify-between mt-auto">
        <Button
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={onNextQuestion}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
