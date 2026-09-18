import { useAuth } from "@clerk/expo";
import clsx from "clsx";
import { Redirect, Tabs } from "expo-router";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";
import { tabs } from "../../../../constants/data";
import { colors, components } from "../../../../constants/theme";

const tabBar = components.tabBar;

function TabIcon({ focused, icon }: TabIconProps) {
	return (
		<View className="tabs-icon">
			<View className={clsx("tabs-pill", focused && "tabs-active")}>
				<Image source={icon} resizeMode="contain" className="tabs-glyph" />
			</View>
		</View>
	);
}

const TabLayout = () => {
	const { isLoaded, isSignedIn } = useAuth();
	const insets = useSafeAreaInsets();
	const screenOptions = useMemo(
		() => ({
			headerShown: false,
			tabBarShowLabel: false,
			tabBarStyle: {
				position: "absolute" as const,
				bottom: Math.max(insets.bottom, tabBar.horizontalInset),
				height: tabBar.height,
				marginHorizontal: tabBar.horizontalInset,
				borderRadius: tabBar.radius,
				backgroundColor: colors.primary,
				borderTopWidth: 0,
				elevation: 0,
			},
			tabBarItemStyle: {
				paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
			},
			tabBarIconStyle: {
				width: tabBar.iconFrame,
				height: tabBar.iconFrame,
				alignItems: "center" as const,
			},
		}),
		[insets.bottom],
	);

	if (!isLoaded) {
		return <View className="flex-1 items-center justify-center bg-background" />;
	}

	if (!isSignedIn) {
		return <Redirect href="/(auth)/sign-in" />;
	}

	return (
		<Tabs screenOptions={screenOptions}>
			{tabs.map((tab) => (
				<Tabs.Screen
					key={tab.name}
					name={tab.name}
					options={{
						title: tab.title,
						tabBarIcon: ({ focused }) => (
							<TabIcon focused={focused} icon={tab.icon} />
						),
					}}
				/>
			))}
		</Tabs>
	);
};

export default TabLayout;