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
      const currentQuestion = interviewQuestions[0]; // Current question from the interview
      const simulatedTranscription = `Interviewer: ${currentQuestion}\nCandidate: `;
      
      onTranscriptionComplete(simulatedTranscription);
      setIsTranscribing(false);
    }, 1000);
  };

  const transcribeAnswer = (recordedText: string) => {
    const simulatedTranscription = `Interviewer: ${interviewQuestions[0]}\nCandidate: ${recordedText}`;
    onTranscriptionComplete(simulatedTranscription);
  };

  const processTranscription = (audioBlob: Blob) => {
    // Simulating real-time transcription with sample text for demo
    // In a real application, you would send the audio to a speech-to-text service
    const exampleResponses = [
      "I have extensive experience in developing web applications using React and Node.js.",
      "During my previous role, I successfully led a team of five developers.",
      "I believe my problem-solving skills and collaborative approach make me a strong candidate."
    ];
    
    const randomResponse = exampleResponses[Math.floor(Math.random() * exampleResponses.length)];
    const currentQuestion = interviewQuestions[0];
    const transcription = `Interviewer: ${currentQuestion}\nCandidate: ${randomResponse}`;
    
    onTranscriptionComplete(transcription);
    setIsTranscribing(false);
  };

  const toggleRecording = () => {
    if (!streamActive) {
      toast.error("Please enable camera or microphone before recording");
      return;
    }

    if (!isRecording) {
      if (mediaStreamRef.current) {
        const mediaRecorder = new MediaRecorder(mediaStreamRef.current);
        recordedChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const recordedBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          setIsTranscribing(true);
          processTranscription(recordedBlob);
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
        toast.info("Recording ended, transcribing your answer...");
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
