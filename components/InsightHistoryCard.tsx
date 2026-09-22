import dayjs from "dayjs";
import { Text, View } from "react-native";
import SubscriptionIcon from "../src/components/SubscriptionIcon";
import { formatCurrency } from "../lib/utils";

type InsightHistoryCardProps = {
  subscription: Subscription;
};

export default function InsightHistoryCard({ subscription }: InsightHistoryCardProps) {
  return (
    <View className="insight-history-card" style={{ backgroundColor: subscription.color }}>
      <SubscriptionIcon source={subscription.icon} className="insight-history-icon" />
      <View className="insight-history-copy">
        <Text className="insight-history-name" numberOfLines={1}>
          {subscription.name}
        </Text>
        <Text className="insight-history-date">
          {dayjs(subscription.renewalDate ?? subscription.startDate).format("MMM D, HH:mm")}
        </Text>
      </View>
      <View className="items-end">
        <Text className="insight-history-price">{formatCurrency(subscription.price)}</Text>
        <Text className="insight-history-billing">per {subscription.billing.toLowerCase()}</Text>
      </View>
    </View>
  );
}
