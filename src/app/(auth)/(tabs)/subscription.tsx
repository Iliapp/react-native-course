import { cssInterop } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


cssInterop(RNSafeAreaView, { className: "style" });

const Subscription = () => {
  return (
    <RNSafeAreaView className="flex-1 items-center justify-center bg-background p-5">
      <Text>Subscription</Text>
    </RNSafeAreaView>
  );
}

export default Subscription;
