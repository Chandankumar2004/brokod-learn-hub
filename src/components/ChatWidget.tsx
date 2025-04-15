
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([
    { sender: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === "") return;
    
    // Add user message
    setMessages([...messages, { sender: "user", text: newMessage }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Thank you for your message. A mentor will respond shortly." 
      }]);
    }, 1000);
    
    setNewMessage("");
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleWidget} 
        className="rounded-full relative"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="sr-only">Open chat</span>
        {!isOpen && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </Button>
      
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-80 md:w-96">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Chat Support</h3>
              <Button variant="ghost" size="icon" onClick={toggleWidget}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="h-80 overflow-y-auto mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-2 p-2 rounded ${
                    message.sender === "user" 
                      ? "bg-kodnest-purple text-white ml-auto max-w-[80%]" 
                      : "bg-gray-200 dark:bg-gray-700 mr-auto max-w-[80%]"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="sm">Send</Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
