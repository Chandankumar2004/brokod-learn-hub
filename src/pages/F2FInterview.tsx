
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoSection } from "@/components/interview/VideoSection";
import { QuestionsSection } from "@/components/interview/QuestionsSection";
import { AIAnalysisSection } from "@/components/interview/AIAnalysisSection";
import { interviewQuestions } from "@/constants/interviewQuestions";

const F2FInterview = () => {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [grammarAnalysis, setGrammarAnalysis] = useState<string | null>(null);

  const startInterview = () => {
    setInterviewStarted(true);
    toast.success("F2F Interview session started");
  };

  const endInterview = () => {
    setInterviewStarted(false);
    toast.info("Interview session ended");
    // Reset states when ending interview
    setUserAnswer("");
    setAiAnalysis(null);
    setTranscribedText("");
    setCurrentQuestionIndex(0);
  };

  const exitInterview = () => {
    endInterview();
    navigate('/');
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer("");
      setAiAnalysis(null);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setUserAnswer("");
      setAiAnalysis(null);
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  const analyzeAnswer = () => {
    if (userAnswer.trim() === "") {
      toast.error("Please provide an answer before submitting");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulating AI analysis (in a real app, this would call an API)
    setTimeout(() => {
      const feedbacks = [
        "Good start! Try to be more specific about your achievements and skills. Use the STAR method (Situation, Task, Action, Result) to structure your responses.",
        "Strong answer! You've demonstrated clear communication and relevant examples. Consider adding more context about how this relates to the position.",
        "Your answer shows enthusiasm, but could benefit from more concrete examples. Try to quantify your achievements when possible.",
        "Well structured response. To improve, consider addressing potential follow-up questions the interviewer might have.",
        "Good points raised! To make your answer stronger, try to align your experience more closely with the job requirements."
      ];
      
      const grammarFeedbacks = [
        "Grammar: A few minor issues with tense consistency. Try using past tense consistently when describing previous experiences.",
        "Grammar: Watch for run-on sentences. Consider breaking longer thoughts into shorter, clearer sentences for better communication.",
        "Grammar: Good overall, but be careful with subject-verb agreement. Remember that collective nouns like 'team' can be tricky.",
        "Grammar: Some preposition errors noted. Review phrases like 'in the project' vs 'on the project' for proper usage.",
        "Grammar: Generally good grammar, but watch for comma usage in complex sentences to improve clarity."
      ];
      
      const randomIndex = Math.floor(Math.random() * feedbacks.length);
      setAiAnalysis(feedbacks[randomIndex]);
      setGrammarAnalysis(grammarFeedbacks[randomIndex]);
      setIsAnalyzing(false);
      
      // Determine if we should suggest moving to the next question
      if (currentQuestionIndex < interviewQuestions.length - 1) {
        toast.info("Analysis complete. Ready for the next question when you are.", {
          action: {
            label: "Next Question",
            onClick: nextQuestion
          }
        });
      } else {
        toast.success("Interview complete! You've answered all questions.");
      }
    }, 1500);
  };

  const handleTranscriptSubmit = () => {
    if (transcribedText.trim() === "") {
      toast.error("Please transcribe your answer before submitting");
      return;
    }
    
    setUserAnswer(transcribedText);
    analyzeAnswer();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container py-8 flex-1 flex flex-col">
        {!interviewStarted ? (
          <Card className="w-full max-w-3xl mx-auto mt-8 shadow-xl hover-3d bg-white dark:bg-gray-800">
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-kodnest-purple to-kodnest-light-blue bg-clip-text text-transparent">
                F2F Interview Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <p className="text-center mb-6">
                Welcome to your F2F interview practice session. This tool will help you prepare for real interviews by simulating a face-to-face interview experience.
              </p>
              <div className="space-y-4 w-full max-w-md">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-medium mb-2">Features:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Record your interview responses with video and audio</li>
                    <li>Get AI-powered feedback on your answers</li>
                    <li>Practice with common interview questions</li>
                    <li>Grammar analysis of your responses</li>
                    <li>Adaptive questions based on your previous answers</li>
                  </ul>
                </div>
                <Button 
                  onClick={startInterview} 
                  className="w-full bg-kodnest-purple hover:bg-kodnest-light-purple py-6 text-lg"
                >
                  Start Interview Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-7xl mx-auto flex-1 overflow-hidden shadow-xl hover-3d bg-white dark:bg-gray-800">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-kodnest-purple to-kodnest-light-blue bg-clip-text text-transparent">
                  F2F Interview Session
                </CardTitle>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={exitInterview}
                >
                  <X className="h-4 w-4" />
                  Exit
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col flex-1">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-[70%] md:h-full overflow-auto">
                  <VideoSection
                    transcribedText={transcribedText}
                    setTranscribedText={setTranscribedText}
                    onTranscriptSubmit={handleTranscriptSubmit}
                  />
                </div>
                
                <div className="md:w-[30%] border-l md:h-full overflow-auto">
                  <Tabs defaultValue="questions" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 rounded-none">
                      <TabsTrigger value="questions">Questions</TabsTrigger>
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="questions">
                      <QuestionsSection
                        currentQuestionIndex={currentQuestionIndex}
                        totalQuestions={interviewQuestions.length}
                        question={interviewQuestions[currentQuestionIndex]}
                        userAnswer={userAnswer}
                        onNextQuestion={nextQuestion}
                        onPreviousQuestion={previousQuestion}
                        minimized={minimized}
                        onToggleMinimize={toggleMinimize}
                      />
                    </TabsContent>
                    
                    <TabsContent value="analysis">
                      <AIAnalysisSection
                        isAnalyzing={isAnalyzing}
                        aiAnalysis={aiAnalysis}
                        grammarAnalysis={grammarAnalysis}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default F2FInterview;
