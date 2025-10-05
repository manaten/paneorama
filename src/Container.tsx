import { FC, useCallback, useState } from "react";

import { ClockBox } from "./components/ClockBox";
import { MainCanvas } from "./components/MainCanvas";
import { MemoBox } from "./components/MemoBox";
import { StreamBox } from "./components/StreamBox";
import { TimerBox } from "./components/TimerBox";
import { swap } from "./utils/array";
import { getPastelColor } from "./utils/colors";

const displayMediaOptions = {
  video: {
    displaySurface: "window",
    frameRate: { ideal: 30 },
  },
  audio: false,
} as const satisfies DisplayMediaStreamOptions;

type BaseItem = {
  id: string;
  color: string;
};

type StreamItem = BaseItem & {
  type: "stream";
  media: MediaStream;
};

type OtherItem = BaseItem & {
  type: "timer" | "clock" | "memo";
};

type MediaItem = StreamItem | OtherItem;

async function captureNewStream() {
  try {
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
    const captureStream =
      await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    return {
      media: captureStream,
    };
  } catch (_) {
    return null;
  }
}

const ItemBox: FC<{
  item: MediaItem;
  onClickClose?: (id: string) => void;
  onClickMoveUp?: (id: string) => void;
  onClickMoveDown?: (id: string) => void;
  onClickSwitchVideo?: (id: string) => void;
}> = ({
  item,
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  onClickSwitchVideo,
}) => {
  const closeHandler = useCallback(() => {
    onClickClose?.(item.id);
  }, [item.id, onClickClose]);

  const moveUpHandler = useCallback(() => {
    onClickMoveUp?.(item.id);
  }, [item.id, onClickMoveUp]);

  const moveDownHandler = useCallback(() => {
    onClickMoveDown?.(item.id);
  }, [item.id, onClickMoveDown]);

  const switchVideoHandler = useCallback(() => {
    onClickSwitchVideo?.(item.id);
  }, [item.id, onClickSwitchVideo]);

  switch (item.type) {
    case "stream":
      return (
        <StreamBox
          {...item}
          onClickClose={closeHandler}
          onClickMoveUp={moveUpHandler}
          onClickMoveDown={moveDownHandler}
          onClickSwitchVideo={switchVideoHandler}
        />
      );
    case "timer":
      return (
        <TimerBox
          {...item}
          onClickClose={closeHandler}
          onClickMoveUp={moveUpHandler}
          onClickMoveDown={moveDownHandler}
        />
      );
    case "clock":
      return (
        <ClockBox
          {...item}
          onClickClose={closeHandler}
          onClickMoveUp={moveUpHandler}
          onClickMoveDown={moveDownHandler}
        />
      );
    case "memo":
      return (
        <MemoBox
          {...item}
          onClickClose={closeHandler}
          onClickMoveUp={moveUpHandler}
          onClickMoveDown={moveDownHandler}
        />
      );
  }
};

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
        type: "stream",
        ...captureStream,
        id: crypto.randomUUID(),
        color: getPastelColor(prev.length),
      },
    ]);
  }, []);

  const clickAddOtherItemHandler = useCallback((type: OtherItem["type"]) => {
    setMediaItems((prev) => [
      ...prev,
      {
        type,
        id: crypto.randomUUID(),
        color: getPastelColor(prev.length),
      },
    ]);
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
    <MainCanvas
      onClickAdd={clickAddHandler}
      onClickAddTimer={() => clickAddOtherItemHandler("timer")}
      onClickAddClock={() => clickAddOtherItemHandler("clock")}
      onClickAddMemo={() => clickAddOtherItemHandler("memo")}
      isEmpty={mediaItems.length === 0}
    >
      {mediaItems.map((item) => (
        <ItemBox
          key={item.id}
          item={item}
          onClickClose={clickCloseHandler}
          onClickMoveUp={clickMoveUpHandler}
          onClickMoveDown={clickMoveDownHandler}
          onClickSwitchVideo={clickSwitchVideoHandler}
        />
      ))}
    </MainCanvas>
  );
};
