import dayjs from "dayjs";
import { Text, View } from "react-native";
import { formatCurrency } from "../lib/utils";
import { getMonthlySubscriptionTotal } from "../lib/insights";

type InsightExpenseCardProps = {
  subscriptions: Subscription[];
};

export default function InsightExpenseCard({ subscriptions }: InsightExpenseCardProps) {
  const month = dayjs();
  const total = getMonthlySubscriptionTotal(subscriptions, month);

  return (
    <View className="insight-expense-card">
      <View>
        <Text className="insight-expense-title">Expenses</Text>
        <Text className="insight-expense-month">{month.format("MMMM YYYY")}</Text>
      </View>
      <View className="items-end">
        <Text className="insight-expense-total">{formatCurrency(total)}</Text>
        <Text className="insight-expense-change">Active subscriptions</Text>
      </View>
    </View>
  );
}
