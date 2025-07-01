import classNames from "classnames";
import { FC, useState, useEffect } from "react";

import { t } from "../../i18n";
import { Button } from "../Button";

interface Props {
  className?: string;
  isEmpty: boolean;
  onClose: () => void;
}

const getTutorialSteps = () => [
  {
    id: "welcome",
    title: t("tutorial.welcome"),
    description: t("tutorial.welcomeDesc"),
    position: "center",
    highlight: null,
    action: null,
  },
  {
    id: "add-button",
    title: t("tutorial.startFirstCapture"),
    description: t("tutorial.startFirstCaptureDesc"),
    position: "top-right",
    highlight: "add-button",
    action: "click-add",
  },
  {
    id: "permission",
    title: t("tutorial.grantPermissions"),
    description: t("tutorial.grantPermissionsDesc"),
    position: "center",
    highlight: null,
    action: null,
  },
  {
    id: "choose-source",
    title: t("tutorial.chooseSource"),
    description: t("tutorial.chooseSourceDesc"),
    position: "center",
    highlight: null,
    action: null,
  },
  {
    id: "controls",
    title: t("tutorial.hoverControls"),
    description: t("tutorial.hoverControlsDesc"),
    position: "center",
    highlight: "stream-controls",
    action: null,
  },
  {
    id: "complete",
    title: t("tutorial.complete"),
    description: t("tutorial.completeDesc"),
    position: "center",
    highlight: null,
    action: null,
  },
];

export const InteractiveTutorial: FC<Props> = ({
  className,
  isEmpty,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const tutorialSteps = getTutorialSteps();

  useEffect(() => {
    // Auto-start tutorial for first-time users
    const hasSeenTutorial = localStorage.getItem("paneorama-tutorial-seen");
    if (!hasSeenTutorial && isEmpty) {
      setIsVisible(true);
    }
  }, [isEmpty]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("paneorama-tutorial-seen", "true");
    setIsVisible(false);
    setCurrentStep(0);
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem("paneorama-tutorial-seen", "true");
    setIsVisible(false);
    setCurrentStep(0);
    onClose();
  };

  const startTutorial = () => {
    setHasStarted(true);
    setCurrentStep(1);
  };

  if (!isVisible) return null;

  const currentStepData = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  if (!currentStepData) return null;

  return (
    <div
      className={classNames(
        "fixed inset-0 z-50 pointer-events-none",
        className,
      )}
    >
      {/* Overlay with highlight cutout */}
      <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' />

      {/* Tutorial Content */}
      <div
        className={classNames(
          "absolute pointer-events-auto",
          currentStepData.position === "center" &&
            "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          currentStepData.position === "top-right" && "top-24 right-8",
          currentStepData.position === "bottom-left" && "bottom-8 left-8",
        )}
      >
        <div className='glass-effect p-6 rounded-2xl max-w-sm shadow-2xl'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>
                  {currentStep + 1}
                </span>
              </div>
              <div className='text-xs text-white/60'>
                {t("tutorial.step")} {currentStep + 1} {t("tutorial.of")}{" "}
                {tutorialSteps.length}
              </div>
            </div>
            <Button
              iconType='close'
              onClick={handleSkip}
              className='pointer-events-auto opacity-60 hover:opacity-100'
              title={t("tutorial.skipTutorial")}
            />
          </div>

          <h3 className='text-lg font-bold text-white mb-2'>
            {currentStepData.title}
          </h3>

          <p className='text-white/80 text-sm leading-relaxed mb-6'>
            {currentStepData.description}
          </p>

          {isFirstStep && !hasStarted ? (
            <div className='space-y-3'>
              <button
                onClick={startTutorial}
                className='w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105'
              >
                {t("tutorial.startTutorial")}
              </button>
              <button
                onClick={handleSkip}
                className='w-full px-4 py-2 text-white/70 hover:text-white text-sm transition-colors'
              >
                {t("tutorial.skipForNow")}
              </button>
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={classNames(
                  "px-4 py-2 text-sm rounded-lg transition-all duration-300",
                  currentStep === 0
                    ? "text-white/30 cursor-not-allowed"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                {t("tutorial.previous")}
              </button>

              <div className='flex gap-1'>
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={classNames(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentStep ? "bg-purple-400" : "bg-white/20",
                    )}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className='px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm rounded-lg font-medium transition-all duration-300 hover:scale-105'
              >
                {isLastStep ? t("tutorial.finish") : t("tutorial.next")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Directional Arrow for specific highlights */}
      {currentStepData.position === "top-right" && (
        <div className='absolute top-20 right-24 pointer-events-none'>
          <div className='w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-purple-500 animate-bounce' />
        </div>
      )}
    </div>
  );
};
