
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportedLanguages } from "@/utils/translation";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector = ({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) => {
  return (
    <Select 
      value={selectedLanguage} 
      onValueChange={onLanguageChange}
    >
      <SelectTrigger className="w-[140px] h-8">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem key={lang.toLowerCase()} value={lang.toLowerCase()}>
            {lang}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
