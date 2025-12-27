import ExpoModulesCore

#if canImport(FoundationModels)
import FoundationModels
#endif

public class AppleIntelligenceModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AppleIntelligence")

    // Check if Apple Intelligence is available on this device
    AsyncFunction("isAvailable") { () -> Bool in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        let model = SystemLanguageModel.default
        return model.isAvailable
      }
      #endif
      return false
    }

    // Get availability status with more details
    AsyncFunction("getAvailabilityStatus") { () -> [String: Any] in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        let model = SystemLanguageModel.default
        let availability = model.availability
        
        switch availability {
        case .available:
          return [
            "status": "available",
            "isAvailable": true,
            "message": "Apple Intelligence is ready to use"
          ]
        case .unavailable(let reason):
          let reasonString = String(describing: reason)
          let message = "Apple Intelligence is not available: \(reasonString)"
          
          return [
            "status": "unavailable",
            "isAvailable": false,
            "reason": reasonString,
            "message": message
          ]
        @unknown default:
          return [
            "status": "unknown",
            "isAvailable": false,
            "message": "Unknown availability status"
          ]
        }
      }
      #endif
      return [
        "status": "unsupported",
        "isAvailable": false,
        "message": "This iOS version does not support Foundation Models (requires iOS 26+)"
      ]
    }

    // Generate a response from the on-device LLM
    AsyncFunction("generateResponse") { (prompt: String) -> [String: Any] in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        let model = SystemLanguageModel.default
        
        guard model.isAvailable else {
          return [
            "success": false,
            "error": "Apple Intelligence is not available on this device"
          ]
        }
        
        do {
          let session = LanguageModelSession()
          let response = try await session.respond(to: prompt)
          
          return [
            "success": true,
            "response": response.content
          ]
        } catch {
          return [
            "success": false,
            "error": error.localizedDescription
          ]
        }
      }
      #endif
      return [
        "success": false,
        "error": "Foundation Models framework is not available (requires iOS 26+)"
      ]
    }
  }
}
