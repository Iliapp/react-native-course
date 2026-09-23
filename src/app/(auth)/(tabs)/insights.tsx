import dayjs from "dayjs";
import { useMemo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "@/lib/styled";
import { useSubscriptions } from "@/context/SubscriptionContext";
import InsightChart from "../../../../components/InsightChart";
import InsightExpenseCard from "../../../../components/InsightExpenseCard";
import InsightHistoryCard from "../../../../components/InsightHistoryCard";
const SafeAreaView = styled(RNSafeAreaView);

const Insights = () => {
  const { subscriptions } = useSubscriptions();
  const history = useMemo(
    () =>
      [...subscriptions].sort((first, second) =>
        dayjs(second.renewalDate ?? second.startDate).diff(
          dayjs(first.renewalDate ?? first.startDate),
        ),
      ),
    [subscriptions],
  );

  return (
    <SafeAreaView className="flex-1 bg-background px-5">
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <InsightHistoryCard subscription={item} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 125 }}
        ListHeaderComponent={
          <View>
            <View className="insights-header">
              <Pressable
                className="insights-close"
                onPress={() => router.replace("/(auth)/(tabs)")}
                accessibilityRole="button"
                accessibilityLabel="Close insights"
              >
                <Text className="insights-close-text">‹</Text>
              </Pressable>
              <Text className="insights-title">Monthly Insights</Text>
              <Pressable
                className="insights-menu"
                onPress={() => router.push("/(auth)/(tabs)/subscription")}
                accessibilityRole="button"
                accessibilityLabel="View all subscriptions"
              >
                <Text className="insights-menu-text">•••</Text>
              </Pressable>
            </View>

            <View className="insight-section-heading">
              <Text className="insight-section-title">Upcoming</Text>
              <Pressable
                className="insight-view-all"
                onPress={() => router.push("/(auth)/(tabs)/subscription")}
                accessibilityRole="button"
              >
                <Text className="insight-view-all-text">View all</Text>
              </Pressable>
            </View>

            <InsightChart subscriptions={subscriptions} />
            <InsightExpenseCard subscriptions={subscriptions} />

            <View className="insight-section-heading insight-history-heading">
              <Text className="insight-section-title">History</Text>
              <Pressable
                className="insight-view-all"
                onPress={() => router.push("/(auth)/(tabs)/subscription")}
                accessibilityRole="button"
              >
                <Text className="insight-view-all-text">View all</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text className="home-empty-state">Add a subscription to see your history.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default Insights;
