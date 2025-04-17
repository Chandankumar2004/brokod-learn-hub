
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface VideoControlsProps {
  cameraEnabled: boolean;
  micEnabled: boolean;
  onCameraToggle: () => void;
  onMicToggle: () => void;
}

export const VideoControls = ({
  cameraEnabled,
  micEnabled,
  onCameraToggle,
  onMicToggle
}: VideoControlsProps) => {
  return (
    <div className="flex gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        className={`h-12 w-12 rounded-full ${cameraEnabled ? 'bg-white text-gray-800' : 'bg-red-500 text-white hover:bg-red-600'}`}
        onClick={onCameraToggle}
      >
        {cameraEnabled ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className={`h-12 w-12 rounded-full ${micEnabled ? 'bg-white text-gray-800' : 'bg-red-500 text-white hover:bg-red-600'}`}
        onClick={onMicToggle}
      >
        {micEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
      </Button>
    </div>
  );
};
