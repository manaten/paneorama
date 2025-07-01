import classNames from "classnames";
import { FC, PropsWithChildren, useState } from "react";

import { t } from "../../i18n";
import { Button } from "../Button";
import { HelpPanel } from "../HelpPanel";
import { InteractiveTutorial } from "../InteractiveTutorial";
import { KeyboardShortcuts } from "../KeyboardShortcuts";
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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
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
          "pointer-events-none fixed right-0 top-0 z-50 flex flex-row gap-3 p-6",
          "transition-all duration-300 ease-out",
          isEmpty
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 group-hover/main:opacity-100 group-hover/main:scale-100",
        )}
      >
        <Button
          className='pointer-events-auto'
          iconType='help'
          onClick={() => setIsHelpOpen(true)}
          title={t("mainCanvas.help")}
        />
        <Button
          className={classNames(
            "pointer-events-auto relative",
            isEmpty && "animate-soft-glow",
            !isEmpty && "hover:animate-subtle-bounce",
          )}
          iconType='add'
          onClick={onClickAdd}
          title={t("mainCanvas.startCapture")}
        />
        {isEmpty && (
          <div className='absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping' />
        )}
      </div>

      <div className='size-full overflow-hidden relative'>{children}</div>

      <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <InteractiveTutorial isEmpty={isEmpty} onClose={() => {}} />

      <KeyboardShortcuts
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
