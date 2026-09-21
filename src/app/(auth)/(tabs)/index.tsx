import "../../global.css";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { posthog } from "@/config/posthog";
import { styled } from "@/lib/styled";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import { useSubscriptions } from "@/context/SubscriptionContext";
import ListHeading from "../../../../components/ListHeading";
import UpcomingSubscriptionCard from "../../../../components/UpcomingSubscriptionCard";
import SubscriptionCard from "../../../../components/SubscriptionCard";
import { HOME_BALANCE, UPCOMING_SUBSCRIPTIONS } from "../../../../constants/data";
import { icons } from "../../../../constants/icons";
import images from "../../../../constants/images";
import { formatCurrency } from "../../../../lib/utils";

const SafeAreaView = styled(RNSafeAreaView);

/** Renders the main authenticated tab with links to key app routes. */
export default function App() {
    const [expandedSubscriptionId, setexpandedSubscriptionId] = useState<string | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const { subscriptions, addSubscription } = useSubscriptions();
    const { user } = useUser();
    const userName =
        user?.fullName ||
        user?.username ||
        user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        "User";
    const handleSubscriptionPress = (subscriptionId: string, status: string) => {
        if (expandedSubscriptionId !== subscriptionId) {
            posthog?.capture("subscription_details_expanded", {
                subscription_id: subscriptionId,
                subscription_status: status,
            });
        }

        setexpandedSubscriptionId((currentId) =>
            currentId === subscriptionId ? null : subscriptionId,
        );
    };
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <View className="home-header">
                            <View className="home-user">
                                <Image
                                    source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                                    className="home-avatar"
                                />
                                <Text className="home-user-name">{userName}</Text>
                            </View>
                            <Pressable
                                className="home-add-button"
                                onPress={() => setIsCreateModalVisible(true)}
                                accessibilityRole="button"
                                accessibilityLabel="Add subscription"
                            >
                                <Image source={icons.add} className="home-add-icon" />
                            </Pressable>
                        </View>
                        <View className="home-balance-card">
                            <Text className="home-balance-label">Balance</Text>

                            <View className="home-balance-row">
                                <Text className='home-balance-amount'>
                                    {formatCurrency(HOME_BALANCE.amount)}
                                </Text>
                                <Text className='home-balance-date'>
                                    {dayjs(HOME_BALANCE.nextRenewalDate)
                                        .format('MM/dd/')}
                                </Text>
                            </View>
                        </View>

                        <View className='mb-5'>
                            <ListHeading title="Upcoming"/>

                            <FlatList
                                data={UPCOMING_SUBSCRIPTIONS}
                                renderItem={({item}) => <UpcomingSubscriptionCard {...item} />}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={
                                    <Text className="home-empty-state">
                                        No upcoming renewals yet.
                                    </Text>
                                }
                            />

                        </View>

                        <ListHeading title="All Subscriptions"/>
                    </>
                )}
                      data={subscriptions}
                      keyExtractor={(item) => item.id}
                      renderItem={({item}) => (<SubscriptionCard {...item} expanded={expandedSubscriptionId === item.id}
                      onPress={() => handleSubscriptionPress(item.id, item.status ?? "unknown")}
                      />
                      )}
                      extraData={expandedSubscriptionId}
                      ItemSeparatorComponent={() => <View className ="h-4"/>}
                      showsVerticalScrollIndicator={false}
                      ListEmptyComponent={<Text className="home-empty-state">No subscription yet.</Text>}
                      contentContainerStyle={{ paddingBottom: 120 }}
            />
            <CreateSubscriptionModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onCreate={addSubscription}
            />
    </SafeAreaView>
  );
}
