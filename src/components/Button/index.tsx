import Add from "@material-design-icons/svg/filled/add.svg?react";
import Close from "@material-design-icons/svg/filled/close.svg?react";
import Crop from "@material-design-icons/svg/filled/crop.svg?react";
import FullscreenExit from "@material-design-icons/svg/filled/fullscreen_exit.svg?react";
import Help from "@material-design-icons/svg/filled/help.svg?react";
import KeyboardArrowDown from "@material-design-icons/svg/filled/keyboard_arrow_down.svg?react";
import KeyboardArrowUp from "@material-design-icons/svg/filled/keyboard_arrow_up.svg?react";
import SwitchVideo from "@material-design-icons/svg/filled/switch_video.svg?react";
import classNames from "classnames";
import { ComponentPropsWithoutRef, FC, memo } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  className?: string;
  iconType:
    | "add"
    | "close"
    | "crop"
    | "fullscreen_exit"
    | "help"
    | "move_up"
    | "move_down"
    | "switch_video";
  iconColor?: string;
}

function getIcon(iconType: Props["iconType"]) {
  switch (iconType) {
    case "add":
      return Add;
    case "close":
      return Close;
    case "crop":
      return Crop;
    case "fullscreen_exit":
      return FullscreenExit;
    case "help":
      return Help;
    case "move_up":
      return KeyboardArrowUp;
    case "move_down":
      return KeyboardArrowDown;
    case "switch_video":
      return SwitchVideo;
    default:
      return Add;
  }
}

export const Button: FC<Props> = memo(function Button({
  className,
  iconType,
  iconColor,
  ...props
}) {
  const Icon = getIcon(iconType);

  return (
    <button
      className={classNames(
        className,
        "group relative block rounded-full p-3",
        "glass-effect-dark hover:glass-effect",
        "transition-all duration-300 ease-out cursor-pointer",
        "hover:scale-110 hover:shadow-lg",
        "active:scale-95",
        "before:absolute before:inset-0 before:rounded-full",
        "before:bg-gradient-to-r before:from-white/10 before:to-white/5",
        "before:opacity-0 hover:before:opacity-100",
        "before:transition-opacity before:duration-300",
      )}
      {...props}
    >
      <Icon
        className={classNames(
          "block size-5 object-contain transition-all duration-300",
          "group-hover:drop-shadow-sm",
        )}
        style={{ fill: iconColor || "white" }}
        viewBox='0 0 24 24'
      />
    </button>
  );
});
