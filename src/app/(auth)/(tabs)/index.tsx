import "../../global.css";
import {Image, View, Text, FlatList} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "@/lib/styled";
import images from "../../../../constants/images";
import {HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS} from "../../../../constants/data";
import {icons} from "../../../../constants/icons";
import {formatCurrency} from "../../../../lib/utils";
const SafeAreaView = styled(RNSafeAreaView);
import dayjs from "dayjs";
import ListHeading from "../../../../components/ListHeading";
import UpcomingSubscriptionCard from "../../../../components/UpcomingSubscriptionCard";
import SubsciptionCard from "../../../../components/SubscriptionCard";
import {useState} from "react";
import SubscriptionCard from "../../../../components/SubscriptionCard";


/** Renders the main authenticated tab with links to key app routes. */
export default function App() {
    const [expandedSubscriptionId, setexpandedSubscriptionId] = useState<string | null>(null);
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <View className="home-header">
                            <View className="home-user">
                                <Image source={images.avatar} className="home-avatar" />
                                <Text className="home-user-name" > {HOME_USER.name}</Text>
                            </View>
                            <View className="home-add-button">
                                <Image source={icons.add} className="home-add-icon" />
                            </View>
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

                        <ListHeading title="All Subscription"/>
                    </>
                )}
                      data={HOME_SUBSCRIPTIONS}
                      keyExtractor={(item) => item.id}
                      renderItem={({item}) => (<SubscriptionCard {...item} expanded={expandedSubscriptionId === item.id}
                      onPress={() => setexpandedSubscriptionId((currentId)=>
                          (currentId === item.id ? null : item.id))}
                      />
                      )}
                      extraData={expandedSubscriptionId}
                      ItemSeparatorComponent={() => <View className ="h-4"/>}
                      showsVerticalScrollIndicator={false}
                      ListEmptyComponent={<Text className="home-empty-state">No subscription yet.</Text>}
                      contentContainerStyle={{ paddingBottom: 120 }}
            />
    </SafeAreaView>
  );
}
