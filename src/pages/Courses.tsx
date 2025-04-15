
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Star, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Java Full Stack Development",
      description: "Master Java fundamentals, Spring Boot, Hibernate, and modern web development.",
      level: "Beginner to Advanced",
      duration: "16 weeks",
      enrolled: 2453,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop",
      tags: ["Java", "Spring", "Hibernate", "HTML/CSS", "JavaScript"]
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      description: "Build a strong foundation in DSA with practical problem-solving approaches.",
      level: "Intermediate",
      duration: "12 weeks",
      enrolled: 1876,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=500&h=300&fit=crop",
      tags: ["DSA", "Problem Solving", "Algorithms", "Competitive Programming"]
    },
    {
      id: 3,
      title: "Python for Data Science",
      description: "Learn Python programming and essential data science libraries.",
      level: "Beginner",
      duration: "10 weeks",
      enrolled: 3124,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&h=300&fit=crop",
      tags: ["Python", "NumPy", "Pandas", "Matplotlib", "Data Analysis"]
    },
    {
      id: 4,
      title: "MERN Stack Development",
      description: "Create full-stack applications with MongoDB, Express, React, and Node.js.",
      level: "Intermediate",
      duration: "14 weeks",
      enrolled: 1542,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&h=300&fit=crop",
      tags: ["MongoDB", "Express", "React", "Node.js", "JavaScript"]
    },
    {
      id: 5,
      title: "DevOps and Cloud Engineering",
      description: "Master modern DevOps practices and cloud infrastructure deployment.",
      level: "Advanced",
      duration: "12 weeks",
      enrolled: 982,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=500&h=300&fit=crop",
      tags: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"]
    },
    {
      id: 6,
      title: "Mobile App Development",
      description: "Build cross-platform mobile apps using React Native and Firebase.",
      level: "Intermediate",
      duration: "10 weeks",
      enrolled: 1298,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop",
      tags: ["React Native", "Firebase", "JavaScript", "Mobile Development"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 container py-12 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-kodnest-purple to-kodnest-light-blue bg-clip-text text-transparent">
            Explore Our Courses
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Dive into industry-relevant courses designed by experts to accelerate your tech career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover-3d overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-kodnest-purple/10 text-kodnest-purple dark:bg-kodnest-purple/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {course.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{course.rating}/5.0</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 bg-kodnest-purple hover:bg-kodnest-light-purple"
                >
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Courses;
