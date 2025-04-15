
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-kodnest-purple mb-2">404</h1>
        <div className="w-16 h-1 bg-kodnest-purple mx-auto mb-6"></div>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Page Not Found</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          className="bg-kodnest-purple hover:bg-kodnest-light-purple flex items-center gap-2"
          onClick={() => window.location.href = '/'}
        >
          <HomeIcon className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
