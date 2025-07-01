"use client";

import classNames from "classnames";
import { FC } from "react";

import Icon from "../../../public/assets/icon.svg?react";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";
import { t } from "../../i18n";

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
      <div className='mx-auto max-w-2xl px-8 text-center animate-float'>
        {/* Logo/Title */}
        <div className='mb-12'>
          <h1 className='mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-6xl font-bold text-transparent flex items-center justify-center gap-4'>
            <Icon className='w-16 h-16 animate-subtle-bounce' />
            <span className='tracking-tight'>Paneorama</span>
          </h1>
          <p className='text-xl font-medium text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed'>
            {t("welcome.subtitle")}
          </p>
        </div>

        {/* Tutorial Steps */}
        <div className='mb-12 space-y-6'>
          <div className='group flex items-center justify-center space-x-4 text-slate-600 dark:text-slate-300 transition-all duration-300 hover:scale-105'>
            <div className='flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-bold text-white shadow-lg group-hover:shadow-xl transition-shadow'>
              1
            </div>
            <span className='text-lg font-medium'>{t("welcome.step1")}</span>
          </div>

          <div className='group flex items-center justify-center space-x-4 text-slate-600 dark:text-slate-300 transition-all duration-300 hover:scale-105'>
            <div className='flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-bold text-white shadow-lg group-hover:shadow-xl transition-shadow'>
              2
            </div>
            <span className='text-lg font-medium'>{t("welcome.step2")}</span>
          </div>

          <div className='group flex items-center justify-center space-x-4 text-slate-600 dark:text-slate-300 transition-all duration-300 hover:scale-105'>
            <div className='flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg group-hover:shadow-xl transition-shadow'>
              3
            </div>
            <span className='text-lg font-medium'>{t("welcome.step3")}</span>
          </div>
        </div>

        {/* Call to action */}
        <div className='flex items-center justify-center'>
          <div className='flex flex-col items-center'>
            <div className='glass-effect p-6 rounded-2xl mb-6'>
              <p className='mb-3 text-lg font-semibold text-slate-700 dark:text-slate-200'>
                {t("welcome.cta")}
              </p>
              <div className='flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400'>
                <span>{t("welcome.ctaHint")}</span>
                <span className='text-blue-500 text-lg animate-pulse'>↗</span>
              </div>
            </div>

            {/* PWA Install Tip */}
            {isInstallable && (
              <div className='flex flex-col items-center'>
                <p className='mb-3 text-base font-medium text-slate-600 dark:text-slate-300 text-center max-w-md'>
                  {t("welcome.installTip")}
                </p>
                <button
                  onClick={handleInstallClick}
                  className='pointer-events-auto px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer'
                  title={t("welcome.installTitle")}
                >
                  {t("welcome.installButton")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced decorative elements */}
      <div className='absolute left-1/4 top-1/4 size-32 animate-float rounded-full bg-gradient-to-r from-pink-300/40 to-purple-300/40 opacity-60 blur-2xl delay-700' />
      <div className='absolute bottom-1/4 right-1/4 size-40 animate-float rounded-full bg-gradient-to-r from-blue-300/40 to-cyan-300/40 opacity-60 blur-2xl delay-1000' />
      <div className='absolute top-1/2 left-1/8 size-16 animate-pulse rounded-full bg-gradient-to-r from-emerald-300/30 to-teal-300/30 opacity-50 blur-xl delay-500' />
      <div className='absolute bottom-1/3 left-3/4 size-20 animate-subtle-bounce rounded-full bg-gradient-to-r from-orange-300/30 to-yellow-300/30 opacity-50 blur-xl delay-1500' />
    </div>
  );
};
