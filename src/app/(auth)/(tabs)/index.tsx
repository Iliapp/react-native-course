import { Link } from "expo-router";
import { cssInterop } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

cssInterop(RNSafeAreaView, { className: "style" });


export default function App() {
  return (
    <RNSafeAreaView className="flex-1 items-center justify-center bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>


      <Link href="/onboarding" className="mt-4 rounded bg-primary p-4 text-white">Go to Onboarding</Link>
            <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary p-4 text-white">Go to Sign In</Link>
                  <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary p-4 text-white">Go to Sign Up</Link>

                  <Link href="/subscriptions/spotify">Go to Subscription(Spotify)</Link>
                  <Link href={{
                    pathname: "/subscriptions/[id]",
                    params: { id: "claude" },
                  }}
                  >
                    Claude Max Subscription
                  </Link>
    </RNSafeAreaView>
  );
}