import Add from "@material-design-icons/svg/filled/add.svg";
import Close from "@material-design-icons/svg/filled/close.svg";
import KeyboardArrowDown from "@material-design-icons/svg/filled/keyboard_arrow_down.svg";
import KeyboardArrowUp from "@material-design-icons/svg/filled/keyboard_arrow_up.svg";
import classNames from "classnames";
import { ComponentPropsWithoutRef, FC } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  className?: string;
  iconType: "add" | "close" | "move_up" | "move_down";
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
  }
}

export const Button: FC<Props> = ({ className, iconType, ...props }) => {
  const Icon = getIcon(iconType);

  return (
    <button
      className={classNames(
        className,
        "block rounded-full bg-slate-950 bg-opacity-30 p-1 hover:opacity-60",
        "transition-opacity duration-200 ease-in-out",
      )}
      {...props}
    >
      <Icon
        className='block size-5 fill-white object-contain'
        viewBox='0 0 24 24'
      />
    </button>
  );
};
