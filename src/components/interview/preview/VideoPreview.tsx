
import { VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";

interface VideoPreviewProps {
  streamActive: boolean;
  onCameraStart: () => void;
  cameraError: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const VideoPreview = ({
  streamActive,
  onCameraStart,
  cameraError,
  videoRef
}: VideoPreviewProps) => {
  return (
    <div className="relative flex-1 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center mb-4">
      {!streamActive ? (
        <div className="text-center p-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <VideoIcon className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-300 mb-4">Camera and microphone are currently off</p>
          <Button 
            className="bg-kodnest-purple hover:bg-kodnest-light-purple"
            onClick={onCameraStart}
          >
            Enable Camera Access
          </Button>
          {cameraError && (
            <p className="mt-2 text-red-400 text-sm">{cameraError}</p>
          )}
        </div>
      ) : (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          muted 
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};
