import { NativeModule, requireNativeModule } from 'expo-modules-core';

export interface AvailabilityStatus {
  status: 'available' | 'unavailable' | 'unsupported' | 'unknown';
  isAvailable: boolean;
  reason?: string;
  message: string;
}

export interface GenerateResponseResult {
  success: boolean;
  response?: string;
  error?: string;
}

interface AppleIntelligenceModuleType extends NativeModule {
  isAvailable(): Promise<boolean>;
  getAvailabilityStatus(): Promise<AvailabilityStatus>;
  generateResponse(prompt: string): Promise<GenerateResponseResult>;
}

// This will throw an error on Android or if the module isn't available
let AppleIntelligenceModule: AppleIntelligenceModuleType | null = null;
let moduleLoadError: string | null = null;

try {
  AppleIntelligenceModule = requireNativeModule<AppleIntelligenceModuleType>('AppleIntelligence');
} catch (error) {
  // Module not available (e.g., on Android or web, or not yet built)
  moduleLoadError = error instanceof Error ? error.message : 'Unknown error loading native module';
  console.warn('[AppleIntelligence] Native module not loaded:', moduleLoadError);
}

/**
 * Check if Apple Intelligence is available on the current device
 */
export async function isAvailable(): Promise<boolean> {
  if (!AppleIntelligenceModule) {
    return false;
  }
  return AppleIntelligenceModule.isAvailable();
}

/**
 * Get detailed availability status including reasons for unavailability
 */
export async function getAvailabilityStatus(): Promise<AvailabilityStatus> {
  if (!AppleIntelligenceModule) {
    return {
      status: 'unsupported',
      isAvailable: false,
      message: moduleLoadError 
        ? `Native module failed to load: ${moduleLoadError}. Try rebuilding with: npx expo run:ios`
        : 'Apple Intelligence is only available on iOS devices with iOS 26+',
    };
  }
  return AppleIntelligenceModule.getAvailabilityStatus();
}

/**
 * Generate a response using Apple's on-device LLM
 * @param prompt The input prompt to send to the model
 */
export async function generateResponse(prompt: string): Promise<GenerateResponseResult> {
  if (!AppleIntelligenceModule) {
    return {
      success: false,
      error: 'Apple Intelligence is only available on iOS devices with iOS 26+',
    };
  }
  return AppleIntelligenceModule.generateResponse(prompt);
}
