import dayjs from "dayjs";
import { Text, View } from "react-native";
import { formatCurrency } from "../lib/utils";
import { isSubscriptionActive } from "../lib/insights";

type InsightChartProps = {
  subscriptions: Subscription[];
};

type ChartPoint = {
  label: string;
  amount: number;
};

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getRenewalWeekday(subscription: Subscription) {
  const renewalDate = dayjs(subscription.renewalDate ?? subscription.startDate);
  if (!renewalDate.isValid()) {
    return null;
  }

  return (renewalDate.day() + 6) % 7;
}

export default function InsightChart({ subscriptions }: InsightChartProps) {
  const points: ChartPoint[] = weekdayLabels.map((label, weekday) => ({
    label,
    amount: subscriptions.reduce((total, subscription) => {
      if (!isSubscriptionActive(subscription) || getRenewalWeekday(subscription) !== weekday) {
        return total;
      }

      return total + subscription.price;
    }, 0),
  }));

  const maximum = Math.max(...points.map((point) => point.amount), 1);
  const scaleMaximum = Math.max(45, Math.ceil(maximum / 5) * 5);
  const scaleValues = [scaleMaximum, scaleMaximum - 10, scaleMaximum - 20, scaleMaximum - 40, 0];
  const selectedIndex = (dayjs().day() + 6) % 7;

  return (
    <View className="insight-chart">
      <View className="insight-axis">
        {scaleValues.map((value) => (
          <Text key={value} className="insight-axis-label">
            {value}
          </Text>
        ))}
      </View>
      <View className="insight-chart-grid">
        {[0.25, 0.5, 0.75, 1].map((line) => (
          <View
            key={line}
            className="insight-chart-line"
            style={{ bottom: `${line * 100}%` }}
          />
        ))}
      </View>
      <View className="insight-bars">
        {points.map((point, index) => {
          const height =
            point.amount === 0 ? 4 : Math.max((point.amount / scaleMaximum) * 100, 8);
          const isSelected = index === selectedIndex;

          return (
            <View key={`${point.label}-${index}`} className="insight-bar-column">
              <View className="insight-bar-area">
                {isSelected && point.amount > 0 ? (
                  <View className="insight-tooltip" style={{ bottom: `${height}%` }}>
                    <Text className="insight-tooltip-text">
                      {formatCurrency(point.amount)}
                    </Text>
                  </View>
                ) : null}
                <View
                  className={isSelected ? "insight-bar insight-bar-selected" : "insight-bar"}
                  style={{ height: `${height}%` }}
                />
              </View>
              <Text className="insight-bar-label">{point.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
