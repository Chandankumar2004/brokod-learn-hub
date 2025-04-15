
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface ClassCardProps {
  title: string;
  status: 'live' | 'completed' | 'not-started';
  progress: number;
  startTime: string;
  endTime: string;
}

export function ClassCard({ title, status, progress, startTime, endTime }: ClassCardProps) {
  const statusColors = {
    live: "text-green-500 bg-green-50 dark:bg-green-900/20",
    completed: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    'not-started': "text-gray-500 bg-gray-50 dark:bg-gray-800"
  };
  
  const statusLabels = {
    live: "Live",
    completed: "Completed",
    'not-started': "Not Started"
  };

  return (
    <Card className="w-full max-w-sm hover-3d">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="font-medium">{progress.toFixed(2)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2" />
          <span>{startTime} – {endTime}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        {status === 'live' ? (
          <>
            <Button variant="outline" size="sm" className="flex-1">Help Desk</Button>
            <Button variant="default" size="sm" className="flex-1 bg-kodnest-purple hover:bg-kodnest-light-purple">Join Class</Button>
          </>
        ) : status === 'completed' ? (
          <Button variant="outline" size="sm" className="w-full">View Recording</Button>
        ) : (
          <Button variant="outline" size="sm" className="w-full">Set Reminder</Button>
        )}
      </CardFooter>
    </Card>
  );
}
