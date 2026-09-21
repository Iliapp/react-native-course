import "../../global.css";
import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "@/lib/styled";
import { useSubscriptions } from "@/context/SubscriptionContext";
import SubscriptionCard from "../../../../components/SubscriptionCard";

const SafeAreaView = styled(RNSafeAreaView);

const Subscription = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptions();

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return subscriptions;
    }

    return subscriptions.filter((subscription) =>
      [
        subscription.name,
        subscription.plan,
        subscription.category,
        subscription.billing,
        subscription.status,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    );
  }, [searchQuery, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background px-5">
      <FlatList
        className="flex-1"
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        ListHeaderComponent={
          <View>
            <Text className="list-title mb-5">Subscriptions</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search subscriptions"
              placeholderTextColor="rgba(0, 0, 0, 0.45)"
              className="subscription-search"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel="Search subscriptions"
            />
            <Text className="subscription-count">
              {filteredSubscriptions.length}{" "}
              {filteredSubscriptions.length === 1 ? "subscription" : "subscriptions"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions match your search.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default Subscription;
