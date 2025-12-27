import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useColorScheme } from '@/hooks/use-color-scheme';

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  delay: number;
  colors: {
    cardBg: string;
    text: string;
    textSecondary: string;
    accent: string;
    border: string;
  };
}

function FeatureCard({ icon, title, description, delay, colors }: FeatureCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(delay)}
      style={[styles.featureCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
    >
      <View style={[styles.featureIcon, { backgroundColor: `${colors.accent}20` }]}>
        <Ionicons name={icon} size={24} color={colors.accent} />
      </View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#0A0A0F' : '#F5F5F7',
    cardBg: isDark ? 'rgba(30, 30, 40, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    text: isDark ? '#FFFFFF' : '#1D1D1F',
    textSecondary: isDark ? '#8E8E93' : '#6E6E73',
    accent: '#0A84FF',
    border: isDark ? 'rgba(84, 84, 88, 0.4)' : 'rgba(0, 0, 0, 0.1)',
    gradientStart: isDark ? '#1A1A2E' : '#667EEA',
    gradientEnd: isDark ? '#16213E' : '#764BA2',
  };

  const features = [
    {
      icon: 'shield-checkmark' as const,
      title: 'Complete Privacy',
      description:
        'All AI processing happens entirely on your device. Your conversations never leave your iPhone or iPad.',
    },
    {
      icon: 'cloud-offline' as const,
      title: 'Works Offline',
      description:
        'No internet connection required. The language model runs locally using Apple Neural Engine.',
    },
    {
      icon: 'flash' as const,
      title: 'Blazing Fast',
      description:
        'Responses are generated instantly using Apple Silicon, with no server round-trips.',
    },
    {
      icon: 'code-slash' as const,
      title: 'Foundation Models',
      description:
        'Built on Apple\'s FoundationModels framework, introduced in iOS 26 at WWDC 2025.',
    },
    {
      icon: 'hardware-chip' as const,
      title: 'Apple Neural Engine',
      description:
        'Leverages the dedicated AI hardware in Apple Silicon for efficient, low-power inference.',
    },
    {
      icon: 'lock-closed' as const,
      title: 'No Data Collection',
      description:
        'Apple does not collect, store, or have access to any of your prompts or AI responses.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View style={styles.logoContainer}>
            <View style={styles.appleIcon}>
              <Ionicons name="information-circle" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>About This Demo</Text>
              <Text style={styles.headerSubtitle}>Apple Intelligence Features</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Apple Intelligence brings powerful on-device AI capabilities while maintaining
            Apple's commitment to privacy.
          </Text>
        </Animated.View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={300 + index * 100}
              colors={colors}
            />
          ))}
        </View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(900)}
          style={[styles.requirementsCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
        >
          <Text style={[styles.requirementsTitle, { color: colors.text }]}>Requirements</Text>
          <View style={styles.requirementsList}>
            {[
              'iPhone 15 Pro or later / iPad with M1 or later',
              'iOS 26.0 or later',
              'Apple Intelligence enabled in Settings',
              'Device language set to English (US)',
            ].map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={20} color="#30D158" />
                <Text style={[styles.requirementText, { color: colors.textSecondary }]}>{req}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(1000)}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            This demo app showcases the integration of Apple's on-device language model using
            the FoundationModels framework and Expo Modules.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appleIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresContainer: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  requirementsCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  requirementsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    fontSize: 15,
    flex: 1,
  },
  footerText: {
    marginTop: 24,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
