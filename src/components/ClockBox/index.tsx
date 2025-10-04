import { FC, useState, useEffect } from "react";

import { Button } from "../Button";
import { FlexibleBox } from "../FlexibleBox";

type Props = {
  onClickClose?: () => void;
  onClickMoveUp?: () => void;
  onClickMoveDown?: () => void;
  color: string;
};

export const ClockBox: FC<Props> = ({
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  color,
}) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

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

  const lightColor = `hsl(${color}, 70%, 85%)`;
  const darkColor = `hsl(${color}, 70%, 75%)`;

  return (
    <FlexibleBox
      contentWidth={350}
      contentHeight={180}
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
        viewBox='0 0 350 180'
        className='pointer-events-auto h-full w-full'
        style={{ backgroundColor: lightColor }}
      >
        {/* Background */}
        <rect
          width='350'
          height='180'
          fill={lightColor}
          stroke={darkColor}
          strokeWidth='2'
        />

        {/* Time Display */}
        <text
          x='175'
          y='90'
          textAnchor='middle'
          fontFamily='monospace'
          fontSize='48'
          fontWeight='bold'
          fill='#1f2937'
        >
          {formatTime(currentTime)}
        </text>

        {/* Date Display */}
        <text x='175' y='130' textAnchor='middle' fontSize='16' fill='#4b5563'>
          {formatDate(currentTime)}
        </text>
      </svg>
    </FlexibleBox>
  );
};
