import { Link } from "expo-router";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerCopy: string;
  footerLink: string;
  footerHref: "/(auth)/sign-in" | "/(auth)/sign-up";
};

type AuthFieldProps = TextInputProps & {
  label: string;
  error?: string;
  rightElement?: ReactNode;
};

export function AuthLayout({
  title,
  subtitle,
  children,
  footerCopy,
  footerLink,
  footerHref,
}: AuthLayoutProps) {
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-scroll"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">Smart billing</Text>
                </View>
              </View>
              <Text className="auth-title">{title}</Text>
              <Text className="auth-subtitle">{subtitle}</Text>
            </View>

            <View className="auth-card">
              {children}
              <View className="auth-link-row">
                <Text className="auth-link-copy">{footerCopy}</Text>
                <Link href={footerHref} className="auth-link">
                  {footerLink}
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthField({ label, error, rightElement, ...props }: AuthFieldProps) {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <View>
        <TextInput
          {...props}
          className={`auth-input ${error ? "auth-input-error" : ""} ${
            rightElement ? "pr-12" : ""
          }`}
          placeholderTextColor="#08112699"
          accessibilityLabel={label}
        />
        {rightElement ? (
          <View className="absolute inset-y-0 right-3 justify-center">{rightElement}</View>
        ) : null}
      </View>
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
}

export function AuthButton({
  title,
  loading,
  disabled,
  onPress,
}: {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`auth-button ${isDisabled ? "auth-button-disabled" : ""}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color="#081126" />
      ) : (
        <Text className="auth-button-text">{title}</Text>
      )}
    </Pressable>
  );
}

export function getAuthErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "errors" in error) {
    const errors = (error as {
      errors?: { longMessage?: string; message?: string }[];
    }).errors;
    const firstError = errors?.[0];
    if (firstError?.longMessage || firstError?.message) {
      return firstError.longMessage || firstError.message || "Something went wrong.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function validateEmail(email: string) {
  if (!email.trim()) {
    return "Enter your email address.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Enter a valid email address.";
  }

  return undefined;
}

export function validatePassword(password: string) {
  if (!password) {
    return "Enter your password.";
  }

  if (password.length < 8) {
    return "Use at least 8 characters.";
  }

  return undefined;
}
