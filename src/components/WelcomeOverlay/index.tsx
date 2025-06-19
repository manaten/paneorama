"use client";

import classNames from "classnames";
import { FC } from "react";

import { useInstallPrompt } from "../../hooks/useInstallPrompt";

interface Props {
  className?: string;
}

export const WelcomeOverlay: FC<Props> = ({ className }) => {
  const { isInstallable, promptInstall } = useInstallPrompt();

  const handleInstallClick = async () => {
    const installed = await promptInstall();
    if (installed) {
      console.log("App installed successfully");
    }
  };

  return (
    <div
      className={classNames(
        "pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center",
        className,
      )}
    >
      {/* Main content */}
      <div className='mx-auto max-w-xl px-8 text-center'>
        {/* Logo/Title */}
        <div className='mb-8'>
          <h1 className='mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-bold text-transparent'>
            Paneorama
          </h1>
          <p className='text-lg font-medium text-slate-700'>
            Screen pane manager for streaming
          </p>
        </div>

        {/* Tutorial Steps */}
        <div className='mb-8 space-y-4'>
          <div className='flex items-center justify-center space-x-3 text-slate-600'>
            <div className='flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-xs font-bold text-white'>
              1
            </div>
            <span className='text-base'>
              Capture multiple screens or windows
            </span>
          </div>

          <div className='flex items-center justify-center space-x-3 text-slate-600'>
            <div className='flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-xs font-bold text-white'>
              2
            </div>
            <span className='text-base'>Drag and resize freely</span>
          </div>

          <div className='flex items-center justify-center space-x-3 text-slate-600'>
            <div className='flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold text-white'>
              3
            </div>
            <span className='text-base'>Control layers and switch sources</span>
          </div>
        </div>

        {/* Call to action */}
        <div className='flex items-center justify-center'>
          <div className='flex flex-col items-center'>
            <p className='mb-2 text-base font-medium text-slate-700'>
              Click the + button to start capturing
            </p>
            <div className='flex items-center space-x-1 text-xs text-slate-500'>
              <span>Look for the button in the top-right corner</span>
              <span className='text-blue-500'>↗</span>
            </div>

            {/* PWA Install Tip */}
            {isInstallable && (
              <div className='mt-4 flex flex-col items-center'>
                <p className='mb-2 text-sm font-medium text-slate-700'>
                  Install the app for a better experience
                </p>
                <button
                  onClick={handleInstallClick}
                  className='pointer-events-auto px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-300 hover:border-slate-400 rounded-md bg-transparent transition-colors cursor-pointer'
                >
                  Install App
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className='absolute left-1/4 top-1/4 size-20 animate-pulse rounded-full bg-gradient-to-r from-pink-200 to-purple-200 opacity-30 blur-xl delay-700' />
      <div className='absolute bottom-1/4 right-1/4 size-24 animate-pulse rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 opacity-30 blur-xl delay-1000' />
    </div>
  );
};
