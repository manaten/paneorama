"use client";

import { FC, useCallback, useState } from "react";

import { MainCanvas } from "./_components/MainCanvas";
import { StreamBox } from "./_components/StreamBox";

const displayMediaOptions = {
  video: {
    displaySurface: "window",
  },
  audio: false,
} as const satisfies DisplayMediaStreamOptions;

type MediaItem = {
  id: string;
  media: MediaStream;
};

export const Container: FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const clickAddHandler = useCallback(async () => {
    try {
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
      const captureStream =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      setMediaItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          media: captureStream,
        },
      ]);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }, []);

  const clickCloseHandler = useCallback((id: string) => {
    setMediaItems((prev) => {
      const item = prev.find((item) => item.id === id);
      item?.media.getTracks().forEach((track) => track.stop());

      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const clickMoveUpHandler = useCallback((id: string) => {
    setMediaItems((prev) => {
      const currentIndex = prev.findIndex((item) => item.id === id);
      if (currentIndex === -1 || currentIndex === prev.length - 1) return prev;

      const currentItem = prev[currentIndex];
      const nextItem = prev[currentIndex + 1];

      if (!currentItem || !nextItem) return prev;

      return prev.map((item, index) => {
        if (index === currentIndex) return nextItem;
        if (index === currentIndex + 1) return currentItem;
        return item;
      });
    });
  }, []);

  const clickMoveDownHandler = useCallback((id: string) => {
    setMediaItems((prev) => {
      const currentIndex = prev.findIndex((item) => item.id === id);
      if (currentIndex === -1 || currentIndex === 0) return prev;

      const currentItem = prev[currentIndex];
      const prevItem = prev[currentIndex - 1];

      if (!currentItem || !prevItem) return prev;

      return prev.map((item, index) => {
        if (index === currentIndex - 1) return currentItem;
        if (index === currentIndex) return prevItem;
        return item;
      });
    });
  }, []);

  return (
    <MainCanvas onClickAdd={clickAddHandler}>
      {mediaItems.map((item) => (
        <StreamBox
          key={item.id}
          {...item}
          onClickClose={clickCloseHandler}
          onClickMoveUp={clickMoveUpHandler}
          onClickMoveDown={clickMoveDownHandler}
        />
      ))}
    </MainCanvas>
  );
};
