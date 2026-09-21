import {Text, View, Pressable} from "react-native";
import {formatCurrency, formatStatusLabel, formatSubscriptionDateTime} from "../lib/utils";
import clsx from "clsx";
import SubscriptionIcon from "../src/components/SubscriptionIcon";


const SubsciptionCard = ({ name, price, currency, icon, billing, color, category, plan, renewalDate, expanded, onPress,paymentMethod, startDate, status }: SubscriptionCardProps) => {
    const categoryValue = [category?.trim(), plan?.trim()].filter(Boolean).join(" / ") || "Not provided";
    const paymentMethodValue = paymentMethod?.trim() || "Not provided";
    const startDateValue = startDate ? formatSubscriptionDateTime(startDate) : "Not provided";
    const renewalDateValue = renewalDate ? formatSubscriptionDateTime(renewalDate) : "Not provided";
    const statusValue = status ? formatStatusLabel(status) : "Not provided";
    const summaryValue = categoryValue !== "Not provided"
        ? categoryValue
        : renewalDateValue;

    return (
        <Pressable  onPress={onPress} className={clsx('sub-card', expanded ? 'sub-card-expanded' : 'bg-card')} style={!expanded && color ? { backgroundColor: color } : undefined}>
            <View className="sub-head">
                <View className="sub-main">
                    <SubscriptionIcon source={icon} />
                    <View className="sub-copy">
                        <Text numberOfLines={1} className="sub-title">{name}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" className='sub-meta'>
                            {summaryValue}
                        </Text>
                    </View>
                </View>
                <View className="sub-price-box">
                    <Text className="sub-price">{formatCurrency(price,currency)}</Text>
                    <Text className="sub-billing">{billing}</Text>
                </View>
            </View>
            {expanded && (
                <View className="sub-expanded">
                    <View className="sub-details">

                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Payment method:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                      ellipsizeMode="tail">{paymentMethodValue}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Category:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                      ellipsizeMode="tail">{categoryValue}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Started:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                      ellipsizeMode="tail">{startDateValue}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Renewal date:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                      ellipsizeMode="tail">{renewalDateValue}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Status:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                      ellipsizeMode="tail">{statusValue}</Text>
                            </View>
                        </View>

                    </View>
                </View>
            )}
        </Pressable>
    )
};

export default SubsciptionCard;