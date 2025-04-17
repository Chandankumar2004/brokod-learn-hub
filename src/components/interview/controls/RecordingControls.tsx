
import { Button } from "@/components/ui/button";
import { VideoIcon, Pause, Play } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  streamActive: boolean;
  onRecordingToggle: () => void;
  onPauseToggle: () => void;
}

export const RecordingControls = ({
  isRecording,
  isPaused,
  recordingTime,
  streamActive,
  onRecordingToggle,
  onPauseToggle
}: RecordingControlsProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex gap-4">
      <Button 
        variant={isRecording ? "destructive" : "default"}
        size="icon" 
        className={`h-12 w-12 rounded-full relative ${
          isRecording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
        }`}
        onClick={onRecordingToggle}
        disabled={!streamActive}
      >
        <VideoIcon className="h-6 w-6" />
        {isRecording && (
          <span className="absolute -top-1 -right-1 bg-white text-xs px-2 py-1 rounded-full text-gray-800 font-medium">
            {formatTime(recordingTime)}
          </span>
        )}
      </Button>

      {isRecording && (
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onPauseToggle}
        >
          {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
        </Button>
      )}
    </div>
  );
};
