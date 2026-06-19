import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../common/Icon';

const FeedHeader = memo(() => (
  <View className="flex-row items-center justify-between px-[14px] py-[10px] bg-white border-b border-[#dbdbdb]">
    <Text className="text-[26px] font-bold italic text-black tracking-[-0.5px]">
      Instagram
    </Text>
    <View className="flex-row items-center">
      <TouchableOpacity className="ml-[18px]" activeOpacity={0.6}>
        <Icon name="add-circle-outline" size={27} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity className="ml-[18px]" activeOpacity={0.6}>
        <Icon name="heart-outline" size={27} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity className="ml-[18px]" activeOpacity={0.6}>
        <Icon name="paper-plane-outline" size={26} color="#000" />
      </TouchableOpacity>
    </View>
  </View>
));

export default FeedHeader;
