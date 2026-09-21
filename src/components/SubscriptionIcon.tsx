import { Image, View } from "react-native";
import { useState } from "react";
import { SvgUri } from "react-native-svg";
import { icons } from "../../constants/icons";

type SubscriptionIconProps = {
  source: Subscription["icon"];
  className?: string;
};

export default function SubscriptionIcon({ source, className = "sub-icon" }: SubscriptionIconProps) {
  const [hasError, setHasError] = useState(false);

  if (typeof source === "string") {
    if (hasError) {
      return <Image source={icons.wallet} className={className} />;
    }

    return (
      <View className={className}>
        <SvgUri
          uri={source}
          width="100%"
          height="100%"
          onError={() => setHasError(true)}
        />
      </View>
    );
  }

  return <Image source={source} className={className} />;
}
