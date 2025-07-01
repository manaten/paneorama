import classNames from "classnames";
import { FC } from "react";

interface Props {
  className?: string;
  streamCount: number;
  isCapturing: boolean;
}

export const StatusIndicator: FC<Props> = ({
  className,
  streamCount,
  isCapturing,
}) => {
  if (streamCount === 0) return null;

  return (
    <div
      className={classNames(
        "fixed bottom-6 left-6 glass-effect-dark rounded-full px-4 py-2",
        "flex items-center gap-3 transition-all duration-300",
        "pointer-events-none z-40",
        className,
      )}
    >
      {/* Status Indicator */}
      <div className='flex items-center gap-2'>
        <div
          className={classNames(
            "w-2 h-2 rounded-full transition-all duration-300",
            isCapturing ? "bg-green-400 animate-pulse" : "bg-red-400",
          )}
        />
        <span className='text-white/80 text-sm font-medium'>
          {isCapturing ? "Capturing" : "Paused"}
        </span>
      </div>

      {/* Stream Count */}
      <div className='flex items-center gap-1 text-white/60 text-sm'>
        <span>📺</span>
        <span>{streamCount}</span>
      </div>

      {/* Performance Indicator */}
      <div className='flex items-center gap-1 text-white/60 text-sm'>
        <div className='flex items-center gap-0.5'>
          <div className='w-1 h-3 bg-green-400 rounded-full' />
          <div className='w-1 h-2 bg-green-400 rounded-full' />
          <div className='w-1 h-4 bg-yellow-400 rounded-full' />
        </div>
      </div>
    </div>
  );
};
