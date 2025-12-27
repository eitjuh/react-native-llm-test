# Apple Intelligence Demo

A React Native demo app showcasing Apple's on-device Foundation Models (Apple Intelligence) using Expo.

![Apple Intelligence](https://img.shields.io/badge/Apple-Intelligence-667EEA?style=for-the-badge&logo=apple&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white)

## ✨ Features

- **🔒 Complete Privacy** - All AI processing happens on-device
- **📴 Offline Support** - No internet connection required
- **⚡ Fast Responses** - Leverages Apple Neural Engine
- **🎨 Beautiful UI** - Modern chat interface with animations
- **🌙 Dark Mode** - Automatic light/dark theme support

## 📋 Requirements

### Device Requirements
- iPhone 15 Pro or later / iPad with M1 chip or later
- iOS 26.0 or later (iOS 26 beta as of WWDC 2025)
- Apple Intelligence enabled in Settings > Apple Intelligence & Siri
- Device language set to English (US)

### Development Requirements
- macOS Sequoia or later
- Xcode 26 (beta)
- Node.js 18+
- An Apple Developer account

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a Development Build

Since this app uses native modules (Apple's FoundationModels framework), you cannot use Expo Go. You need to create a development build:

```bash
# Install the Expo dev client
npx expo install expo-dev-client

# Create iOS development build
npx expo run:ios
```

### 3. Run the App

Once the development build is installed on your device/simulator:

```bash
npx expo start --dev-client
```

## 📁 Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx      # Main chat screen
│   │   ├── explore.tsx    # About/features screen
│   │   └── _layout.tsx    # Tab navigation
│   └── _layout.tsx        # Root layout
├── modules/
│   └── apple-intelligence/
│       ├── expo-module.config.json
│       ├── index.ts
│       ├── src/
│       │   └── AppleIntelligence.ts    # TypeScript bindings
│       └── ios/
│           └── AppleIntelligenceModule.swift  # Native Swift code
├── components/            # Reusable UI components
├── constants/             # Theme and configuration
└── hooks/                 # React hooks
```

## 🔧 How It Works

This app uses a custom Expo module to bridge Apple's `FoundationModels` framework to React Native:

1. **Native Module (`AppleIntelligenceModule.swift`)**: Interfaces directly with Apple's `SystemLanguageModel` to check availability and generate responses.

2. **TypeScript Bindings (`AppleIntelligence.ts`)**: Provides a clean API for React Native components to interact with the native module.

3. **Chat UI (`index.tsx`)**: A beautiful chat interface that sends prompts to the on-device LLM and displays streaming responses.

## 📱 Usage

The app provides these main functions:

```typescript
import * as AppleIntelligence from '@/modules/apple-intelligence';

// Check if Apple Intelligence is available
const isAvailable = await AppleIntelligence.isAvailable();

// Get detailed availability status
const status = await AppleIntelligence.getAvailabilityStatus();
// Returns: { status, isAvailable, message, reason? }

// Generate a response
const result = await AppleIntelligence.generateResponse("What is React Native?");
// Returns: { success, response?, error? }

// Generate with streaming
await AppleIntelligence.generateStreamingResponse(
  "Explain quantum computing",
  (chunk) => {
    console.log(chunk.chunk, chunk.isComplete);
  }
);
```

## ⚠️ Important Notes

1. **iOS 26 Beta**: As of this writing, iOS 26 is still in beta. The FoundationModels framework API may change.

2. **Device Compatibility**: Apple Intelligence requires specific hardware (A17 Pro chip or later, M1 chip or later).

3. **Privacy**: All processing is done on-device. Apple does not have access to your prompts or responses.

4. **Android**: This demo is iOS-only. The native module gracefully returns unavailability status on other platforms.

## 🔗 Resources

- [Apple FoundationModels Documentation](https://developer.apple.com/documentation/foundationmodels)
- [WWDC 2025: Meet the Foundation Models framework](https://developer.apple.com/videos/play/wwdc2025/10604)
- [Expo Modules API](https://docs.expo.dev/modules/overview/)

## 📄 License

MIT License - feel free to use this demo as a starting point for your own Apple Intelligence apps!
