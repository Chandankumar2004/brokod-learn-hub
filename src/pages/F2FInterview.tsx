
import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CameraOff, Mic, MicOff, X, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const F2FInterview = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Clean up media stream on component unmount
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleCamera = async () => {
    try {
      if (cameraEnabled) {
        // Turn off camera
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getVideoTracks().forEach(track => track.stop());
        }
        setCameraEnabled(false);
        if (!micEnabled) {
          setStreamActive(false);
        }
        toast.info("Camera turned off");
      } else {
        // Turn on camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: micEnabled 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        mediaStreamRef.current = stream;
        setCameraEnabled(true);
        setStreamActive(true);
        toast.success("Camera access granted");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please ensure camera permissions are enabled.");
    }
  };

  const toggleMic = async () => {
    try {
      if (micEnabled) {
        // Turn off mic
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getAudioTracks().forEach(track => track.stop());
        }
        setMicEnabled(false);
        if (!cameraEnabled) {
          setStreamActive(false);
        }
        toast.info("Microphone turned off");
      } else {
        // Turn on mic
        let stream;
        
        if (mediaStreamRef.current && cameraEnabled) {
          // If camera is already on, add audio track
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTrack = stream.getAudioTracks()[0];
          mediaStreamRef.current.addTrack(audioTrack);
        } else {
          // Start new stream with just audio
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

  const startInterview = () => {
    if (!streamActive) {
      toast.error("Please enable camera or microphone before starting the interview");
      return;
    }
    
    setInterviewStarted(true);
    toast.success("F2F Interview session started");
  };

  const endInterview = () => {
    // Stop all tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Reset state
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container py-8 flex-1 flex flex-col">
        <Card className="w-full max-w-5xl mx-auto flex-1 overflow-hidden shadow-xl hover-3d bg-white dark:bg-gray-800">
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
              <div className="md:w-3/4 p-4 flex flex-col">
                <div className="relative flex-1 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
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
                    </div>
                  ) : (
                    <video 
                      ref={videoRef} 
                      autoPlay 
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
                      disabled={!streamActive}
                    >
                      Start Interview
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive" 
                      className="h-12 px-6"
                      onClick={endInterview}
                    >
                      End Interview
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/4 border-l md:h-full overflow-auto">
                <div className="p-4 border-b">
                  <h3 className="font-medium text-lg mb-2">Interview Notes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Prepare for your technical interview with these tips:
                  </p>
                  <ul className="text-sm mt-2 space-y-1 list-disc pl-4">
                    <li>Speak clearly and maintain good posture</li>
                    <li>Explain your thought process when solving problems</li>
                    <li>Ask clarifying questions when needed</li>
                    <li>Be prepared to discuss your previous projects</li>
                    <li>Have questions ready for the interviewer</li>
                  </ul>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-4">Chat</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 h-[200px] mb-4 overflow-y-auto">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Chat will appear here once the interview begins
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 rounded-md border bg-background"
                      placeholder="Type a message..."
                      disabled={!interviewStarted}
                    />
                    <Button size="icon" disabled={!interviewStarted}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default F2FInterview;
