import { useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { posthog } from "@/config/posthog";
import {
  AuthButton,
  AuthField,
  AuthLayout,
  getAuthErrorMessage,
  validateEmail,
  validatePassword,
} from "@/components/auth/AuthLayout";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, fetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmation?: string;
    code?: string;
    form?: string;
  }>({});

  const handleSignUp = async () => {
    const nextErrors = {
      email: validateEmail(emailAddress),
      password: validatePassword(password),
      confirmation: confirmation !== password ? "Passwords do not match." : undefined,
    };

    if (nextErrors.email || nextErrors.password || nextErrors.confirmation) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setErrors({ form: getAuthErrorMessage(error) });
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setErrors({ form: getAuthErrorMessage(sendError) });
        return;
      }

      setIsVerifying(true);
    } catch (error) {
      setErrors({ form: getAuthErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setErrors({ code: "Enter the verification code from your email." });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code: code.trim() });

      if (error) {
        setErrors({ form: getAuthErrorMessage(error) });
        return;
      }

      if (signUp.status !== "complete") {
        setErrors({ form: "Your email was verified, but the account needs another step." });
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setErrors({ form: getAuthErrorMessage(finalizeError) });
        return;
      }

      posthog?.capture("user_signed_up");
      router.replace("/(auth)/(tabs)");
    } catch (error) {
      setErrors({ form: getAuthErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (fetchStatus === "fetching" || isSubmitting) {
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) {
        setErrors({ form: getAuthErrorMessage(error) });
        return;
      }

      posthog?.capture("verification_code_resent");
    } catch (error) {
      setErrors({ form: getAuthErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={isVerifying ? "Check your email" : "Create your account"}
      subtitle={
        isVerifying
          ? `We sent a verification code to ${emailAddress.trim()}`
          : "Start organizing every subscription in one place"
      }
      footerCopy="Already have an account?"
      footerLink="Sign in"
      footerHref="/(auth)/sign-in"
    >
      <View className="auth-form">
        {errors.form ? <Text className="auth-error">{errors.form}</Text> : null}
        {isVerifying ? (
          <>
            <AuthField
              label="Verification code"
              value={code}
              onChangeText={setCode}
              onFocus={() => setErrors((current) => ({ ...current, code: undefined, form: undefined }))}
              autoCapitalize="none"
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              placeholder="Enter your code"
              error={errors.code}
            />
            <AuthButton
              title="Verify email"
              loading={isSubmitting}
              disabled={fetchStatus === "fetching"}
              onPress={handleVerify}
            />
            <Text
              className="auth-secondary-button-text self-center"
              onPress={handleResend}
              accessibilityRole="button"
            >
              Resend code
            </Text>
          </>
        ) : (
          <>
            <AuthField
              label="Email"
              value={emailAddress}
              onChangeText={setEmailAddress}
              onFocus={() => setErrors((current) => ({ ...current, email: undefined, form: undefined }))}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="Enter your email"
              error={errors.email}
            />
            <AuthField
              label="Password"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setErrors((current) => ({ ...current, password: undefined, form: undefined }))}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showPassword}
              textContentType="newPassword"
              placeholder="Create a password"
              error={errors.password}
              rightElement={
                <Text
                  className="text-xs font-sans-bold text-accent"
                  onPress={() => setShowPassword((visible) => !visible)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </Text>
              }
            />
            <AuthField
              label="Confirm password"
              value={confirmation}
              onChangeText={setConfirmation}
              onFocus={() => setErrors((current) => ({ ...current, confirmation: undefined, form: undefined }))}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showPassword}
              textContentType="newPassword"
              placeholder="Repeat your password"
              error={errors.confirmation}
            />
            <AuthButton
              title="Create account"
              loading={isSubmitting}
              disabled={fetchStatus === "fetching"}
              onPress={handleSignUp}
            />
            <View nativeID="clerk-captcha" />
          </>
        )}
      </View>
    </AuthLayout>
  );
}
