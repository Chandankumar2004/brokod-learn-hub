import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Mic, MicOff, VideoIcon, Pause, Play } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface VideoSectionProps {
  transcribedText: string;
  setTranscribedText: (text: string) => void;
  onTranscriptSubmit: () => void;
}

export const VideoSection = ({ 
  transcribedText, 
  setTranscribedText, 
  onTranscriptSubmit 
}: VideoSectionProps) => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

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
          
          simulateTranscription();
          
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

  const simulateTranscription = () => {
    setIsTranscribing(true);
    
    const sampleResponses = [
      "I believe my greatest strength is my ability to adapt quickly to changing environments. In my previous role at XYZ Corp, I had to learn a completely new tech stack within two weeks to meet a critical deadline.",
      "I'm interested in this position because I've been following your company's innovative work in AI and machine learning. The opportunity to contribute to projects that have a real impact on people's lives is exactly what I'm looking for in my next role.",
      "A challenging situation I faced was when our team lost a key member right before a major product launch. I took the initiative to redistribute tasks and worked extra hours to ensure we met our deadline without compromising quality.",
      "In five years, I see myself having grown into a leadership role where I can mentor junior developers while still maintaining hands-on involvement with cutting-edge technologies.",
      "I approach problem-solving by first fully understanding the requirements, breaking down complex issues into manageable parts, and systematically addressing each component while keeping the big picture in mind."
    ];
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * sampleResponses.length);
      setTranscribedText(sampleResponses[randomIndex]);
      setIsTranscribing(false);
      toast.success("Answer transcribed successfully");
    }, 2000);
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="relative flex-1 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center mb-4">
        {!streamActive ? (
          <div className="text-center p-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <VideoIcon className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-300 mb-4">Camera and microphone are currently off</p>
            <Button 
              className="bg-kodnest-purple hover:bg-kodnest-light-purple"
              onClick={toggleCamera}
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
            {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
          </Button>
        )}
      </div>

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
              onChange={(e) => setTranscribedText(e.target.value)}
            />
            <div className="flex justify-end mt-2">
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
    </div>
  );
};
