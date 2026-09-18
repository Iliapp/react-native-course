import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  AuthButton,
  AuthField,
  AuthLayout,
  getAuthErrorMessage,
  validateEmail,
  validatePassword,
} from "@/components/auth/AuthLayout";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    const nextErrors = {
      email: validateEmail(emailAddress),
      password: validatePassword(password),
    };

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { error } = await signIn.password({
        identifier: emailAddress.trim(),
        password,
      });

      if (error) {
        setErrors({ form: getAuthErrorMessage(error) });
        return;
      }

      if (signIn.status !== "complete") {
        setErrors({ form: "Additional verification is required for this account." });
        return;
      }

      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setErrors({ form: getAuthErrorMessage(finalizeError) });
        return;
      }

      router.replace("/(auth)/(tabs)");
    } catch (error) {
      setErrors({ form: getAuthErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue managing your subscriptions"
      footerCopy="New to Recurly?"
      footerLink="Create an account"
      footerHref="/(auth)/sign-up"
    >
      <View className="auth-form">
        {errors.form ? <Text className="auth-error">{errors.form}</Text> : null}
        <AuthField
          label="Email"
          value={emailAddress}
          onChangeText={setEmailAddress}
          onFocus={() => setErrors((current) => ({ ...current, email: undefined, form: undefined }))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="username"
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
          textContentType="password"
          placeholder="Enter your password"
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
        <AuthButton
          title="Sign in"
          loading={isSubmitting}
          disabled={fetchStatus === "fetching"}
          onPress={handleSignIn}
        />
      </View>
    </AuthLayout>
  );
}
