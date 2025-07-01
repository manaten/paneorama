import classNames from "classnames";
import { FC, useEffect, useState } from "react";

import { Button } from "../Button";

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: "General",
    items: [
      { key: "?", description: "Show keyboard shortcuts" },
      { key: "h", description: "Show help panel" },
      { key: "Esc", description: "Close panels/dialogs" },
      { key: "Space", description: "Add new capture" },
    ],
  },
  {
    category: "Stream Controls",
    items: [
      { key: "Delete", description: "Close selected stream" },
      { key: "↑", description: "Bring stream to front" },
      { key: "↓", description: "Send stream to back" },
      { key: "r", description: "Switch stream source" },
      { key: "m", description: "Toggle resize/crop mode" },
    ],
  },
  {
    category: "Navigation",
    items: [
      { key: "Tab", description: "Select next stream" },
      { key: "Shift + Tab", description: "Select previous stream" },
      { key: "1-9", description: "Select stream by number" },
    ],
  },
];

export const KeyboardShortcuts: FC<Props> = ({
  className,
  isOpen,
  onClose,
}) => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show shortcuts with ? key
      if (event.key === "?" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setShowShortcuts(true);
      }

      // Close with Escape
      if (event.key === "Escape") {
        setShowShortcuts(false);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const finalIsOpen = isOpen || showShortcuts;

  if (!finalIsOpen) return null;

  return (
    <div
      className={classNames(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-sm",
        className,
      )}
      onClick={() => {
        setShowShortcuts(false);
        onClose();
      }}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setShowShortcuts(false);
          onClose();
        }
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className='glass-effect max-w-2xl w-full max-h-[80vh] rounded-2xl overflow-hidden'
        onClick={(e) => e.stopPropagation()}
        aria-label='Keyboard Shortcuts'
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-white/10'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>⌨️</span>
            </div>
            <h2 className='text-2xl font-bold text-white'>
              Keyboard Shortcuts
            </h2>
          </div>
          <Button
            iconType='close'
            onClick={() => {
              setShowShortcuts(false);
              onClose();
            }}
            className='pointer-events-auto'
            title='Close Shortcuts'
          />
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(80vh-120px)]'>
          <div className='space-y-8'>
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className='text-lg font-semibold text-white/90 mb-4 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-purple-400 rounded-full' />
                  {category.category}
                </h3>

                <div className='space-y-3'>
                  {category.items.map((shortcut, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-white/5 rounded-lg'
                    >
                      <span className='text-white/80 text-sm'>
                        {shortcut.description}
                      </span>
                      <div className='flex items-center gap-1'>
                        {shortcut.key.split(" + ").map((key, keyIndex) => (
                          <div
                            key={keyIndex}
                            className='flex items-center gap-1'
                          >
                            {keyIndex > 0 && (
                              <span className='text-white/40 text-xs'>+</span>
                            )}
                            <kbd className='px-2 py-1 bg-white/10 border border-white/20 rounded text-xs font-mono text-white/90'>
                              {key}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer tip */}
          <div className='mt-8 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/20'>
            <p className='text-white/70 text-sm text-center'>
              <span className='font-semibold'>💡 Tip:</span> Press{" "}
              <kbd className='px-1 py-0.5 bg-white/20 rounded text-xs font-mono'>
                ?
              </kbd>{" "}
              anytime to show these shortcuts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
