
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { AnalysisDisplay } from "./AnalysisDisplay";
import { TranscriptInput } from "./TranscriptInput";
import { LanguageSelector } from "./LanguageSelector";
import { TranslationToggle } from "./TranslationToggle";

interface TranscriptionSectionProps {
  isTranscribing: boolean;
  transcribedText: string;
  onTranscribedTextChange: (text: string) => void;
  onTranscriptSubmit: () => void;
  analysis?: {
    feedback: string;
    grammarSuggestions: string;
    nextQuestion: string;
    contentAnalysis: {
      clarity: number;
      relevance: number;
      depth: number;
      emotionalCues: string[];
    };
    fillerWordsCount?: number;
    translatedText?: string | null;
  };
  showAnalysis: boolean;
  onToggleAnalysis: () => void;
  isTranslating?: boolean;
  translatedText?: string | null;
  onLanguageChange?: (language: string) => void;
  selectedLanguage?: string;
  fillerWordCount?: number;
}

export const TranscriptionSection = ({
  isTranscribing,
  transcribedText,
  onTranscribedTextChange,
  onTranscriptSubmit,
  analysis,
  showAnalysis,
  onToggleAnalysis,
  isTranslating = false,
  translatedText = null,
  onLanguageChange,
  selectedLanguage = "english",
  fillerWordCount = 0
}: TranscriptionSectionProps) => {
  const [showTranslation, setShowTranslation] = useState(false);

  const handleSubmit = () => {
    if (!transcribedText.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }
    onTranscriptSubmit();
  };

  const [interviewerText, candidateText] = parseTranscription(transcribedText);

  const handleCandidateTextChange = (newCandidateText: string) => {
    const updatedText = `Interviewer: ${interviewerText}\nCandidate: ${newCandidateText}`;
    onTranscribedTextChange(updatedText);
  };

  const handleLanguageChange = (value: string) => {
    if (onLanguageChange) {
      onLanguageChange(value);
    }
  };

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
      <TranscriptionHeader
        onLanguageChange={onLanguageChange}
        selectedLanguage={selectedLanguage}
        analysis={analysis}
        showAnalysis={showAnalysis}
        onToggleAnalysis={onToggleAnalysis}
        handleLanguageChange={handleLanguageChange}
      />

      {isTranscribing ? (
        <TranscriptionLoading />
      ) : (
        <>
          <TranscriptInput
            interviewerText={interviewerText}
            candidateText={candidateText}
            onCandidateTextChange={handleCandidateTextChange}
            translatedText={translatedText}
            showTranslation={showTranslation}
            onToggleTranslation={() => setShowTranslation((show) => !show)}
            isTranslating={isTranslating}
            fillerWordCount={fillerWordCount}
          />

          {/* Translation toggle control drawer */}
          <div className="flex justify-end">
            <TranslationToggle
              showTranslation={showTranslation}
              onToggleTranslation={() => setShowTranslation((show) => !show)}
              translatedText={translatedText}
              isTranslating={isTranslating}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full mt-2"
            disabled={isTranscribing || !transcribedText.trim()}
          >
            Submit Answer for Analysis
          </Button>
        </>
      )}
    </div>
  );
};

// Header extracted to a separate component for clarity.
interface TranscriptionHeaderProps {
  onLanguageChange?: (lang: string) => void;
  selectedLanguage: string;
  analysis?: any;
  showAnalysis: boolean;
  onToggleAnalysis: () => void;
  handleLanguageChange: (value: string) => void;
}
const TranscriptionHeader = ({
  onLanguageChange,
  selectedLanguage,
  analysis,
  showAnalysis,
  onToggleAnalysis,
  handleLanguageChange
}: TranscriptionHeaderProps) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-medium text-lg">Interview Transcript</h3>
    <div className="flex items-center gap-2">
      {onLanguageChange && (
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      )}
      {analysis && (
        <AnalysisDisplay
          analysis={analysis}
          showAnalysis={showAnalysis}
          onToggleAnalysis={onToggleAnalysis}
        />
      )}
    </div>
  </div>
);

// Loader for transcription process.
const TranscriptionLoading = () => (
  <div className="flex items-center justify-center p-6">
    <div className="inline-block w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mr-3"></div>
    <p>Transcribing interview...</p>
  </div>
);

const parseTranscription = (text: string): [string, string] => {
  const parts = text.split('\n');
  let interviewerText = "";
  let candidateText = "";

  parts.forEach(part => {
    if (part.startsWith("Interviewer:")) {
      interviewerText = part.replace("Interviewer:", "").trim();
    } else if (part.startsWith("Candidate:")) {
      candidateText = part.replace("Candidate:", "").trim();
    }
  });

  return [interviewerText, candidateText];
};
