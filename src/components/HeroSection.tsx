
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 hover-3d">
          <div className="flex flex-col md:flex-row items-center p-6 md:p-10">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-kodnest-purple">
                Meet BroKod, Your Coding Assistant
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
                Your personal coding coach, mentor, and friend. BroKod is here to help you navigate your coding journey with confidence and support.
              </p>
              <Button className="kodnest-button-yellow group flex items-center gap-2 text-base animate-pulse-glow">
                <MessageSquare className="h-5 w-5 group-hover:animate-bounce" />
                Chat with BroKod
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <div className="absolute inset-0 bg-kodnest-purple/20 rounded-full animate-blob"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-40 h-40 md:w-56 md:h-56 bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden animate-float">
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
