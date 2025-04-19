import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { VideoControls } from "./controls/VideoControls";
import { RecordingControls } from "./controls/RecordingControls";
import { VideoPreview } from "./preview/VideoPreview";
import { TranscriptionSection } from "./transcription/TranscriptionSection";
import { setupHeadTracking } from "@/utils/headTracking";
import { interviewQuestions } from "@/constants/interviewQuestions";

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

    const candidateText = text.includes('Candidate:') ? text.split('Candidate:')[1] || '' : text;
    
    const wordCount = candidateText.split(/\s+/).length;
    const containsSpecificExamples = /example|instance|case|situation/i.test(candidateText);
    const containsNumbers = /\d+/.test(candidateText);
    const usesFillerWords = /(um|uh|like|you know|basically|actually)/gi.test(candidateText);
    
    let feedback = "";
    let grammar = "";
    let nextQuestion = "";

    if (containsSpecificExamples && containsNumbers) {
      feedback = "Excellent use of specific examples and quantifiable achievements! Your answer demonstrates strong communication skills.";
    } else if (containsSpecificExamples) {
      feedback = "Good use of specific examples. Consider adding more quantifiable results to strengthen your answer.";
    } else {
      feedback = "Try to include specific examples and numbers to make your answer more impactful.";
    }

    if (usesFillerWords) {
      grammar = "Consider reducing filler words to make your response more concise and professional.";
    }

    if (candidateText.toLowerCase().includes("project") || candidateText.toLowerCase().includes("experience")) {
      nextQuestion = "What specific challenges did you face in this project/experience, and how did you overcome them?";
    } else if (candidateText.toLowerCase().includes("team") || candidateText.toLowerCase().includes("collaboration")) {
      nextQuestion = "Can you elaborate on your role within the team and how you contributed to its success?";
    } else if (wordCount < 50) {
      nextQuestion = "Could you provide more details about a specific situation that demonstrates this?";
    } else {
      nextQuestion = "How would you apply these skills/experiences in our company?";
    }

    setAnalysis({
      feedback,
      grammarSuggestions: grammar,
      nextQuestion
    });
  };

  const simulateTranscription = () => {
    setIsTranscribing(true);
    
    // Simulate a delay for transcription
    setTimeout(() => {
      const currentQuestion = interviewQuestions[Math.floor(Math.random() * 3)];
      const sampleResponses = [
        "I have been working as a software developer for the past three years, primarily focusing on web development. I've gained extensive experience with React and Node.js, and I've led several successful projects.",
        "In my current role, I collaborated with a team of five developers to build a scalable e-commerce platform. We faced some initial challenges with performance, but I implemented code splitting and lazy loading to improve load times.",
        "My approach to problem-solving involves breaking down complex issues into smaller, manageable tasks. For example, in my last project, we needed to optimize database queries that were causing slow response times."
      ];
      
      const simulatedText = `Interviewer: ${currentQuestion}\nCandidate: ${sampleResponses[Math.floor(Math.random() * sampleResponses.length)]}`;
      
      setTranscribedText(simulatedText);
      setIsTranscribing(false);
      
      analyzeTranscribedText(simulatedText);
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
