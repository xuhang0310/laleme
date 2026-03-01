# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
npm install

# Development server (H5)
npm run dev:h5

# Development server for WeChat Mini Program
npm run dev:mp-weixin

# Build for production (H5)
npm run build:h5

# Build for WeChat Mini Program
npm run build:mp-weixin

# Build for other platforms
npm run dev:mp-alipay    # Alipay
npm run dev:mp-baidu     # Baidu
npm run dev:mp-toutiao   # Toutiao
```

## Project Architecture

**Framework**: uni-app (Vue 3 + Vite) - Cross-platform mobile app framework that compiles to WeChat Mini Program, H5, and other platforms.

**State Management**: Pinia with `pinia-plugin-unistorage` for automatic localStorage persistence.

### Directory Structure

- `src/` - Source code
  - `pages/` - Page components (file-based routing via `pages.json`)
  - `components/` - Reusable Vue components
  - `stores/` - Pinia store modules
  - `static/` - Static assets (images, icons)
  - `main.js` - App entry point
  - `App.vue` - Root component with lifecycle hooks
  - `pages.json` - Page routes and navigation config
  - `manifest.json` - App configuration (appid, permissions, platform settings)
- `vite.config.js` - Vite configuration
- `package.json` - Dependencies and scripts

### Core Stores

- `stores/pet.js` - Pet state (hunger, exp, level, status) with passive hunger decay over time
- `stores/user.js` - User resources (food balance, pending rewards, daily limits)

### Key Patterns

- **rpx units**: All styles use `rpx` (responsive pixels) for cross-device scaling
- **uni API**: Use `uni.*` APIs (e.g., `uni.getStorageSync`, `uni.navigateTo`) for platform-native functionality
- **Custom navigation**: Most pages use `"navigationStyle": "custom"` for full control over header
- **Component imports**: Use `@/` alias for `src/` directory

### Platform Targets

Primary deployment is WeChat Mini Program (`mp-weixin`), with H5 as secondary.
