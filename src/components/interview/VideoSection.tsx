
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { setupHeadTracking } from "@/utils/headTracking";
import { VideoControls } from "./controls/VideoControls";
import { RecordingControls } from "./controls/RecordingControls";
import { VideoPreview } from "./preview/VideoPreview";
import { TranscriptionSection } from "./transcription/TranscriptionSection";
import { useMediaStream } from "./media/useMediaStream";
import { useRecording } from "./media/useRecording";
import { analyzeResponse, InterviewAnalysis } from "@/utils/interviewAnalysis";
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
  const {
    cameraEnabled,
    micEnabled,
    streamActive,
    cameraError,
    videoRef,
    mediaStreamRef,
    toggleCamera,
    toggleMic,
    startCamera,
    stopAllTracks
  } = useMediaStream();

  const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const handleAnalysisComplete = (newAnalysis: InterviewAnalysis) => {
    setAnalysis(newAnalysis);
  };

  const {
    isRecording,
    isPaused,
    recordingTime,
    isTranscribing,
    isTranslating,
    translatedText,
    fillerWordCount,
    toggleRecording,
    togglePause,
    stopTimer,
    setTranslationLanguage
  } = useRecording({
    streamActive,
    mediaStreamRef,
    onTranscriptionComplete: setTranscribedText,
    onAnalysisComplete: handleAnalysisComplete
  });

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

  const handleTranscribedTextChange = (text: string) => {
    setTranscribedText(text);
    const [, candidateText] = text.split('Candidate:');
    if (candidateText && candidateText.trim()) {
      const currentQuestion = interviewQuestions[0]; // Current question
      const analysisResult: InterviewAnalysis = analyzeResponse(
        candidateText.trim(), 
        currentQuestion
      );
      setAnalysis(analysisResult);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setTranslationLanguage(language);
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
        onTranscribedTextChange={handleTranscribedTextChange}
        onTranscriptSubmit={onTranscriptSubmit}
        analysis={analysis}
        showAnalysis={showAnalysis}
        onToggleAnalysis={() => setShowAnalysis(!showAnalysis)}
        isTranslating={isTranslating}
        translatedText={translatedText}
        onLanguageChange={handleLanguageChange}
        selectedLanguage={selectedLanguage}
        fillerWordCount={fillerWordCount}
      />
    </div>
  );
};
