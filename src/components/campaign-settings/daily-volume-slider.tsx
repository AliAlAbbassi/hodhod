interface DailyVolumeSliderProps {
  volume: number;
  onChange: (volume: number) => void;
}

export function DailyVolumeSlider({
  volume,
  onChange,
}: DailyVolumeSliderProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">Daily Sequence Volume</label>
        <p className="text-sm text-muted-foreground">
          The number of sequences Hodhod should send each day
        </p>
      </div>
      <div className="pt-6 px-2">
        <div className="relative">
          {/* Moving Value Label */}
          <div
            className="absolute -top-8 -translate-x-1/2 bg-background border rounded px-2 py-0.5 text-sm font-medium shadow-sm transition-all select-none pointer-events-none"
            style={{ left: `${volume}%` }}
          >
            {volume}
          </div>

          {/* Slider Input */}
          <input
            type="range"
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => onChange(Number(e.target.value))}
          />

          {/* Min/Max Labels (Optional, not in design but helpful) */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
