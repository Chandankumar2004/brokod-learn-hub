
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptionSectionProps {
  isTranscribing: boolean;
  transcribedText: string;
  onTranscribedTextChange: (text: string) => void;
  onTranscriptSubmit: () => void;
}

export const TranscriptionSection = ({
  isTranscribing,
  transcribedText,
  onTranscribedTextChange,
  onTranscriptSubmit
}: TranscriptionSectionProps) => {
  return (
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
            onChange={(e) => onTranscribedTextChange(e.target.value)}
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
  );
};
