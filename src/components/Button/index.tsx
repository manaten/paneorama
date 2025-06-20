import Add from "@material-design-icons/svg/filled/add.svg?react";
import Close from "@material-design-icons/svg/filled/close.svg?react";
import KeyboardArrowDown from "@material-design-icons/svg/filled/keyboard_arrow_down.svg?react";
import KeyboardArrowUp from "@material-design-icons/svg/filled/keyboard_arrow_up.svg?react";
import SwitchVideo from "@material-design-icons/svg/filled/switch_video.svg?react";
import classNames from "classnames";
import { ComponentPropsWithoutRef, FC, memo } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  className?: string;
  iconType: "add" | "close" | "move_up" | "move_down" | "switch_video";
  iconColor?: string;
}

function getIcon(iconType: Props["iconType"]) {
  switch (iconType) {
    case "add":
      return Add;
    case "close":
      return Close;
    case "move_up":
      return KeyboardArrowUp;
    case "move_down":
      return KeyboardArrowDown;
    case "switch_video":
      return SwitchVideo;
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
        "block rounded-full bg-slate-950/50 p-1 hover:bg-slate-950/30",
        "transition-bg duration-200 ease-in-out cursor-pointer",
      )}
      {...props}
    >
      <Icon
        className='block size-5 object-contain'
        style={{ fill: iconColor || "white" }}
        viewBox='0 0 24 24'
      />
    </button>
  );
});
