"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface SequenceTimingProps {
  startTime: string;
  endTime: string;
  days: string[];
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onDaysChange: (days: string[]) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeToPercent = (time: string) => {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m;
  return (totalMinutes / (24 * 60)) * 100;
};

const percentToTime = (percent: number) => {
  const totalMinutes = Math.round((percent / 100) * 24 * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const clampedH = Math.max(0, Math.min(23, h));
  const clampedM = Math.max(0, Math.min(59, m));
  return `${clampedH.toString().padStart(2, "0")}:${clampedM.toString().padStart(2, "0")}`;
};

const formatTime = (time: string) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hours = h % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
};

export function SequenceTiming({
  startTime,
  endTime,
  days,
  onStartTimeChange,
  onEndTimeChange,
  onDaysChange,
}: SequenceTimingProps) {
  const startPercent = timeToPercent(startTime);
  const endPercent = timeToPercent(endTime);
  const sliderRef = useRef<HTMLDivElement>(null);

  const toggleDay = (day: string) => {
    if (days.includes(day)) {
      onDaysChange(days.filter((d) => d !== day));
    } else {
      onDaysChange([...days, day]);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const handle = e.currentTarget as HTMLDivElement;
    handle.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (type: "start" | "end") => (e: React.PointerEvent) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId) || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newTime = percentToTime(percent);

    if (type === "start") {
      if (percent < endPercent) {
        onStartTimeChange(newTime);
      }
    } else {
      if (percent > startPercent) {
        onEndTimeChange(newTime);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">Sequence Timing</label>
        <p className="text-sm text-muted-foreground">
          Tell us the best times for sending sequences
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-2">
          <Badge variant="outline" className="bg-background font-normal">
            {formatTime(startTime)}
          </Badge>
          <Badge variant="outline" className="bg-background font-normal">
            {formatTime(endTime)}
          </Badge>
        </div>
        
        <div 
          ref={sliderRef}
          className="relative h-2 bg-muted rounded-full cursor-pointer touch-none"
          onClick={(e) => {
             if (!sliderRef.current) return;
             // Only process if clicking background, not handles
             if ((e.target as HTMLElement).getAttribute('role') === 'slider') return;
             
             const rect = sliderRef.current.getBoundingClientRect();
             const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
             const distStart = Math.abs(percent - startPercent);
             const distEnd = Math.abs(percent - endPercent);
             
             if (distStart < distEnd) {
                if (percent < endPercent) onStartTimeChange(percentToTime(percent));
             } else {
                if (percent > startPercent) onEndTimeChange(percentToTime(percent));
             }
          }}
        >
          {/* Active Range Bar */}
          <div
            className="absolute top-0 bottom-0 bg-primary rounded-full opacity-20 pointer-events-none"
            style={{
              left: `${startPercent}%`,
              right: `${100 - endPercent}%`,
            }}
          />
          <div
            className="absolute top-0 bottom-0 bg-primary rounded-full pointer-events-none"
            style={{
              left: `${startPercent}%`,
              right: `${100 - endPercent}%`,
            }}
          />

          {/* Start Handle */}
          <div
            role="slider"
            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-background border-2 border-primary rounded-full shadow cursor-grab active:cursor-grabbing z-10 hover:scale-110 transition-transform touch-none"
            style={{ left: `${startPercent}%` }}
            onPointerDown={handlePointerDown("start")}
            onPointerMove={handlePointerMove("start")}
            onPointerUp={handlePointerUp}
          />

          {/* End Handle */}
          <div
            role="slider"
            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-background border-2 border-primary rounded-full shadow cursor-grab active:cursor-grabbing z-10 hover:scale-110 transition-transform touch-none"
            style={{ left: `${endPercent}%` }}
            onPointerDown={handlePointerDown("end")}
            onPointerMove={handlePointerMove("end")}
            onPointerUp={handlePointerUp}
          />
        </div>
        
        <div className="flex items-center gap-4">
             <div className="flex-1">
                 <label className="text-xs text-muted-foreground mb-1 block">Start Time</label>
                 <Input 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => onStartTimeChange(e.target.value)}
                    className="h-8"
                 />
             </div>
             <div className="flex-1">
                 <label className="text-xs text-muted-foreground mb-1 block">End Time</label>
                 <Input 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => onEndTimeChange(e.target.value)}
                    className="h-8"
                 />
             </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
         <label className="text-sm font-medium">Active Days</label>
         <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
               const isSelected = days.some(d => d === day || d === day.substring(0, 3));
               return (
                  <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`
                     flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors
                     ${
                        isSelected
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                     }
                  `}
                  >
                  {day}
                  {isSelected && <X className="h-3 w-3" />}
                  </button>
               );
            })}
         </div>
      </div>
    </div>
  );
}
