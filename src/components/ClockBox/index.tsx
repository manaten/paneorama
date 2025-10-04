import { FC, useState, useEffect } from "react";

import { Button } from "../Button";
import { StreamBoxInner } from "../StreamBox/StreamBoxInner";

type Props = {
  onClose: () => void;
  onUp?: () => void;
  onDown?: () => void;
  color: string;
};

export const ClockBox: FC<Props> = ({ onClose, onUp, onDown, color }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const formatTime = (date: Date) => {
    if (is24Hour) {
      return date.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } else {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    }
  };

  const formatDate = (date: Date) => {
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
    <StreamBoxInner
      contentWidth={350}
      contentHeight={180}
      mode='resize'
      borderColor={color}
      buttons={
        <div className={`
          pointer-events-none absolute top-0 right-0 flex flex-row gap-2 p-4
        `}>
          <Button
            className='pointer-events-auto'
            iconType='move_up'
            iconColor={color}
            onClick={onUp}
            title='前面に移動'
          />
          <Button
            className='pointer-events-auto'
            iconType='move_down'
            iconColor={color}
            onClick={onDown}
            title='背面に移動'
          />
          <Button
            className='pointer-events-auto'
            iconType='close'
            iconColor={color}
            onClick={onClose}
            title='閉じる'
          />
        </div>
      }
    >
      <div
        className='flex h-full w-full flex-col items-center justify-center p-4'
        style={{
          backgroundColor: lightColor,
          border: `2px solid ${darkColor}`,
        }}
      >
        <div className='mb-2 font-mono text-5xl font-bold'>
          {formatTime(currentTime)}
        </div>

        <div className='mb-4 text-lg text-gray-700'>
          {formatDate(currentTime)}
        </div>

        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className={`
            rounded bg-gray-600 px-3 py-1 text-sm text-white
            hover:bg-gray-700
          `}
        >
          {is24Hour ? "12時間表示" : "24時間表示"}
        </button>
      </div>
    </StreamBoxInner>
  );
};
