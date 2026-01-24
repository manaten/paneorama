import { FC, useState, useEffect } from "react";

import { BoxControlButtons } from "../BoxControlButtons";
import { FlexibleBox } from "../FlexibleBox";

const BOX_WIDTH = 280,
  BOX_HEIGHT = 120;

type Props = {
  onClickClose?: () => void;
  onClickMoveUp?: () => void;
  onClickMoveDown?: () => void;
  color: string;
  /** 固定時刻を指定する場合に使用（VRT用） */
  fixedTime?: Date;
};

type ClockBoxViewProps = {
  currentTime: Date | null;
  color: string;
};

export const ClockBoxView: FC<ClockBoxViewProps> = ({ currentTime, color }) => {
  const formatTime = (date: Date | null) => {
    if (!date) {
      return "";
    }
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "";
    }
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <svg
      viewBox={`0 0 ${BOX_WIDTH} ${BOX_HEIGHT}`}
      className={`pointer-events-auto h-full w-full`}
    >
      {/* Background */}
      <rect width={BOX_WIDTH} height={BOX_HEIGHT} fill='#00000099' rx={16} />

      {/* Time Display */}
      <text
        x={BOX_WIDTH / 2}
        y='65'
        textAnchor='middle'
        fontFamily='sans-serif'
        fontSize='48'
        fontWeight='bold'
        fill={color}
      >
        {formatTime(currentTime)}
      </text>

      {/* Date Display */}
      <text
        x={BOX_WIDTH / 2}
        y='95'
        textAnchor='middle'
        fontSize='18'
        fill={color}
      >
        {formatDate(currentTime)}
      </text>
    </svg>
  );
};

export const ClockBox: FC<Props> = ({
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  color,
  fixedTime,
}) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(
    fixedTime ?? null,
  );
  useEffect(() => {
    if (fixedTime) {
      return;
    }
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [fixedTime]);

  return (
    <FlexibleBox
      contentWidth={BOX_WIDTH}
      contentHeight={BOX_HEIGHT}
      mode='resize'
      borderColor={color}
      transparent
      buttons={
        <BoxControlButtons
          color={color}
          onClickMoveUp={onClickMoveUp}
          onClickMoveDown={onClickMoveDown}
          onClickClose={onClickClose}
        />
      }
    >
      <ClockBoxView currentTime={currentTime} color={color} />
    </FlexibleBox>
  );
};
