
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, ExternalLink, Check, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PracticePage = () => {
  const [startedChallenges, setStartedChallenges] = useState<number[]>([]);

  const practiceCards = Array(20).fill(null).map((_, index) => ({
    id: index + 1,
    title: `Coding Challenge ${index + 1}`,
    description: `Practice your skills with these ${5} problems across different programming languages.`,
    languages: ["JavaScript", "Python", "Java", "C++", "TypeScript"].slice(0, 5),
    completed: Math.random() > 0.75,
    difficulty: ["Easy", "Medium", "Hard"][index % 3],
    estimatedTime: `${20 + (index % 40)} mins`,
    problems: [
      "Array Manipulation",
      "String Operations",
      "Data Structures",
      "Algorithms",
      "Debugging"
    ]
  }));

  const handleStartChallenge = (id: number) => {
    setStartedChallenges([...startedChallenges, id]);
    toast.success("Challenge started! Good luck!");
  };

  const handleViewProblems = (challenge: any) => {
    toast(`${challenge.title} - ${challenge.difficulty}`, {
      description: `Problems: ${challenge.problems.join(", ")}\nLanguages: ${challenge.languages.join(", ")}`,
      duration: 5000,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 container py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-kodnest-purple to-kodnest-light-blue bg-clip-text text-transparent">
            Practice Challenges
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            Sharpen your coding skills with these carefully crafted challenges. From beginner to advanced, find the perfect problems to level up your abilities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceCards.map((card) => (
            <Card key={card.id} className="hover-3d">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-kodnest-purple" />
                    {card.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(card.difficulty)}>
                    {card.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{card.estimatedTime}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{card.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {card.languages.map((lang) => (
                    <span 
                      key={lang} 
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
                <div className="space-y-1">
                  {card.problems.map((problem, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 rounded-full bg-kodnest-purple"></div>
                      <span>{problem}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 flex items-center gap-1 hover:scale-105 transition-transform duration-200"
                  onClick={() => handleViewProblems(card)}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Problems
                </Button>
                <Button 
                  variant={card.completed ? "outline" : (startedChallenges.includes(card.id) ? "secondary" : "default")}
                  size="sm" 
                  className={`flex-1 hover:scale-105 transition-transform duration-200 ${!card.completed && !startedChallenges.includes(card.id) ? "bg-kodnest-purple hover:bg-kodnest-light-purple" : ""}`}
                  onClick={() => handleStartChallenge(card.id)}
                >
                  {card.completed ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-500" />
                      Completed
                    </span>
                  ) : startedChallenges.includes(card.id) ? "Continue" : "Start"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PracticePage;
