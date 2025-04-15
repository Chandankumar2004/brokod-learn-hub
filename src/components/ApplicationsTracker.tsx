
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Briefcase, X } from "lucide-react";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  appliedDate: Date;
}

export function ApplicationsTracker() {
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('jobApplications');
    return saved ? JSON.parse(saved) : [];
  });

  const handleWithdraw = (applicationId: number) => {
    setApplications(prev => {
      const newApplications = prev.filter(app => app.id !== applicationId);
      localStorage.setItem('jobApplications', JSON.stringify(newApplications));
      return newApplications;
    });
    toast.success("Application withdrawn successfully");
  };

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No job applications yet. Start applying to jobs from the Contest page!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Applications ({applications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div>
                  <h4 className="font-medium">{application.jobTitle}</h4>
                  <p className="text-sm text-muted-foreground">{application.company}</p>
                  <p className="text-xs text-muted-foreground">
                    Applied: {new Date(application.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleWithdraw(application.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <X className="h-4 w-4 mr-1" />
                  Withdraw
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
