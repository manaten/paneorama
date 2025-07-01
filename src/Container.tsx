import { FC, useCallback, useState } from "react";

import { MainCanvas } from "./components/MainCanvas";
import { StatusIndicator } from "./components/StatusIndicator";
import { StreamBox } from "./components/StreamBox";
import { swap } from "./utils/array";
import { getPastelColor } from "./utils/colors";

const displayMediaOptions = {
  video: {
    displaySurface: "window",
    frameRate: { ideal: 30 },
    width: { ideal: 2000 },
    height: { ideal: 2000 },
  },
  audio: false,
} as const satisfies DisplayMediaStreamOptions;

type MediaItem = {
  id: string;
  media: MediaStream;
  color: string;
  contentWidth: number;
  contentHeight: number;
  // 他のプロパティが必要な場合はここに追加
};

async function captureNewStream() {
  try {
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
    const captureStream =
      await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    const settings = captureStream.getVideoTracks()[0]?.getSettings();
    console.log(settings?.width, settings?.height, settings?.frameRate);

    const originWidth = settings?.width ?? 400;
    const originHeight = settings?.height ?? 300;

    const { contentWidth, contentHeight } =
      originWidth > originHeight
        ? {
            contentWidth: 400,
            contentHeight: (originHeight / originWidth) * 400,
          }
        : {
            contentWidth: (originWidth / originHeight) * 400,
            contentHeight: 400,
          };

    return {
      media: captureStream,
      contentWidth,
      contentHeight,
    };
  } catch (_) {
    return null;
  }
}

export const Container: FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const clickAddHandler = useCallback(async () => {
    const captureStream = await captureNewStream();
    if (!captureStream) {
      return;
    }

    setMediaItems((prev) => [
      ...prev,
      {
        ...captureStream,
        id: crypto.randomUUID(),
        color: getPastelColor(prev.length),
      },
    ]);
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
    // 新しいストリームを取得
    const captureStream = await captureNewStream();
    if (!captureStream) {
      return;
    }

    setMediaItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // 古いストリームを停止
          item.media.getTracks().forEach((track) => track.stop());
          // 新しいストリームに置き換え
          return { ...item, ...captureStream };
        }
        return item;
      }),
    );
  }, []);

  return (
    <>
      <MainCanvas
        onClickAdd={clickAddHandler}
        isEmpty={mediaItems.length === 0}
      >
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

      <StatusIndicator
        streamCount={mediaItems.length}
        isCapturing={mediaItems.some((item) => item.media.active)}
      />
    </>
  );
};
