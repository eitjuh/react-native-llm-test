Pod::Spec.new do |s|
  s.name           = 'apple-intelligence'
  s.version        = '1.0.0'
  s.summary        = 'Apple Intelligence module for React Native'
  s.description    = 'Access Apple Foundation Models (on-device LLM) from React Native'
  s.author         = 'Your Name'
  s.license        = { :type => 'MIT' }
  s.homepage       = 'https://github.com/expo/expo'
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.4'
  s.source         = { :git => 'https://github.com/expo/expo.git', :tag => "v#{s.version}" }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = 'ios/**/*.{h,m,mm,swift}'
end
