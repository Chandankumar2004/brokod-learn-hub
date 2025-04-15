
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LiveClassesSection } from "@/components/LiveClassesSection";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Handle initial page load animation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Camera access function for F2F button
  const handleF2FAccess = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Successfully accessed camera
        stream.getTracks().forEach(track => track.stop()); // Stop the tracks right away
        alert("Camera and microphone access granted successfully!");
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        alert("Please allow camera and microphone access for the F2F feature.");
      });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-opacity duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <Toaster position="top-right" />
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <LiveClassesSection />
        
        {/* F2F Access Button */}
        <div className="container px-4 md:px-6 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-3d">
            <h2 className="text-2xl font-bold mb-4 text-center text-kodnest-purple">Face to Face Interaction</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Connect with instructors and peers through our face-to-face video platform.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={handleF2FAccess}
                className="kodnest-button kodnest-button-primary"
              >
                Start F2F Session
              </button>
            </div>
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
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
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
