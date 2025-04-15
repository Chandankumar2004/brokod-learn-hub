
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const openBroKodChat = () => {
    window.open('https://chat.openai.com', '_blank');
  };

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 hover-3d relative">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-kodnest-purple/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-kodnest-light-purple/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center p-6 md:p-10">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-kodnest-purple to-kodnest-light-blue bg-clip-text text-transparent">
                Meet BroKod, Your Coding Assistant
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
                Your personal coding coach, mentor, and friend. BroKod is here to help you navigate your coding journey with confidence and support.
              </p>
              <Button 
                className="kodnest-button-yellow group flex items-center gap-2 text-base animate-pulse-glow hover:scale-110 transition-transform duration-300"
                onClick={openBroKodChat}
              >
                <MessageSquare className="h-5 w-5 group-hover:animate-bounce" />
                Chat with BroKod
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <div className="absolute inset-0 bg-kodnest-purple/20 rounded-full animate-blob"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-40 h-40 md:w-56 md:h-56 bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden animate-float transform hover:rotate-6 transition-transform duration-300">
                    <img 
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=kodassistant&background=%238B5CF6"
                      alt="BroKod Assistant" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
