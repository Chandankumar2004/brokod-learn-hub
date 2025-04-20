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

  const processTranscription = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      
      // Create an audio URL for storing the recording
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast.error('Speech recognition is not supported in this browser');
        setIsTranscribing(false);
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
          
        const currentQuestion = interviewQuestions[0];
        const transcription = `Interviewer: ${currentQuestion}\nCandidate: ${transcript}`;
        
        // Store transcription and complete
        onTranscriptionComplete(transcription);
        setIsTranscribing(false);
        
        // Clean up audio URL
        URL.revokeObjectURL(audioUrl);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Error transcribing speech');
        setIsTranscribing(false);
        URL.revokeObjectURL(audioUrl);
      };

      recognition.onend = () => {
        if (!recognition.onresult) {
          toast.error('No speech was detected');
          setIsTranscribing(false);
          URL.revokeObjectURL(audioUrl);
        }
      };

      // Create an audio element to play the recording for transcription
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => {
        recognition.stop();
      });

      // Start recognition and play the audio
      recognition.start();
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Error processing audio');
        setIsTranscribing(false);
        URL.revokeObjectURL(audioUrl);
      });

    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe audio');
      setIsTranscribing(false);
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
