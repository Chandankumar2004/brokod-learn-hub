
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ChatWidget } from "./ChatWidget";
import { Menu, UserPlus, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-kodnest-purple">KodNest</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <a 
              href="/" 
              className="text-sm font-medium relative text-foreground after:absolute after:w-full after:h-0.5 after:bg-kodnest-purple after:bottom-0 after:left-0"
            >
              Home
            </a>
            <a 
              href="/courses" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Courses
            </a>
            <a 
              href="/practice" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Practice
            </a>
            <a 
              href="/contest" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contest
            </a>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <Button className="bg-kodnest-purple hover:bg-kodnest-light-purple">
            Help and Earn
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Mentor Connect</span>
          </Button>
          <ThemeToggle />
          <ChatWidget />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background shadow-lg p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-kodnest-purple">KodNest</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="flex flex-col gap-6 mb-8">
              <a 
                href="/" 
                className="text-lg font-medium flex items-center justify-between"
              >
                Home
                <span className="h-1 w-1 rounded-full bg-kodnest-purple"></span>
              </a>
              <a 
                href="/courses" 
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Courses
              </a>
              <a 
                href="/practice" 
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Practice
              </a>
              <a 
                href="/contest" 
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Contest
              </a>
            </nav>
            
            <div className="flex flex-col gap-4">
              <Button className="bg-kodnest-purple hover:bg-kodnest-light-purple w-full">
                Help and Earn
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                <UserPlus className="h-4 w-4" />
                <span>Mentor Connect</span>
              </Button>
              <div className="flex justify-between mt-4">
                <ThemeToggle />
                <ChatWidget />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
