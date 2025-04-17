
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

  const startInterview = () => {
    setInterviewStarted(true);
    toast.success("F2F Interview session started");
  };

  const endInterview = () => {
    setInterviewStarted(false);
    toast.info("Interview session ended");
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
      
      const randomIndex = Math.floor(Math.random() * feedbacks.length);
      setAiAnalysis(feedbacks[randomIndex]);
      setIsAnalyzing(false);
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
              <VideoSection
                transcribedText={transcribedText}
                setTranscribedText={setTranscribedText}
                onTranscriptSubmit={handleTranscriptSubmit}
              />
              
              <div className="md:w-1/2 border-l md:h-full overflow-auto">
                <Tabs defaultValue="questions" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 rounded-none">
                    <TabsTrigger value="questions">Interview Questions</TabsTrigger>
                    <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="questions">
                    <QuestionsSection
                      currentQuestionIndex={currentQuestionIndex}
                      totalQuestions={interviewQuestions.length}
                      question={interviewQuestions[currentQuestionIndex]}
                      userAnswer={userAnswer}
                      onNextQuestion={nextQuestion}
                      onPreviousQuestion={previousQuestion}
                    />
                  </TabsContent>
                  
                  <TabsContent value="analysis">
                    <AIAnalysisSection
                      isAnalyzing={isAnalyzing}
                      aiAnalysis={aiAnalysis}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default F2FInterview;
