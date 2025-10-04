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
  const [inputMinutes, setInputMinutes] = useState("5");
  const [inputSeconds, setInputSeconds] = useState("0");
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
      const minutes = parseInt(inputMinutes) ?? 0;
      const seconds = parseInt(inputSeconds) ?? 0;
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
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${tenths}`;
  };

  const lightColor = `hsl(${color}, 70%, 85%)`;
  const darkColor = `hsl(${color}, 70%, 75%)`;

  return (
    <FlexibleBox
      contentWidth={300}
      contentHeight={200}
      mode='resize'
      borderColor={color}
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
      <svg
        viewBox='0 0 300 200'
        className='pointer-events-auto h-full w-full'
        style={{ backgroundColor: lightColor }}
      >
        {/* Background */}
        <rect
          width='300'
          height='200'
          fill={lightColor}
          stroke={darkColor}
          strokeWidth='2'
        />

        {/* Timer Display */}
        <text
          x='150'
          y='80'
          textAnchor='middle'
          fontFamily='monospace'
          fontSize='40'
          fontWeight='bold'
          fill='#1f2937'
        >
          {formatTime(time)}
        </text>

        {/* Input section when stopped */}
        {time === 0 && !isRunning && (
          <g>
            <foreignObject x='75' y='90' width='150' height='40'>
              <div className='flex h-full items-center justify-center gap-2'>
                <input
                  type='number'
                  min='0'
                  max='99'
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(e.target.value)}
                  className='w-16 rounded border px-2 py-1 text-center'
                  style={{ borderColor: darkColor }}
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <span>:</span>
                <input
                  type='number'
                  min='0'
                  max='59'
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(e.target.value)}
                  className='w-16 rounded border px-2 py-1 text-center'
                  style={{ borderColor: darkColor }}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
            </foreignObject>
          </g>
        )}

        {/* Buttons */}
        <foreignObject x='50' y='140' width='200' height='50'>
          <div className='flex h-full justify-center gap-2'>
            {!isRunning && time === 0 && (
              <button
                onClick={handleStart}
                onMouseDown={(e) => e.stopPropagation()}
                className={`
                  rounded bg-green-500 px-4 py-2 text-sm text-white
                  hover:bg-green-600
                `}
              >
                Start
              </button>
            )}
            {!isRunning && time > 0 && (
              <>
                <button
                  onClick={handleStart}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`
                    rounded bg-blue-500 px-3 py-2 text-sm text-white
                    hover:bg-blue-600
                  `}
                >
                  Resume
                </button>
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
              </>
            )}
            {isRunning && (
              <>
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
              </>
            )}
          </div>
        </foreignObject>
      </svg>
    </FlexibleBox>
  );
};
