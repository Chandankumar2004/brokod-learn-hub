
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

// Explicitly handle translation toggle button and loading state.
interface TranslationToggleProps {
  showTranslation: boolean;
  onToggleTranslation: () => void;
  translatedText: string | null;
  isTranslating: boolean;
}

export const TranslationToggle = ({
  showTranslation,
  onToggleTranslation,
  translatedText,
  isTranslating,
}: TranslationToggleProps) => {
  if (!translatedText) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 px-2"
      onClick={onToggleTranslation}
      disabled={isTranslating}
    >
      <Volume2 className="h-4 w-4 mr-1" />
      {showTranslation ? "Show Original" : "Show Translation"}
    </Button>
  );
};
