import { useAuth, useUser } from "@clerk/expo";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "@/lib/styled";
import images from "../../../../constants/images";
const SafeAreaView = styled(RNSafeAreaView);




const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const userName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="items-center pt-8">
        <Image
          source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
          className="h-24 w-24 rounded-full"
        />
        <Text className="mt-4 text-xl font-sans-bold text-primary">{userName}</Text>
        <Text className="mt-1 text-sm font-sans text-secondary">
          {user?.primaryEmailAddress?.emailAddress ?? "No email address"}
        </Text>
        <Pressable
          className="auth-button mt-8 w-full"
          onPress={signOut}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text className="auth-button-text">Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default Settings;
