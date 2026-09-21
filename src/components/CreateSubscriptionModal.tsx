import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { icons } from "../../constants/icons";
import { findSubscriptionIcon } from "../lib/subscriptionIcons";
import { posthog } from "@/config/posthog";

const categories = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const categoryColors: Record<(typeof categories)[number], string> = {
  Entertainment: "#f5c542",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#b8e8d0",
  Productivity: "#f6d6ad",
  Cloud: "#c8ddf2",
  Music: "#f1c6d8",
  Other: "#d9d9d9",
};

type Frequency = "Monthly" | "Yearly";

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription & { frequency: Frequency }) => void;
};

const initialCategory = "Entertainment";

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<(typeof categories)[number]>(initialCategory);
  const [submitted, setSubmitted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const parsedPrice = Number.parseFloat(price);
  const hasValidPrice = Number.isFinite(parsedPrice) && parsedPrice > 0;
  const canSubmit = Boolean(name.trim()) && hasValidPrice;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory(initialCategory);
    setSubmitted(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!canSubmit || isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      const startDate = dayjs();
      const renewalDate = startDate.add(1, frequency === "Monthly" ? "month" : "year");
      const icon = await findSubscriptionIcon(name);
      const subscription = {
        id: `${name.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        name: name.trim(),
        price: parsedPrice,
        frequency,
        category,
        status: "active",
        startDate: startDate.toISOString(),
        renewalDate: renewalDate.toISOString(),
        icon: icon ?? icons.wallet,
        billing: frequency,
        color: categoryColors[category],
      };

      onCreate(subscription);
      posthog?.capture("subscription_created", {
        subscription_name: name.trim(),
        subscription_price: parsedPrice,
        subscription_frequency: frequency,
        subscription_category: category,
      });
      resetForm();
      onClose();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="modal-overlay">
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                className="modal-close"
                accessibilityRole="button"
                accessibilityLabel="Close new subscription form"
                onPress={handleClose}
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="modal-body">
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    className={clsx("auth-input", submitted && !name.trim() && "auth-input-error")}
                    placeholder="e.g. Netflix"
                    placeholderTextColor="#08112699"
                    accessibilityLabel="Subscription name"
                  />
                  {submitted && !name.trim() ? (
                    <Text className="auth-error">Enter a subscription name.</Text>
                  ) : null}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Price</Text>
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    className={clsx("auth-input", submitted && !hasValidPrice && "auth-input-error")}
                    placeholder="0.00"
                    placeholderTextColor="#08112699"
                    keyboardType="decimal-pad"
                    accessibilityLabel="Subscription price"
                  />
                  {submitted && !hasValidPrice ? (
                    <Text className="auth-error">Enter a positive price.</Text>
                  ) : null}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Frequency</Text>
                  <View className="picker-row">
                    {(["Monthly", "Yearly"] as Frequency[]).map((option) => {
                      const active = frequency === option;
                      return (
                        <Pressable
                          key={option}
                          className={clsx("picker-option", active && "picker-option-active")}
                          onPress={() => setFrequency(option)}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                        >
                          <Text
                            className={clsx(
                              "picker-option-text",
                              active && "picker-option-text-active",
                            )}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {categories.map((option) => {
                      const active = category === option;
                      return (
                        <Pressable
                          key={option}
                          className={clsx("category-chip", active && "category-chip-active")}
                          onPress={() => setCategory(option)}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                        >
                          <Text
                            className={clsx(
                              "category-chip-text",
                              active && "category-chip-text-active",
                            )}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <Pressable
                  className={clsx("auth-button", !canSubmit && "auth-button-disabled")}
                  disabled={!canSubmit || isCreating}
                  onPress={handleSubmit}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !canSubmit || isCreating, busy: isCreating }}
                >
                  <Text className="auth-button-text">Create Subscription</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
