
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { interviewQuestions } from '@/constants/interviewQuestions';

interface UseRecordingProps {
  streamActive: boolean;
  mediaStreamRef: React.RefObject<MediaStream>;
  onTranscriptionComplete: (text: string) => void;
}

export const useRecording = ({ 
  streamActive, 
  mediaStreamRef, 
  onTranscriptionComplete 
}: UseRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

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

  const simulateTranscription = () => {
    setIsTranscribing(true);
    
    setTimeout(() => {
      const currentQuestion = interviewQuestions[Math.floor(Math.random() * 3)];
      const sampleResponses = [
        "I have been working as a software developer for the past three years, primarily focusing on web development. I've gained extensive experience with React and Node.js, and I've led several successful projects.",
        "In my current role, I collaborated with a team of five developers to build a scalable e-commerce platform. We faced some initial challenges with performance, but I implemented code splitting and lazy loading to improve load times.",
        "My approach to problem-solving involves breaking down complex issues into smaller, manageable tasks. For example, in my last project, we needed to optimize database queries that were causing slow response times."
      ];
      
      const simulatedText = `Interviewer: ${currentQuestion}\nCandidate: ${sampleResponses[Math.floor(Math.random() * sampleResponses.length)]}`;
      
      onTranscriptionComplete(simulatedText);
      setIsTranscribing(false);
      toast.success("Speech transcribed successfully");
    }, 2000);
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
          recordedChunksRef.current = [];
          setRecordingTime(0);
          stopTimer();
          simulateTranscription();
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

  return {
    isRecording,
    isPaused,
    recordingTime,
    isTranscribing,
    toggleRecording,
    togglePause,
    stopTimer
  };
};
