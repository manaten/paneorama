import { FC, useState, useEffect, useRef } from "react";

import { Button } from "../Button";
import { FlexibleBox } from "../FlexibleBox";

type Props = {
  onClickClose?: () => void;
  onClickMoveUp?: () => void;
  onClickMoveDown?: () => void;
  color: string;
};

export const TimerBox: FC<Props> = ({
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  color,
}) => {
  const [time, setTime] = useState(0); // milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isRunning && time > 0) {
      // eslint-disable-next-line functional/immutable-data
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 100) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 100;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const handleStart = () => {
    if (time === 0) {
      const minutes = 5;
      const seconds = 0;
      const totalMs = (minutes * 60 + seconds) * 1000;
      if (totalMs > 0) {
        setTime(totalMs);
        setIsRunning(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${tenths.toString().padStart(2, "0")}`;
  };

  return (
    <FlexibleBox
      contentWidth={280}
      contentHeight={140}
      mode='resize'
      transparent
      buttons={
        <div
          className={`
            pointer-events-none absolute top-0 right-0 flex flex-row gap-2 p-4
          `}
        >
          <Button
            className='pointer-events-auto'
            iconType='move_up'
            iconColor={color}
            onClick={onClickMoveUp}
            title='前面に移動'
          />
          <Button
            className='pointer-events-auto'
            iconType='move_down'
            iconColor={color}
            onClick={onClickMoveDown}
            title='背面に移動'
          />
          <Button
            className='pointer-events-auto'
            iconType='close'
            iconColor={color}
            onClick={onClickClose}
            title='閉じる'
          />
        </div>
      }
    >
      <svg viewBox='0 0 280 140' className='pointer-events-auto h-full w-full'>
        {/* Background */}
        <rect width='280' height='140' rx={16} fill='#00000099' />

        {/* Timer Display */}
        <text
          x='140'
          y='65'
          textAnchor='middle'
          fontFamily='sans-serif'
          fontSize='48'
          fontWeight='bold'
          fill={color}
        >
          {formatTime(time)}
        </text>

        {/* Buttons */}
        <foreignObject x='0' y='80' width='280' height='50'>
          <div className='flex h-full justify-center gap-2'>
            <button
              onClick={handleStart}
              onMouseDown={(e) => e.stopPropagation()}
              className={`
                rounded bg-blue-500 px-3 py-2 text-sm text-white
                hover:bg-blue-600
              `}
            >
              -30s
            </button>
            {!isRunning && (
              <button
                onClick={handleStart}
                onMouseDown={(e) => e.stopPropagation()}
                className={`
                  rounded bg-blue-500 px-3 py-2 text-sm text-white
                  hover:bg-blue-600
                `}
              >
                Start
              </button>
            )}
            {isRunning && (
              <button
                onClick={handlePause}
                onMouseDown={(e) => e.stopPropagation()}
                className={`
                  rounded bg-yellow-500 px-3 py-2 text-sm text-white
                  hover:bg-yellow-600
                `}
              >
                Pause
              </button>
            )}
            <button
              onClick={handleReset}
              onMouseDown={(e) => e.stopPropagation()}
              className={`
                rounded bg-gray-500 px-3 py-2 text-sm text-white
                hover:bg-gray-600
              `}
            >
              Reset
            </button>
            <button
              onClick={handleStart}
              onMouseDown={(e) => e.stopPropagation()}
              className={`
                rounded bg-blue-500 px-3 py-2 text-sm text-white
                hover:bg-blue-600
              `}
            >
              +30s
            </button>
          </div>
        </foreignObject>
      </svg>
    </FlexibleBox>
  );
};
