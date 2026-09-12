import "../../global.css";
import { Image, View, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "@/lib/styled";
import images from "../../../../constants/images";
import {HOME_BALANCE, HOME_USER} from "../../../../constants/data";
import {icons} from "../../../../constants/icons";
import {formatCurrency} from "../../../../lib/utils";
const SafeAreaView = styled(RNSafeAreaView);


/** Renders the main authenticated tab with links to key app routes. */
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
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
            <Text className="home-balance-label" >Balance</Text>

            <View className="home-balance-row">
                <Text className='home-balance-amount'>
                    {formatCurrency(HOME_BALANCE.amount)}
                </Text>
            </View>
        </View>
    </SafeAreaView>
  );
}
