
import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CameraOff, Mic, MicOff, X, Users, MessageSquare, VideoIcon, Pause, Play, ArrowLeft, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Interview questions array
const interviewQuestions = [
  "Tell me about yourself?",
  "What are your strengths and weaknesses?",
  "Why do you want to work with our company?",
  "Where do you see yourself in 5 years?",
  "Tell me about a challenge you faced and how you overcame it"
];

const F2FInterview = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);
  
  // New state for interview Q&A functionality
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    return () => {
      stopTimer();
      stopAllTracks();
    };
  }, []);

  const stopAllTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const toggleCamera = async () => {
    try {
      if (cameraEnabled) {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getVideoTracks().forEach(track => track.stop());
        }
        setCameraEnabled(false);
        if (!micEnabled) {
          setStreamActive(false);
        }
        toast.info("Camera turned off");
      } else {
        await startCamera();
        toast.success("Camera access granted");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Failed to access camera. Please ensure camera permissions are enabled.");
      toast.error("Failed to access camera. Please ensure camera permissions are enabled.");
    }
  };

  const startCamera = async () => {
    try {
      stopAllTracks();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: micEnabled 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
          toast.error("Error starting video playback");
        });
      }
      
      mediaStreamRef.current = stream;
      setCameraEnabled(true);
      setStreamActive(true);
      setCameraError(null);
      return stream;
    } catch (error) {
      console.error("Error in startCamera:", error);
      setCameraError("Camera access denied or not available");
      throw error;
    }
  };

  const toggleMic = async () => {
    try {
      if (micEnabled) {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getAudioTracks().forEach(track => track.stop());
        }
        setMicEnabled(false);
        if (!cameraEnabled) {
          setStreamActive(false);
        }
        toast.info("Microphone turned off");
      } else {
        let stream;
        
        if (mediaStreamRef.current && cameraEnabled) {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTrack = stream.getAudioTracks()[0];
          mediaStreamRef.current.addTrack(audioTrack);
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: cameraEnabled 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          mediaStreamRef.current = stream;
        }
        
        setMicEnabled(true);
        setStreamActive(true);
        toast.success("Microphone access granted");
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Failed to access microphone. Please ensure microphone permissions are enabled.");
    }
  };

  const startInterview = async () => {
    if (!streamActive) {
      try {
        await startCamera();
        setInterviewStarted(true);
        toast.success("F2F Interview session started");
      } catch (error) {
        console.error("Failed to start camera for interview:", error);
        toast.error("Please enable camera or microphone before starting the interview");
      }
    } else {
      setInterviewStarted(true);
      toast.success("F2F Interview session started");
    }
  };

  const endInterview = () => {
    stopAllTracks();
    
    setCameraEnabled(false);
    setMicEnabled(false);
    setStreamActive(false);
    setInterviewStarted(false);
    
    toast.info("Interview session ended");
  };

  const exitInterview = () => {
    endInterview();
    navigate('/');
  };

  const startTimer = () => {
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (!streamActive) {
      toast.error("Please enable camera or microphone before recording");
      return;
    }

    if (!isRecording) {
      if (mediaStreamRef.current) {
        const mediaRecorder = new MediaRecorder(mediaStreamRef.current);
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const recordedBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(recordedBlob);
          
          toast.success("Recording stopped");
          recordedChunksRef.current = [];
          setRecordingTime(0);
          stopTimer();
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        setIsPaused(false);
        startTimer();
        toast.success("Recording started");
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsPaused(false);
        toast.info("Recording ended");
      }
    }
  };

  const togglePause = () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
      toast.success("Recording resumed");
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
      toast.info("Recording paused");
    }
  };

  // New functions for Q&A functionality
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
              {/* Left Section - Video and Controls */}
              <div className="md:w-1/2 p-4 flex flex-col">
                <div className="relative flex-1 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                  {!streamActive ? (
                    <div className="text-center p-6">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                        <Users className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-gray-300 mb-4">Camera and microphone are currently off</p>
                      <Button 
                        className="bg-kodnest-purple hover:bg-kodnest-light-purple"
                        onClick={() => toggleCamera()}
                      >
                        Enable Camera Access
                      </Button>
                      {cameraError && (
                        <p className="mt-2 text-red-400 text-sm">{cameraError}</p>
                      )}
                    </div>
                  ) : (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline
                      muted 
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {interviewStarted && (
                    <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-lg text-white text-sm">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Live Interview
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center gap-4 p-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={`h-12 w-12 rounded-full ${cameraEnabled ? 'bg-white text-gray-800' : 'bg-red-500 text-white hover:bg-red-600'}`}
                    onClick={toggleCamera}
                  >
                    {cameraEnabled ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={`h-12 w-12 rounded-full ${micEnabled ? 'bg-white text-gray-800' : 'bg-red-500 text-white hover:bg-red-600'}`}
                    onClick={toggleMic}
                  >
                    {micEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                  </Button>
                  
                  {!interviewStarted ? (
                    <Button 
                      className="h-12 px-6 bg-green-500 hover:bg-green-600 text-white"
                      onClick={startInterview}
                    >
                      Start Interview
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="destructive" 
                        className="h-12 px-6"
                        onClick={endInterview}
                      >
                        End Interview
                      </Button>
                      
                      <Button 
                        variant={isRecording ? "destructive" : "default"}
                        size="icon" 
                        className={`h-12 w-12 rounded-full relative ${
                          isRecording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                        onClick={toggleRecording}
                      >
                        <VideoIcon className="h-6 w-6" />
                        {isRecording && (
                          <span className="absolute -top-1 -right-1 bg-white text-xs px-2 py-1 rounded-full text-gray-800 font-medium">
                            {formatTime(recordingTime)}
                          </span>
                        )}
                      </Button>

                      {isRecording && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-full"
                          onClick={togglePause}
                        >
                          {isPaused ? (
                            <Play className="h-6 w-6" />
                          ) : (
                            <Pause className="h-6 w-6" />
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
                
                {/* Transcription area */}
                <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                  <h3 className="font-medium text-lg mb-2">Transcribe Your Answer</h3>
                  <Textarea 
                    className="w-full min-h-[120px]" 
                    placeholder="Type or paste your answer here..."
                    value={transcribedText}
                    onChange={(e) => setTranscribedText(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={handleTranscriptSubmit}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right Section - Q&A and Analysis */}
              <div className="md:w-1/2 border-l md:h-full overflow-auto">
                <Tabs defaultValue="questions" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 rounded-none">
                    <TabsTrigger value="questions">Interview Questions</TabsTrigger>
                    <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="questions" className="p-4 h-[calc(100vh-12rem)] flex flex-col">
                    <div className="border rounded-lg p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 flex-1">
                      <div className="mb-2 text-blue-600 dark:text-blue-400 font-semibold">
                        Question {currentQuestionIndex + 1} of {interviewQuestions.length}
                      </div>
                      <h2 className="text-xl font-bold mb-4">
                        {interviewQuestions[currentQuestionIndex]}
                      </h2>
                      
                      <div className="mt-4 text-gray-600 dark:text-gray-300">
                        {userAnswer ? (
                          <div>
                            <h3 className="font-semibold mb-2">Your Answer:</h3>
                            <p className="whitespace-pre-wrap">{userAnswer}</p>
                          </div>
                        ) : (
                          <p className="italic">Submit your answer using the form on the left</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-auto">
                      <Button
                        variant="outline"
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <Button
                        onClick={nextQuestion}
                        disabled={currentQuestionIndex === interviewQuestions.length - 1}
                        className="gap-2"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analysis" className="p-4 h-[calc(100vh-12rem)]">
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
