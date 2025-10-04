import { FC, useState, useEffect, ReactNode } from "react";

import { Button } from "../Button";
import { FlexibleBox } from "../FlexibleBox";

const BOX_WIDTH = 280,
  BOX_HEIGHT = 120;

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
    }
  | {
      status: "running";
      startedAt: number; // 開始時刻のタイムスタンプ
      currentTime: number; // 現在のタイムスタンプ（再レンダリング用）
    }
);

// 残り時間を計算
function getDisplayTime(timerState: TimerState): number {
  if (timerState.status === "stopped") {
    return timerState.targetDuration - timerState.pausedElapsed;
  } else {
    const elapsed =
      timerState.currentTime - timerState.startedAt + timerState.pausedElapsed;
    return timerState.targetDuration - elapsed;
  }
}

// 時間フォーマット
function formatTime(ms: number): string {
  const isNegative = ms < 0;
  const absMs = Math.abs(ms);
  const totalSeconds = Math.floor(absMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiSeconds = Math.floor((absMs % 1000) / 10);

  const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${centiSeconds.toString().padStart(2, "0")}`;

  return isNegative ? `-${timeStr}` : timeStr;
}

const TimerButton: FC<{
  color: string;
  onClick?: () => void;
  children: ReactNode;
}> = ({ color, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      className={`
        cursor-pointer rounded border-2 border-current px-3 py-2 text-sm
        text-white
        hover:bg-gray-600
      `}
      style={{ color }}
    >
      {children}
    </button>
  );
};

type TimerBoxViewProps = {
  timerState: TimerState;
  color: string;
  onClickMinus30s: () => void;
  onClickStartPause: () => void;
  onClickReset: () => void;
  onClickPlus30s: () => void;
};

export const TimerBoxView: FC<TimerBoxViewProps> = ({
  timerState,
  color,
  onClickMinus30s,
  onClickStartPause,
  onClickReset,
  onClickPlus30s,
}) => {
  const displayTime = getDisplayTime(timerState);
  const isOvertime = displayTime < 0;
  const textColor = isOvertime ? "#ef4444" : color;

  return (
    <svg
      viewBox={`0 0 ${BOX_WIDTH} ${BOX_HEIGHT}`}
      className={`pointer-events-auto h-full w-full`}
    >
      {/* Background */}
      <rect width={BOX_WIDTH} height={BOX_HEIGHT} rx={16} fill='#00000099' />

      {/* Timer Display */}
      <text
        x={BOX_WIDTH / 2}
        y='55'
        textAnchor='middle'
        fontFamily='sans-serif'
        fontSize='48'
        fontWeight='bold'
        fill={textColor}
      >
        {formatTime(displayTime)}
      </text>

      {/* Buttons */}
      <foreignObject x='0' y='70' width={BOX_WIDTH} height='40'>
        <div className='flex h-full justify-center gap-2'>
          <TimerButton onClick={onClickMinus30s} color={color}>
            -30s
          </TimerButton>
          <TimerButton onClick={onClickStartPause} color={color}>
            {timerState.status === "running" ? "Pause" : "Start"}
          </TimerButton>
          <TimerButton onClick={onClickReset} color={color}>
            Reset
          </TimerButton>
          <TimerButton onClick={onClickPlus30s} color={color}>
            +30s
          </TimerButton>
        </div>
      </foreignObject>
    </svg>
  );
};

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
  });

  // running中は100ms毎に再レンダリング
  useEffect(() => {
    if (timerState.status !== "running") return;

    const intervalId = window.setInterval(() => {
      setTimerState((prev) => ({
        ...prev,
        currentTime: Date.now(),
      }));
    }, 66);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timerState.status]);

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
          currentTime: Date.now(),
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

  return (
    <FlexibleBox
      contentWidth={BOX_WIDTH}
      contentHeight={BOX_HEIGHT}
      mode='resize'
      transparent
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
      <TimerBoxView
        timerState={timerState}
        color={color}
        onClickMinus30s={() => handleAdjust30Seconds(-1)}
        onClickStartPause={handleStartPause}
        onClickReset={handleReset}
        onClickPlus30s={() => handleAdjust30Seconds(1)}
      />
    </FlexibleBox>
  );
};
