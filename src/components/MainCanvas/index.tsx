import classNames from "classnames";
import { FC, PropsWithChildren } from "react";

import { t } from "../../i18n";
import { Button } from "../Button";
import { WelcomeOverlay } from "../WelcomeOverlay";

type Props = PropsWithChildren<{
  className?: string;
  onClickAdd?: () => void;
  isEmpty?: boolean;
}>;

export const MainCanvas: FC<Props> = ({
  className,
  children,
  onClickAdd,
  isEmpty = false,
}) => {
  return (
    <div
      className={classNames(
        "group/main relative size-full h-screen overflow-hidden",
        className,
      )}
    >
      {isEmpty && <WelcomeOverlay />}

      <div
        className={classNames(
          "pointer-events-none fixed right-0 top-0 z-50 flex-row gap-4 p-4",
          "transition-opacity duration-200 ease-in-out",
          isEmpty ? "opacity-100" : "opacity-0 group-hover/main:opacity-100",
        )}
      >
        <Button
          className={classNames(
            "pointer-events-auto",
            isEmpty && "animate-soft-glow",
          )}
          iconType='add'
          onClick={onClickAdd}
          title={t("mainCanvas.startCapture")}
        />
      </div>

      <div className='relative size-full overflow-hidden'>{children}</div>
    </div>
  );
};
