import React, { memo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { STORIES } from '../../data/feedData';
import type { StoryItemProps } from '../../types';

const StoryItem = memo(({ story }: StoryItemProps) => (
  <TouchableOpacity className="items-center mx-[7px] w-[72px]" activeOpacity={0.7}>
    <View
      className={`w-[68px] h-[68px] rounded-full border-2 justify-center items-center p-[2px] ${
        story.hasStory ? 'border-[#c13584]' : 'border-[#dbdbdb]'
      }`}
    >
      <View className="relative">
        <Image
          source={{ uri: story.avatar }}
          className="w-[62px] h-[62px] rounded-full border-2 border-white"
          resizeMode="cover"
        />
        {story.isOwn && (
          <View className="absolute bottom-0 -right-[2px] w-5 h-5 rounded-full bg-[#0095f6] justify-center items-center border-2 border-white">
            <Ionicons name="add" size={11} color="#fff" />
          </View>
        )}
      </View>
    </View>
    <Text className="text-[11px] text-[#262626] mt-[5px] text-center w-[72px]" numberOfLines={1}>
      {story.username}
    </Text>
  </TouchableOpacity>
));

export default function StoriesBar() {
  return (
    <View className="bg-white py-[10px] border-b border-[#dbdbdb]">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {STORIES.map(story => (
          <StoryItem key={story.id} story={story} />
        ))}
      </ScrollView>
    </View>
  );
}
