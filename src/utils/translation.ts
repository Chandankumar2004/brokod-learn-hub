
// A simple utility to mock translation functionality
// In a real application, this would integrate with a translation API like Google Translate

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  console.log(`Translating to ${targetLanguage}: ${text}`);
  
  // Mock translation delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock translations for demo purposes
  if (targetLanguage.toLowerCase() === 'hindi') {
    return `${text} (translated to Hindi)`;
  } else if (targetLanguage.toLowerCase() === 'spanish') {
    return `${text} (translated to Spanish)`;
  } else if (targetLanguage.toLowerCase() === 'french') {
    return `${text} (translated to French)`;
  } else if (targetLanguage.toLowerCase() === 'german') {
    return `${text} (translated to German)`;
  } else if (targetLanguage.toLowerCase() === 'japanese') {
    return `${text} (translated to Japanese)`;
  } else if (targetLanguage.toLowerCase() === 'chinese') {
    return `${text} (translated to Chinese)`;
  }
  
  // Return original if no translation is available
  return text;
};

// List of supported languages for the UI
export const supportedLanguages = [
  'English',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Chinese'
];
