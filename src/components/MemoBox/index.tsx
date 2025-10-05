import { FC, useState, useRef, useEffect } from "react";

import { Button } from "../Button";
import { FlexibleBox } from "../FlexibleBox";

const DEFAULT_BOX_WIDTH = 400;
const DEFAULT_BOX_HEIGHT = 300;

type Props = {
  onClickClose?: () => void;
  onClickMoveUp?: () => void;
  onClickMoveDown?: () => void;
  color: string;
};

type MemoBoxViewProps = {
  memo: string;
  color: string;
  onMemoChange: (value: string) => void;
  width: number;
  height: number;
};

export const MemoBoxView: FC<MemoBoxViewProps> = ({
  memo,
  color,
  onMemoChange,
  width,
  height,
}) => {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`pointer-events-auto h-full w-full`}
    >
      {/* Background */}
      <rect width={width} height={height} rx={16} fill='#00000099' />

      {/* Textarea */}
      <foreignObject x='10' y='10' width={width - 20} height={height - 20}>
        <textarea
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder='メモを入力...'
          className={`
            h-full w-full resize-none rounded-lg border-2 bg-transparent p-3
            font-sans text-lg text-white placeholder-gray-400 outline-none
          `}
          style={{ borderColor: color }}
        />
      </foreignObject>
    </svg>
  );
};

export const MemoBox: FC<Props> = ({
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  color,
}) => {
  const [memo, setMemo] = useState("");
  const [boxSize, setBoxSize] = useState({
    width: DEFAULT_BOX_WIDTH,
    height: DEFAULT_BOX_HEIGHT,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // FlexibleBoxのサイズ変更を検知
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setBoxSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <FlexibleBox
      contentWidth={DEFAULT_BOX_WIDTH}
      contentHeight={DEFAULT_BOX_HEIGHT}
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
      <div ref={containerRef} className='h-full w-full'>
        <MemoBoxView
          memo={memo}
          color={color}
          onMemoChange={setMemo}
          width={boxSize.width}
          height={boxSize.height}
        />
      </div>
    </FlexibleBox>
  );
};
