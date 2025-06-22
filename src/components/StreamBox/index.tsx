import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Mode, StreamBoxData } from "../../types/streamBox";
import { createDefaultStreamBoxData } from "../../utils/streamBoxDisplay";
import { Button } from "../Button";
import { StreamBoxDisplay } from "../StreamBoxDisplay";

interface Props {
  id: string;
  media: MediaStream;
  color: string;
  onClickClose?: (id: string) => void;
  onClickMoveUp?: (id: string) => void;
  onClickMoveDown?: (id: string) => void;
  onClickSwitchVideo?: (id: string) => void;
}

export const StreamBox: FC<Props> = ({
  id,
  media,
  color,
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  onClickSwitchVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // データモデル状態
  const [streamBoxData, setStreamBoxData] = useState<StreamBoxData>(
    createDefaultStreamBoxData(),
  );
  const [mode, setMode] = useState<Mode>("resize");

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && media) {
      // eslint-disable-next-line functional/immutable-data
      videoElement.srcObject = media;
    }

    return () => {
      if (videoElement) {
        // eslint-disable-next-line functional/immutable-data
        videoElement.srcObject = null;
      }
    };
  }, [media]);

  // データ変更ハンドラー
  const handleDataChange = useCallback((newData: StreamBoxData) => {
    setStreamBoxData(newData);
  }, []);

  // モード変更ハンドラー
  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, []);

  const closeHandler = useCallback(() => {
    onClickClose?.(id);
  }, [id, onClickClose]);

  const moveUpHandler = useCallback(() => {
    onClickMoveUp?.(id);
  }, [id, onClickMoveUp]);

  const moveDownHandler = useCallback(() => {
    onClickMoveDown?.(id);
  }, [id, onClickMoveDown]);

  const switchVideoHandler = useCallback(() => {
    onClickSwitchVideo?.(id);
  }, [id, onClickSwitchVideo]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "resize" ? "crop" : "resize"));
  }, []);

  return (
    <div className='relative'>
      {/* リサイズ・クロップ操作コンポーネント */}
      <StreamBoxDisplay
        data={streamBoxData}
        mode={mode}
        borderColor={color}
        interactive={true}
        onDataChange={handleDataChange}
        onModeChange={handleModeChange}
      >
        <video
          ref={videoRef}
          className='size-full pointer-events-none'
          autoPlay
          muted
        />
      </StreamBoxDisplay>

      {/* コントロールボタンレイヤー */}
      <div
        className='absolute pointer-events-none'
        style={{
          left: streamBoxData.containerPosition.x,
          top: streamBoxData.containerPosition.y,
          width: streamBoxData.containerSize.width,
          height: streamBoxData.containerSize.height,
        }}
      >
        <div className='group/video-box size-full'>
          {/* コントロールボタン */}
          <div
            className={classNames(
              "pointer-events-none absolute right-0 top-0 z-50 flex flex-row gap-1 p-2",
              "transition-opacity duration-200 ease-in-out",
              "opacity-0 group-hover/video-box:opacity-100",
            )}
          >
            <Button
              className='pointer-events-auto'
              iconType={mode === "resize" ? "crop" : "fullscreen_exit"}
              iconColor={color}
              onClick={toggleMode}
              title={
                mode === "resize"
                  ? "Switch to crop mode"
                  : "Switch to resize mode"
              }
            />
            <Button
              className='pointer-events-auto'
              iconType='switch_video'
              iconColor={color}
              onClick={switchVideoHandler}
              title='Switch to different screen/window'
            />
            <Button
              className='pointer-events-auto'
              iconType='move_up'
              iconColor={color}
              onClick={moveUpHandler}
              title='Bring to front'
            />
            <Button
              className='pointer-events-auto'
              iconType='move_down'
              iconColor={color}
              onClick={moveDownHandler}
              title='Send to back'
            />
            <Button
              className='pointer-events-auto'
              iconType='close'
              iconColor={color}
              onClick={closeHandler}
              title='Close stream'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
