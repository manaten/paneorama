import { FC, useCallback, useState } from "react";

import { ClockBox } from "./components/ClockBox";
import { MainCanvas } from "./components/MainCanvas";
import { StreamBox } from "./components/StreamBox";
import { TimerBox } from "./components/TimerBox";
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

// type BoxType = "stream" | "timer" | "clock"; // Will be used for future extensions

type BaseItem = {
  id: string;
  color: string;
  contentWidth: number;
  contentHeight: number;
};

type StreamItem = BaseItem & {
  type: "stream";
  media: MediaStream;
};

type TimerItem = BaseItem & {
  type: "timer";
};

type ClockItem = BaseItem & {
  type: "clock";
};

type MediaItem = StreamItem | TimerItem | ClockItem;

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
  const [showAddMenu, setShowAddMenu] = useState(false);

  const clickAddHandler = useCallback(() => {
    setShowAddMenu(true);
  }, []);

  const addStreamHandler = useCallback(async () => {
    const captureStream = await captureNewStream();
    if (!captureStream) {
      return;
    }

    setMediaItems((prev) => [
      ...prev,
      {
        type: "stream",
        ...captureStream,
        id: crypto.randomUUID(),
        color: getPastelColor(prev.length),
      },
    ]);
    setShowAddMenu(false);
  }, []);

  const addTimerHandler = useCallback(() => {
    setMediaItems((prev) => [
      ...prev,
      {
        type: "timer",
        id: crypto.randomUUID(),
        color: getPastelColor(prev.length),
        contentWidth: 300,
        contentHeight: 200,
      },
    ]);
    setShowAddMenu(false);
  }, []);

  const addClockHandler = useCallback(() => {
    setMediaItems((prev) => [
      ...prev,
      {
        type: "clock",
        id: crypto.randomUUID(),
        color: getPastelColor(prev.length),
        contentWidth: 350,
        contentHeight: 180,
      },
    ]);
    setShowAddMenu(false);
  }, []);

  const clickCloseHandler = useCallback((id: string) => {
    setMediaItems((prev) => {
      const item = prev.find((item) => item.id === id);
      if (item?.type === "stream") {
        item.media.getTracks().forEach((track) => track.stop());
      }

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
        if (item.id === id && item.type === "stream") {
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
    <MainCanvas onClickAdd={clickAddHandler} isEmpty={mediaItems.length === 0}>
      {mediaItems.map((item) => {
        switch (item.type) {
          case "stream":
            return (
              <StreamBox
                key={item.id}
                {...item}
                onClickClose={clickCloseHandler}
                onClickMoveUp={clickMoveUpHandler}
                onClickMoveDown={clickMoveDownHandler}
                onClickSwitchVideo={clickSwitchVideoHandler}
              />
            );
          case "timer":
            return (
              <TimerBox
                key={item.id}
                color={item.color}
                onClose={() => clickCloseHandler(item.id)}
                onUp={() => clickMoveUpHandler(item.id)}
                onDown={() => clickMoveDownHandler(item.id)}
              />
            );
          case "clock":
            return (
              <ClockBox
                key={item.id}
                color={item.color}
                onClose={() => clickCloseHandler(item.id)}
                onUp={() => clickMoveUpHandler(item.id)}
                onDown={() => clickMoveDownHandler(item.id)}
              />
            );
        }
      })}

      {showAddMenu && (
        <div className={`
          fixed inset-0 z-50 flex items-center justify-center bg-black/50
        `}>
          <div className='rounded-lg bg-white p-6 shadow-xl'>
            <h2 className='mb-4 text-xl font-bold'>追加するアイテムを選択</h2>
            <div className='flex flex-col gap-3'>
              <button
                onClick={addStreamHandler}
                className={`
                  rounded-lg bg-blue-500 px-6 py-3 text-white transition
                  hover:bg-blue-600
                `}
              >
                画面キャプチャ
              </button>
              <button
                onClick={addTimerHandler}
                className={`
                  rounded-lg bg-green-500 px-6 py-3 text-white transition
                  hover:bg-green-600
                `}
              >
                タイマー
              </button>
              <button
                onClick={addClockHandler}
                className={`
                  rounded-lg bg-purple-500 px-6 py-3 text-white transition
                  hover:bg-purple-600
                `}
              >
                時計
              </button>
              <button
                onClick={() => setShowAddMenu(false)}
                className={`
                  rounded-lg bg-gray-300 px-6 py-3 text-gray-700 transition
                  hover:bg-gray-400
                `}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </MainCanvas>
  );
};
