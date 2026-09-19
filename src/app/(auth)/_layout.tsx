import { useUser } from "@clerk/expo";
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";
import { posthog } from "@/config/posthog";

function AuthenticatedIdentity() {
  const { user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      identifiedUserId.current = null;
      return;
    }

    if (identifiedUserId.current === user.id) {
      return;
    }

    identifiedUserId.current = user.id;
    posthog?.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user.fullName ? { name: user.fullName } : {}),
      },
    });
  }, [user]);

  return null;
}

export default function RootLayout() {
  return (
    <>
      <AuthenticatedIdentity />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
