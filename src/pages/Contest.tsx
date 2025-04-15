import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Building, ExternalLink, BriefcaseBusiness, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";

const ContestPage = () => {
  const [appliedJobs, setAppliedJobs] = useState<number[]>(() => {
    const saved = localStorage.getItem('jobApplications');
    return saved ? JSON.parse(saved).map((app: any) => app.id) : [];
  });

  const jobCards = Array(40).fill(null).map((_, index) => ({
    id: index + 1,
    title: `${["Frontend", "Backend", "Fullstack", "Mobile", "DevOps"][index % 5]} Developer`,
    company: `${["TechCorp", "CodeMasters", "DevHub", "ByteWorks", "CloudNine"][index % 5]}`,
    location: `${["Remote", "Hybrid", "On-site"][index % 3]}`,
    postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    salary: `$${80 + Math.floor(Math.random() * 70)}k - $${120 + Math.floor(Math.random() * 50)}k`,
    skills: ["React", "TypeScript", "Node.js", "Python", "Java", "AWS"].slice(0, 3 + (index % 3)),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra, magna eu aliquam tincidunt, nunc elit aliquam massa, vel lacinia libero leo vitae nunc."
  }));

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString();
  };

  const handleApply = (jobId: number) => {
    if (appliedJobs.includes(jobId)) {
      toast.info("You've already applied to this job");
      return;
    }
    
    const job = jobCards.find(j => j.id === jobId);
    if (job) {
      const application = {
        id: jobId,
        jobTitle: job.title,
        company: job.company,
        appliedDate: new Date(),
      };
      
      const savedApps = localStorage.getItem('jobApplications');
      const applications = savedApps ? JSON.parse(savedApps) : [];
      applications.push(application);
      localStorage.setItem('jobApplications', JSON.stringify(applications));
      
      setAppliedJobs([...appliedJobs, jobId]);
      toast.success("Application submitted successfully!");
    }
  };

  const handleViewDetails = (job: any) => {
    // In a real app, this would show a modal or navigate to a details page
    toast(`${job.title} at ${job.company}`, {
      description: `${job.description}\n\nSkills: ${job.skills.join(", ")}\nLocation: ${job.location}`,
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 container py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-kodnest-purple to-kodnest-light-blue bg-clip-text text-transparent">
            Job Opportunities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            Browse the latest job postings from top tech companies. Find your dream role and apply directly through our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobCards.map((job) => (
            <Card key={job.id} className="hover-3d">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <Badge variant="outline" className={
                    job.location === "Remote" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" :
                    job.location === "Hybrid" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" :
                    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                  }>
                    {job.location}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Building className="h-4 w-4 mr-2" />
                    {job.company}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Posted {formatDate(job.postedDate)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {job.salary}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 flex items-center gap-1 hover:scale-105 transition-transform duration-200"
                  onClick={() => handleViewDetails(job)}
                >
                  <ExternalLink className="h-4 w-4" />
                  See Details
                </Button>
                <Button 
                  variant={appliedJobs.includes(job.id) ? "outline" : "default"}
                  size="sm" 
                  className={`flex-1 hover:scale-105 transition-transform duration-200 ${!appliedJobs.includes(job.id) ? "bg-kodnest-purple hover:bg-kodnest-light-purple" : ""}`}
                  onClick={() => handleApply(job.id)}
                >
                  {appliedJobs.includes(job.id) ? "Applied" : "Apply"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ContestPage;
