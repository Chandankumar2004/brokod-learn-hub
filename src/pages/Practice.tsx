
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, ExternalLink } from "lucide-react";

const PracticePage = () => {
  const practiceCards = Array(20).fill(null).map((_, index) => ({
    id: index + 1,
    title: `Coding Challenge ${index + 1}`,
    description: `Practice your skills with these ${5} problems across different programming languages.`,
    languages: ["JavaScript", "Python", "Java", "C++", "TypeScript"].slice(0, 5),
    completed: Math.random() > 0.5,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 container py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Practice Challenges</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceCards.map((card) => (
            <Card key={card.id} className="hover-3d">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-kodnest-purple" />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{card.description}</p>
                <div className="flex flex-wrap gap-2">
                  {card.languages.map((lang) => (
                    <span 
                      key={lang} 
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 flex items-center gap-1"
                  onClick={() => window.open("/practice/problems", "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Problems
                </Button>
                <Button 
                  variant={card.completed ? "outline" : "default"}
                  size="sm" 
                  className={`flex-1 ${!card.completed ? "bg-kodnest-purple hover:bg-kodnest-light-purple" : ""}`}
                >
                  {card.completed ? "Continue" : "Start"}
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
