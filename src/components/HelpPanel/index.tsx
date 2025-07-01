import classNames from "classnames";
import { FC, useState } from "react";

import { t } from "../../i18n";
import { Button } from "../Button";

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const getHelpSections = () => [
  {
    id: "getting-started",
    title: t("help.gettingStarted"),
    icon: "🚀",
    content: [
      {
        title: t("help.startFirstCapture"),
        description: t("help.startFirstCaptureDesc"),
        tips: [
          t("help.startFirstCaptureTip1"),
          t("help.startFirstCaptureTip2"),
        ],
      },
      {
        title: t("help.positionWindows"),
        description: t("help.positionWindowsDesc"),
        tips: [
          t("help.positionWindowsTip1"),
          t("help.positionWindowsTip2"),
          t("help.positionWindowsTip3"),
        ],
      },
    ],
  },
  {
    id: "controls",
    title: t("help.streamControls"),
    icon: "🎮",
    content: [
      {
        title: t("help.windowControls"),
        description: t("help.windowControlsDesc"),
        tips: [
          t("help.windowControlsTip1"),
          t("help.windowControlsTip2"),
          t("help.windowControlsTip3"),
          t("help.windowControlsTip4"),
          t("help.windowControlsTip5"),
        ],
      },
      {
        title: t("help.resizeVsCrop"),
        description: t("help.resizeVsCropDesc"),
        tips: [
          t("help.resizeVsCropTip1"),
          t("help.resizeVsCropTip2"),
          t("help.resizeVsCropTip3"),
        ],
      },
    ],
  },
  {
    id: "tips",
    title: t("help.proTips"),
    icon: "💡",
    content: [
      {
        title: t("help.presentationBestPractices"),
        description: t("help.presentationBestPracticesDesc"),
        tips: [
          t("help.presentationBestPracticesTip1"),
          t("help.presentationBestPracticesTip2"),
          t("help.presentationBestPracticesTip3"),
          t("help.presentationBestPracticesTip4"),
        ],
      },
      {
        title: t("help.performanceOptimization"),
        description: t("help.performanceOptimizationDesc"),
        tips: [
          t("help.performanceOptimizationTip1"),
          t("help.performanceOptimizationTip2"),
          t("help.performanceOptimizationTip3"),
          t("help.performanceOptimizationTip4"),
        ],
      },
    ],
  },
  {
    id: "troubleshooting",
    title: t("help.troubleshooting"),
    icon: "🔧",
    content: [
      {
        title: t("help.commonIssues"),
        description: t("help.commonIssuesDesc"),
        tips: [
          t("help.commonIssuesTip1"),
          t("help.commonIssuesTip2"),
          t("help.commonIssuesTip3"),
          t("help.commonIssuesTip4"),
        ],
      },
      {
        title: t("help.browserCompatibility"),
        description: t("help.browserCompatibilityDesc"),
        tips: [
          t("help.browserCompatibilityTip1"),
          t("help.browserCompatibilityTip2"),
          t("help.browserCompatibilityTip3"),
          t("help.browserCompatibilityTip4"),
          t("help.browserCompatibilityTip5"),
        ],
      },
    ],
  },
];

export const HelpPanel: FC<Props> = ({ className, isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const helpSections = getHelpSections();

  if (!isOpen) return null;

  return (
    <div
      className={classNames(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-sm",
        className,
      )}
      onClick={onClose}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClose();
        }
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className='glass-effect max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden'
        onClick={(e) => e.stopPropagation()}
        aria-label='Help Panel'
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-white/10'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>📚</span>
            </div>
            <h2 className='text-2xl font-bold text-white'>{t("help.title")}</h2>
          </div>
          <Button
            iconType='close'
            onClick={onClose}
            className='pointer-events-auto'
            title={t("help.close")}
          />
        </div>

        <div className='flex h-[calc(90vh-120px)]'>
          {/* Sidebar */}
          <div className='w-64 border-r border-white/10 p-4 overflow-y-auto'>
            <nav className='space-y-2'>
              {helpSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={classNames(
                    "w-full text-left p-3 rounded-lg transition-all duration-200",
                    "flex items-center gap-3",
                    activeSection === section.id
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span className='text-lg'>{section.icon}</span>
                  <span className='font-medium'>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className='flex-1 p-6 overflow-y-auto'>
            {helpSections
              .filter((section) => section.id === activeSection)
              .map((section) => (
                <div key={section.id} className='space-y-8'>
                  <div className='flex items-center gap-3 mb-6'>
                    <span className='text-2xl'>{section.icon}</span>
                    <h3 className='text-2xl font-bold text-white'>
                      {section.title}
                    </h3>
                  </div>

                  {section.content.map((item, index) => (
                    <div key={index} className='space-y-4'>
                      <h4 className='text-lg font-semibold text-white/90'>
                        {item.title}
                      </h4>
                      <p className='text-white/70 leading-relaxed'>
                        {item.description}
                      </p>

                      {item.tips && (
                        <div className='space-y-2'>
                          {item.tips.map((tip, tipIndex) => (
                            <div
                              key={tipIndex}
                              className='flex items-start gap-3 p-3 bg-white/5 rounded-lg'
                            >
                              <div className='w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0' />
                              <span className='text-white/80 text-sm leading-relaxed'>
                                {tip}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
