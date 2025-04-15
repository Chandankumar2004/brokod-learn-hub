import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ApplicationsTracker } from "@/components/ApplicationsTracker";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  skills: z.string(),
  education: z.string(),
  experience: z.string(),
  bio: z.string().max(500, "Bio should not exceed 500 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      skills: "",
      education: "",
      experience: "",
      bio: "",
    },
  });

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Profile picture uploaded successfully");
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      toast.success("Resume uploaded successfully");
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    toast.info("Profile picture removed");
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    toast.info("Resume removed");
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    console.log("Profile Image:", profileImage);
    console.log("Resume:", resumeFile);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container py-8">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <CardDescription>
                  Update your personal information and resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileImage || ""} />
                      <AvatarFallback className="text-3xl">
                        {form.watch("fullName") 
                          ? form.watch("fullName").charAt(0).toUpperCase() 
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="relative"
                        onClick={() => document.getElementById("profile-upload")?.click()}
                      >
                        <Input 
                          type="file" 
                          accept="image/*" 
                          id="profile-upload"
                          className="hidden"
                          onChange={handleProfileImageChange}
                        />
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRemoveProfileImage}
                        disabled={!profileImage}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-4">Resume</h3>
                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 mb-4">
                      {resumeFile ? (
                        <div className="flex justify-between items-center">
                          <span>{resumeFile.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={handleRemoveResume}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                          No resume uploaded
                        </p>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="relative"
                        onClick={() => document.getElementById("resume-upload")?.click()}
                      >
                        <Input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          id="resume-upload"
                          className="hidden"
                          onChange={handleResumeChange}
                        />
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Resume
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (234) 567-8901" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                              <Input placeholder="JavaScript, React, Node.js" {...field} />
                            </FormControl>
                            <FormDescription>
                              List your key skills, separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Bachelor of Science in Computer Science, University of..." 
                              {...field} 
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Experience</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Software Engineer at Tech Company (2020-Present)..." 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a bit about yourself..." 
                              {...field} 
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            {500 - (field.value?.length || 0)} characters remaining
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-kodnest-purple hover:bg-kodnest-light-purple"
                    >
                      Save Profile
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <ApplicationsTracker />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
