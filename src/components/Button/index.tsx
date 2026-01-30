import Add from "@material-design-icons/svg/filled/add.svg?react";
import Close from "@material-design-icons/svg/filled/close.svg?react";
import Crop from "@material-design-icons/svg/filled/crop.svg?react";
import FullscreenExit from "@material-design-icons/svg/filled/fullscreen_exit.svg?react";
import Help from "@material-design-icons/svg/filled/help.svg?react";
import Image from "@material-design-icons/svg/filled/image.svg?react";
import KeyboardArrowDown from "@material-design-icons/svg/filled/keyboard_arrow_down.svg?react";
import KeyboardArrowUp from "@material-design-icons/svg/filled/keyboard_arrow_up.svg?react";
import Note from "@material-design-icons/svg/filled/note.svg?react";
import Schedule from "@material-design-icons/svg/filled/schedule.svg?react";
import SwitchVideo from "@material-design-icons/svg/filled/switch_video.svg?react";
import Timer from "@material-design-icons/svg/filled/timer.svg?react";
import classNames from "classnames";
import { FC, HTMLAttributes, memo } from "react";

type IconType =
  | "add"
  | "close"
  | "crop"
  | "fullscreen_exit"
  | "help"
  | "image"
  | "move_up"
  | "move_down"
  | "note"
  | "switch_video"
  | "timer"
  | "schedule";

interface Props extends HTMLAttributes<HTMLElement> {
  as?: "button" | "span";
  iconType: IconType;
  iconColor?: string;
}

const ICON: Record<IconType, FC<React.SVGProps<SVGSVGElement>>> = {
  add: Add,
  close: Close,
  crop: Crop,
  fullscreen_exit: FullscreenExit,
  help: Help,
  image: Image,
  move_up: KeyboardArrowUp,
  move_down: KeyboardArrowDown,
  note: Note,
  switch_video: SwitchVideo,
  timer: Timer,
  schedule: Schedule,
};

export const Button: FC<Props> = memo(function Button({
  as: Component = "button",
  className,
  iconType,
  iconColor,
  ...props
}) {
  const Icon = ICON[iconType];

  return (
    <Component
      className={classNames(
        className,
        "block rounded-full bg-slate-950/80 p-2 hover:bg-slate-950/50",
        "transition-bg duration-200 ease-in-out cursor-pointer",
      )}
      {...props}
    >
      <Icon
        className='block size-5 object-contain'
        style={{ fill: iconColor || "white" }}
        viewBox='0 0 24 24'
      />
    </Component>
  );
});
