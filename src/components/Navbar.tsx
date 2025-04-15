
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ChatWidget } from "./ChatWidget";
import { Menu, UserPlus, X, Copy, Share2, Video } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const referralCode = "KODNEST25"; // Example referral code
  const navigate = useNavigate();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
      .then(() => toast.success("Referral code copied to clipboard!"))
      .catch(err => toast.error("Failed to copy code. Please try again."));
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join KodNest Learning Platform',
        text: `Use my referral code ${referralCode} to get a discount on KodNest courses!`,
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch(err => console.error('Error sharing:', err));
    } else {
      toast.info("Sharing not supported by your browser. Copy the code instead.");
    }
  };

  const openMentorConnect = () => {
    window.open('https://zoom.us/join', '_blank');
  };

  const openBroKodChat = () => {
    window.open('https://chat.openai.com', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-kodnest-purple to-kodnest-light-purple bg-clip-text text-transparent">
              KodNest
            </span>
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
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:scale-105 transition-transform duration-200"
            >
              Courses
            </a>
            <a 
              href="/practice" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:scale-105 transition-transform duration-200"
            >
              Practice
            </a>
            <a 
              href="/contest" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:scale-105 transition-transform duration-200"
            >
              Contest
            </a>
            <a 
              href="/f2f-interview" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:scale-105 transition-transform duration-200 flex items-center gap-1"
            >
              <Video className="h-3.5 w-3.5" />
              F2F Interview
            </a>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-kodnest-purple hover:bg-kodnest-light-purple hover:scale-105 transition-transform duration-200">
                Help and Earn
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Share & Earn Rewards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share your referral code with friends and earn rewards when they join KodNest!
                </p>
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <span className="font-mono text-kodnest-purple">{referralCode}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={copyReferralCode} className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={shareReferral} className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img 
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=kodassistant&background=%238B5CF6"
                    alt="AI Assistant" 
                    className="w-20 h-20 rounded-full"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            onClick={openMentorConnect}
          >
            <UserPlus className="h-4 w-4" />
            <span>Mentor Connect</span>
          </Button>
          <ThemeToggle />
          <div onClick={openBroKodChat}>
            <ChatWidget />
          </div>
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
              <a 
                href="/f2f-interview" 
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                F2F Interview
              </a>
            </nav>
            
            <div className="flex flex-col gap-4">
              <Button className="bg-kodnest-purple hover:bg-kodnest-light-purple w-full">
                Help and Earn
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 w-full"
                onClick={openMentorConnect}
              >
                <UserPlus className="h-4 w-4" />
                <span>Mentor Connect</span>
              </Button>
              <div className="flex justify-between mt-4">
                <ThemeToggle />
                <div onClick={openBroKodChat}>
                  <ChatWidget />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
