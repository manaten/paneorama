# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Paneorama is a web-based screen capture management tool for presenters using the Screen Capture API. It allows users to capture multiple screens/windows simultaneously and manage them in a drag-and-drop interface.

Built with Vite + React for fast development and optimized production builds.

## Development Commands

### Core Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Quality Assurance

- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run all linting (ESLint)
- `npm run test` - Run tests with Vitest
- `npm run fix` - Auto-fix linting and formatting issues

### Testing

- Tests are written using Vitest with in-source testing
- Test files are embedded within source files using `if (import.meta.vitest)` blocks
- Run single test: `npm run test -- colors.ts` (example)

## Architecture

### Technology Stack

- **Build Tool**: Vite 5
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: react-rnd for resizable/draggable components
- **Icons**: Material Design Icons SVG
- **Testing**: Vitest with in-source testing

### Core Components Structure

#### Main Application Flow

1. **Container** (`src/Container.tsx`) - Main state management
   - Manages MediaStream collection using Screen Capture API
   - Handles CRUD operations for media items
   - Provides pastel color theming for each stream

2. **MainCanvas** (`src/components/MainCanvas/index.tsx`) - Layout wrapper
   - Provides the main canvas area with hover-based add button
   - Full-screen container for all stream boxes

3. **StreamBox** (`src/components/StreamBox/index.tsx`) - Individual stream display
   - Uses react-rnd for drag/resize functionality
   - Displays video streams with hover controls
   - Controls: close, layer ordering (up/down), stream switching

#### Key Features Implementation

- **Multi-stream capture**: Uses `navigator.mediaDevices.getDisplayMedia()`
- **Layer management**: Array-based z-index control with swap utility
- **Color theming**: HSL-based pastel color system for visual differentiation
- **Stream switching**: Ability to change capture source without recreating component

### File Organization

- `src/components/` - Reusable UI components
- `src/utils/` - Utility functions (array manipulation, color generation)
- Components use index.tsx pattern for clean imports

### Styling Patterns

- Tailwind CSS with custom group hover states
- Color theming via style props for dynamic pastel colors
- Responsive design with fixed positioning for controls

### State Management

- Uses React useState for component-level state
- MediaStream cleanup handled in component lifecycle
- Immutable state updates using functional programming patterns

## Development Notes

### Browser Compatibility

- Requires modern browsers with Screen Capture API support
- Primarily tested on Chrome, Edge, Firefox
- Built with Vite for optimal bundling and fast HMR

### MediaStream Handling

- Always clean up MediaStream tracks when removing items
- Use `track.stop()` to properly release camera/screen resources
