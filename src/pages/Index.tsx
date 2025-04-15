
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LiveClassesSection } from "@/components/LiveClassesSection";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Copy, Link, Share } from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [cameraAccess, setCameraAccess] = useState(false);
  const referralCode = "KODNEST25"; // Example referral code

  // Handle initial page load animation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Camera access function for F2F button
  const handleF2FAccess = () => {
    if (cameraAccess) {
      // If already has access, proceed
      toast.success("Starting F2F session...");
      return;
    }
    
    toast.info("Please allow camera and microphone access for the F2F feature.", {
      duration: 5000,
    });
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Successfully accessed camera
        stream.getTracks().forEach(track => track.stop()); // Stop the tracks right away
        setCameraAccess(true);
        toast.success("Camera and microphone access granted successfully!");
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        toast.error("Camera access denied. Please enable camera access in your browser settings.");
      });
  };

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

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-opacity duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <Toaster position="top-right" />
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <LiveClassesSection />
        
        {/* F2F Access Section with Enhanced Design */}
        <div className="container px-4 md:px-6 py-8">
          <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-3d border border-gray-100 dark:border-gray-700 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-kodnest-purple/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-kodnest-light-purple/10 rounded-full blur-3xl"></div>
            
            <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-kodnest-purple to-kodnest-light-blue bg-clip-text text-transparent">
              Face to Face Interaction
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-2xl mx-auto">
              Connect with instructors and peers through our face-to-face video platform. Get real-time help and guidance on your coding journey.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={handleF2FAccess}
                className="kodnest-button kodnest-button-primary hover:scale-105 transition-transform duration-300 animate-pulse-glow"
              >
                {cameraAccess ? "Start F2F Session" : "Enable Camera Access"}
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Start Learning Section */}
        <div className="container px-4 md:px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-kodnest-purple to-kodnest-light-blue bg-clip-text text-transparent">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of students mastering programming and technology skills with KodNest.
            </p>
            <Button 
              size="lg" 
              className="kodnest-button-primary hover:scale-105 transition-transform duration-300"
              onClick={() => window.location.href = "/courses"}
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 KodNest. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
