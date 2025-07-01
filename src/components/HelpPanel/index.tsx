import classNames from "classnames";
import { FC, useState } from "react";

import { Button } from "../Button";

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const helpSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "🚀",
    content: [
      {
        title: "Start Your First Capture",
        description:
          "Click the + button in the top-right corner to begin capturing your screen or window.",
        tips: [
          "Choose the screen/window you want to capture",
          "Grant permission when prompted by your browser",
        ],
      },
      {
        title: "Position Your Windows",
        description:
          "Drag and resize captured windows to arrange them perfectly for your presentation.",
        tips: [
          "Click and drag to move windows",
          "Drag corners to resize",
          "Use layer controls to bring windows forward or backward",
        ],
      },
    ],
  },
  {
    id: "controls",
    title: "Stream Controls",
    icon: "🎮",
    content: [
      {
        title: "Window Controls",
        description:
          "Each captured window has its own set of controls that appear on hover:",
        tips: [
          "🔄 Switch Video: Change the source to a different screen/window",
          "⬆️ Bring Forward: Move this window in front of others",
          "⬇️ Send Back: Move this window behind others",
          "✂️ Crop/Resize: Toggle between crop and resize modes",
          "❌ Close: Stop capturing and remove this window",
        ],
      },
      {
        title: "Resize vs Crop Mode",
        description: "Choose how you want to adjust your captured content:",
        tips: [
          "Resize Mode: Scale the entire content while maintaining aspect ratio",
          "Crop Mode: Show only a portion of the content at full resolution",
          "Click the crop/resize button to switch between modes",
        ],
      },
    ],
  },
  {
    id: "tips",
    title: "Pro Tips",
    icon: "💡",
    content: [
      {
        title: "Presentation Best Practices",
        description: "Make your presentations more engaging:",
        tips: [
          "Use multiple screens to show different applications simultaneously",
          "Arrange windows in a logical flow for your presentation",
          "Test your setup before going live",
          "Use crop mode to focus on specific parts of applications",
        ],
      },
      {
        title: "Performance Optimization",
        description: "Get the best performance from Paneorama:",
        tips: [
          "Close unnecessary applications to free up system resources",
          "Use lower resolution captures for better performance",
          "Limit the number of simultaneous captures if experiencing lag",
          "Install as PWA for better performance and offline access",
        ],
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: "🔧",
    content: [
      {
        title: "Common Issues",
        description: "Solutions to frequently encountered problems:",
        tips: [
          "Can't see capture button: Make sure you're using a modern browser (Chrome, Edge, Firefox)",
          "Permission denied: Check browser settings and allow screen capture permissions",
          "Poor performance: Try reducing the number of active captures or lowering resolution",
          "Audio not working: Audio capture is disabled by default for privacy",
        ],
      },
      {
        title: "Browser Compatibility",
        description: "Paneorama works best with:",
        tips: [
          "✅ Chrome 72+",
          "✅ Edge 79+",
          "✅ Firefox 66+",
          "✅ Safari 13+ (limited support)",
          "❌ Internet Explorer (not supported)",
        ],
      },
    ],
  },
];

export const HelpPanel: FC<Props> = ({ className, isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState("getting-started");

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
            <h2 className='text-2xl font-bold text-white'>
              Help & Documentation
            </h2>
          </div>
          <Button
            iconType='close'
            onClick={onClose}
            className='pointer-events-auto'
            title='Close Help'
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
