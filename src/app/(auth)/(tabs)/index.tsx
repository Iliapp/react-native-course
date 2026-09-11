import "../../global.css";
import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "@/lib/styled";
const SafeAreaView = styled(RNSafeAreaView);


/** Renders the main authenticated tab with links to key app routes. */
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>


      <Link href="/onboarding" asChild>
        <Pressable className="mt-4 w-full rounded bg-primary p-4">
          <Text className="text-white">Go to Onboarding</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/sign-in" asChild>
        <Pressable className="mt-4 w-full rounded bg-primary p-4">
          <Text className="text-white">Go to Sign In</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/sign-up" asChild>
        <Pressable className="mt-4 w-full rounded bg-primary p-4">
          <Text className="text-white">Go to Sign Up</Text>
        </Pressable>
      </Link>

                  <Link href="/subscriptions/spotify">Go to Subscription(Spotify)</Link>
                  <Link href={{
                    pathname: "/subscriptions/[id]",
                    params: { id: "claude" },
                  }}
                  >
                    Claude Max Subscription
                  </Link>
    </SafeAreaView>
  );
}
