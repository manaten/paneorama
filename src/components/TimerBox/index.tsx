import { FC, useState, useEffect } from "react";

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
  // タイマーの状態
  const [targetDuration, setTargetDuration] = useState(5 * 60 * 1000); // デフォルト5分
  const [status, setStatus] = useState<"stopped" | "running">("stopped");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [pausedElapsed, setPausedElapsed] = useState(0);
  const [_tick, setTick] = useState(0); // 再レンダリング用

  // running中は100ms毎に再レンダリング
  useEffect(() => {
    if (status !== "running") return;

    const intervalId = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status]);

  // 残り時間を計算
  const getDisplayTime = (): number => {
    if (status === "stopped") {
      return targetDuration - pausedElapsed;
    } else {
      // running
      const elapsed = Date.now() - startedAt! + pausedElapsed;
      return targetDuration - elapsed;
    }
  };

  const displayTime = getDisplayTime();
  const isOvertime = displayTime < 0;

  // 時間フォーマット
  const formatTime = (ms: number): string => {
    const isNegative = ms < 0;
    const absMs = Math.abs(ms);
    const totalSeconds = Math.floor(absMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((absMs % 1000) / 10);

    const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;

    return isNegative ? `-${timeStr}` : timeStr;
  };

  // ±30秒ボタン
  const handleAdjust30Seconds = (delta: number) => {
    setTargetDuration((prev) => Math.max(0, prev + delta * 30 * 1000));
  };

  // Start/Pauseボタン
  const handleStartPause = () => {
    if (status === "running") {
      // Pause
      setPausedElapsed(Date.now() - startedAt! + pausedElapsed);
      setStartedAt(null);
      setStatus("stopped");
    } else {
      // Start
      setStartedAt(Date.now());
      setStatus("running");
    }
  };

  // Resetボタン
  const handleReset = () => {
    setStatus("stopped");
    setStartedAt(null);
    setPausedElapsed(0);
    // targetDurationは保持
  };

  const textColor = isOvertime ? "#ef4444" : color;

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
          fill={textColor}
        >
          {formatTime(displayTime)}
        </text>

        {/* Buttons */}
        <foreignObject x='0' y='80' width='280' height='50'>
          <div className='flex h-full justify-center gap-2'>
            <button
              onClick={() => handleAdjust30Seconds(-1)}
              onMouseDown={(e) => e.stopPropagation()}
              className={`
                rounded bg-blue-500 px-3 py-2 text-sm text-white
                hover:bg-blue-600
              `}
            >
              -30s
            </button>
            {status === "stopped" && (
              <button
                onClick={handleStartPause}
                onMouseDown={(e) => e.stopPropagation()}
                className={`
                  rounded bg-blue-500 px-3 py-2 text-sm text-white
                  hover:bg-blue-600
                `}
              >
                Start
              </button>
            )}
            {status === "running" && (
              <button
                onClick={handleStartPause}
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
              onClick={() => handleAdjust30Seconds(1)}
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
