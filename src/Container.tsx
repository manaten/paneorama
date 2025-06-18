import { FC, useCallback, useState } from "react";

import { MainCanvas } from "./components/MainCanvas";
import { StreamBox } from "./components/StreamBox";
import { swap } from "./utils/array";
import { getPastelColor } from "./utils/colors";

const displayMediaOptions = {
  video: {
    displaySurface: "window",
  },
  audio: false,
} as const satisfies DisplayMediaStreamOptions;

type MediaItem = {
  id: string;
  media: MediaStream;
  color: string;
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
          color: getPastelColor(prev.length),
        },
      ]);
    } catch (_) {
      // noop
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
      return swap(prev, currentIndex, currentIndex + 1);
    });
  }, []);

  const clickMoveDownHandler = useCallback((id: string) => {
    setMediaItems((prev) => {
      const currentIndex = prev.findIndex((item) => item.id === id);
      return swap(prev, currentIndex, currentIndex - 1);
    });
  }, []);

  const clickSwitchVideoHandler = useCallback(async (id: string) => {
    try {
      // 新しいストリームを取得
      const newCaptureStream =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      setMediaItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            // 古いストリームを停止
            item.media.getTracks().forEach((track) => track.stop());
            // 新しいストリームに置き換え
            return { ...item, media: newCaptureStream };
          }
          return item;
        }),
      );
    } catch (_) {
      // noop
    }
  }, []);

  return (
    <MainCanvas onClickAdd={clickAddHandler} isEmpty={mediaItems.length === 0}>
      {mediaItems.map((item) => (
        <StreamBox
          key={item.id}
          {...item}
          onClickClose={clickCloseHandler}
          onClickMoveUp={clickMoveUpHandler}
          onClickMoveDown={clickMoveDownHandler}
          onClickSwitchVideo={clickSwitchVideoHandler}
        />
      ))}
    </MainCanvas>
  );
};
