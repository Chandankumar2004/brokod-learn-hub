import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { VideoControls } from "./controls/VideoControls";
import { RecordingControls } from "./controls/RecordingControls";
import { VideoPreview } from "./preview/VideoPreview";
import { TranscriptionSection } from "./transcription/TranscriptionSection";
import { setupHeadTracking } from "@/utils/headTracking";

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
  const [analysis, setAnalysis] = useState<{
    feedback: string;
    grammarSuggestions: string;
    nextQuestion: string;
  } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(true);

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

  useEffect(() => {
    if (streamActive && videoRef.current) {
      const cleanup = setupHeadTracking(videoRef.current, (warning) => {
        toast.warning(warning);
      });
      return cleanup;
    }
  }, [streamActive]);

  const stopAllTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
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

  const analyzeTranscribedText = (text: string) => {
    if (!text.trim()) return;

    const wordCount = text.split(/\s+/).length;
    
    let feedback = "";
    let grammar = "";
    let nextQuestion = "";

    if (wordCount < 20) {
      feedback = "Consider providing more details in your answer.";
    } else if (wordCount > 100) {
      feedback = "Good detailed response! You've covered the topic well.";
    }

    if (text.toLowerCase().includes("um") || text.toLowerCase().includes("uh")) {
      grammar = "Try to reduce filler words like 'um' and 'uh' in your responses.";
    }

    if (text.toLowerCase().includes("experience")) {
      nextQuestion = "Can you elaborate on the specific skills you gained from that experience?";
    } else {
      nextQuestion = "Could you provide a specific example to support your answer?";
    }

    setAnalysis({
      feedback,
      grammarSuggestions: grammar,
      nextQuestion
    });
  };

  const simulateTranscription = () => {
    setIsTranscribing(true);
    
    setTimeout(() => {
      const userSpeech = ""; // This will be replaced with actual transcribed speech
      setTranscribedText(userSpeech);
      analyzeTranscribedText(userSpeech);
      setIsTranscribing(false);
      toast.success("Speech transcribed successfully");
    }, 2000);
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <VideoPreview
        streamActive={streamActive}
        onCameraStart={startCamera}
        cameraError={cameraError}
        videoRef={videoRef}
      />
      
      <div className="flex justify-center gap-4 p-4">
        <VideoControls
          cameraEnabled={cameraEnabled}
          micEnabled={micEnabled}
          onCameraToggle={toggleCamera}
          onMicToggle={toggleMic}
        />
        
        <RecordingControls
          isRecording={isRecording}
          isPaused={isPaused}
          recordingTime={recordingTime}
          streamActive={streamActive}
          onRecordingToggle={toggleRecording}
          onPauseToggle={togglePause}
        />
      </div>

      <TranscriptionSection
        isTranscribing={isTranscribing}
        transcribedText={transcribedText}
        onTranscribedTextChange={setTranscribedText}
        onTranscriptSubmit={onTranscriptSubmit}
        analysis={analysis || undefined}
        showAnalysis={showAnalysis}
        onToggleAnalysis={() => setShowAnalysis(!showAnalysis)}
      />
    </div>
  );
};
