import dayjs, { Dayjs } from "dayjs";

export function isSubscriptionActive(subscription: Subscription) {
  return subscription.status !== "cancelled" && subscription.status !== "paused";
}

export function getSubscriptionAmountForMonth(subscription: Subscription, month: Dayjs) {
  if (!isSubscriptionActive(subscription)) {
    return 0;
  }

  const startDate = dayjs(subscription.startDate);
  if (startDate.isValid() && month.isBefore(startDate, "month")) {
    return 0;
  }

  if (subscription.billing.toLowerCase() === "yearly") {
    return dayjs(subscription.renewalDate).isSame(month, "month") ? subscription.price : 0;
  }

  return subscription.price;
}

export function getMonthlySubscriptionTotal(subscriptions: Subscription[], month = dayjs()) {
  return subscriptions.reduce(
    (total, subscription) => total + getSubscriptionAmountForMonth(subscription, month),
    0,
  );
}
