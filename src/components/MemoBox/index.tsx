import { FC, useState } from "react";

import { BoxControlButtons } from "../BoxControlButtons";
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
};

export const MemoBoxView: FC<MemoBoxViewProps> = ({
  memo,
  color,
  onMemoChange,
}) => {
  return (
    <div
      className={`pointer-events-auto h-full w-full rounded-2xl bg-black/60 p-3`}
    >
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
    </div>
  );
};

export const MemoBox: FC<Props> = ({
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  color,
}) => {
  const [memo, setMemo] = useState("");

  return (
    <FlexibleBox
      contentWidth={DEFAULT_BOX_WIDTH}
      contentHeight={DEFAULT_BOX_HEIGHT}
      mode='resize'
      transparent
      borderColor={color}
      buttons={
        <BoxControlButtons
          color={color}
          onClickMoveUp={onClickMoveUp}
          onClickMoveDown={onClickMoveDown}
          onClickClose={onClickClose}
        />
      }
    >
      <MemoBoxView memo={memo} color={color} onMemoChange={setMemo} />
    </FlexibleBox>
  );
};
