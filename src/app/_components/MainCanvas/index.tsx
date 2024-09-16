"use client";

import classNames from "classnames";
import { FC, PropsWithChildren } from "react";

import { Button } from "../Button";

type Props = PropsWithChildren<{
  className?: string;
  onClickAdd?: () => void;
}>;

export const MainCanvas: FC<Props> = ({ className, children, onClickAdd }) => {
  return (
    <div
      className={classNames("group/main relative size-full h-screen overflow-hidden", className)}
    >
      <div
        className={classNames(
          "pointer-events-none fixed right-0 top-0 z-50 flex-row gap-4 p-4",
          "transition-opacity duration-200 ease-in-out",
          "opacity-0 group-hover/main:opacity-100",
        )}
      >
        <Button className="pointer-events-auto" iconType="add" onClick={onClickAdd} />
      </div>

      <div className="size-full overflow-hidden">{children}</div>
    </div>
  );
};
