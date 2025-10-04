import { FC, useState, useEffect } from "react";

import { Button } from "../Button";
import { FlexibleBox } from "../FlexibleBox";

type Props = {
  onClickClose?: () => void;
  onClickMoveUp?: () => void;
  onClickMoveDown?: () => void;
  color: string;
};

type TimerState = {
  targetDuration: number; // 目標時間（ミリ秒）
  pausedElapsed: number; // 停止中に経過した時間
} & (
  | {
      status: "stopped";
      startedAt: null;
    }
  | {
      status: "running";
      startedAt: number; // 開始時刻のタイムスタンプ
    }
);

export const TimerBox: FC<Props> = ({
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  color,
}) => {
  // タイマーの状態
  const [timerState, setTimerState] = useState<TimerState>({
    targetDuration: 5 * 60 * 1000, // デフォルト5分
    pausedElapsed: 0,
    status: "stopped",
    startedAt: null,
  });
  const [_tick, setTick] = useState(0); // 再レンダリング用

  // running中は100ms毎に再レンダリング
  useEffect(() => {
    if (timerState.status !== "running") return;

    const intervalId = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timerState.status]);

  // 残り時間を計算
  const getDisplayTime = (): number => {
    if (timerState.status === "stopped") {
      return timerState.targetDuration - timerState.pausedElapsed;
    } else {
      // running - startedAtは必ずnumber型
      const elapsed =
        Date.now() - timerState.startedAt + timerState.pausedElapsed;
      return timerState.targetDuration - elapsed;
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
    setTimerState((prev) => ({
      ...prev,
      targetDuration: Math.max(0, prev.targetDuration + delta * 30 * 1000),
    }));
  };

  // Start/Pauseボタン
  const handleStartPause = () => {
    setTimerState((prev) => {
      if (prev.status === "running") {
        // Pause - prev.startedAtは必ずnumber型
        return {
          ...prev,
          status: "stopped",
          startedAt: null,
          pausedElapsed: Date.now() - prev.startedAt + prev.pausedElapsed,
        };
      } else {
        // Start
        return {
          ...prev,
          status: "running",
          startedAt: Date.now(),
        };
      }
    });
  };

  // Resetボタン
  const handleReset = () => {
    setTimerState((prev) => ({
      ...prev,
      status: "stopped",
      startedAt: null,
      pausedElapsed: 0,
      // targetDurationは保持
    }));
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
            {timerState.status === "stopped" && (
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
            {timerState.status === "running" && (
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
