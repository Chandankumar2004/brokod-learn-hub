
import { Button } from "@/components/ui/button";
import { ClassCard } from "./ClassCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export function LiveClassesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const classes = [
    {
      id: 1,
      title: "Data Structures and Algorithms",
      status: "live" as const,
      progress: 98.24,
      startTime: "05:30 PM",
      endTime: "07:30 PM"
    },
    {
      id: 2,
      title: "Java – 2025",
      status: "completed" as const,
      progress: 97.26,
      startTime: "09:00 AM",
      endTime: "10:15 AM"
    },
    {
      id: 3,
      title: "SQL – 2025",
      status: "not-started" as const,
      progress: 99.49,
      startTime: "10:15 AM",
      endTime: "11:00 AM"
    },
    {
      id: 4,
      title: "Web Development",
      status: "not-started" as const,
      progress: 85.50,
      startTime: "02:00 PM",
      endTime: "03:30 PM"
    },
    {
      id: 5,
      title: "Python Fundamentals",
      status: "completed" as const,
      progress: 100,
      startTime: "11:30 AM",
      endTime: "01:00 PM"
    }
  ];

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Live Classes</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollLeft} 
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollRight} 
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <ScrollArea className="pb-4 -mx-4 px-4" orientation="horizontal">
            <div 
              ref={scrollRef} 
              className="flex space-x-6 pb-4"
              style={{ minWidth: "min-content" }}
            >
              {classes.map((classItem) => (
                <div key={classItem.id} className="min-w-[300px]">
                  <ClassCard {...classItem} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
