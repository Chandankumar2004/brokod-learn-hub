
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Building, ExternalLink } from "lucide-react";

const ContestPage = () => {
  const jobCards = Array(40).fill(null).map((_, index) => ({
    id: index + 1,
    title: `${["Frontend", "Backend", "Fullstack", "Mobile", "DevOps"][index % 5]} Developer`,
    company: `${["TechCorp", "CodeMasters", "DevHub", "ByteWorks", "CloudNine"][index % 5]}`,
    location: `${["Remote", "Hybrid", "On-site"][index % 3]}`,
    postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    salary: `$${80 + Math.floor(Math.random() * 70)}k - $${120 + Math.floor(Math.random() * 50)}k`,
    skills: ["React", "TypeScript", "Node.js", "Python", "Java", "AWS"].slice(0, 3 + (index % 3)),
  }));

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 container py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">Job Opportunities</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Browse the latest job postings from top tech companies
        </p>
        
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
                  className="flex-1 flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  See Details
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 bg-kodnest-purple hover:bg-kodnest-light-purple"
                >
                  Apply
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
