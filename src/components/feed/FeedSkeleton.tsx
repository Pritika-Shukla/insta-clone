import React, { memo, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const CARD_COUNT = 3;

const useShimmer = () => {
  const anim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return anim;
};

const SkeletonCard = memo(({ opacity }: { opacity: Animated.Value }) => (
  <View className="bg-white mb-2">
    {/* Header */}
    <View className="flex-row items-center px-3 py-[10px]">
      <Animated.View className="w-[38px] h-[38px] rounded-full bg-[#e0e0e0]" style={{ opacity }} />
      <View className="ml-[10px] gap-1.5 flex-1">
        <Animated.View className="h-3 w-[120px] rounded bg-[#e0e0e0]" style={{ opacity }} />
        <Animated.View className="h-2.5 w-[80px] rounded bg-[#e0e0e0]" style={{ opacity }} />
      </View>
    </View>

    {/* Image placeholder */}
    <Animated.View className="w-full aspect-square bg-[#e0e0e0]" style={{ opacity }} />

    {/* Actions row */}
    <View className="flex-row items-center px-3 pt-[10px] pb-[6px] gap-4">
      <Animated.View className="w-7 h-7 rounded-full bg-[#e0e0e0]" style={{ opacity }} />
      <Animated.View className="w-7 h-7 rounded-full bg-[#e0e0e0]" style={{ opacity }} />
      <Animated.View className="w-7 h-7 rounded-full bg-[#e0e0e0]" style={{ opacity }} />
    </View>

    {/* Text lines */}
    <View className="px-3 pb-[14px] gap-1.5">
      <Animated.View className="h-3 w-[90px] rounded bg-[#e0e0e0]" style={{ opacity }} />
      <Animated.View className="h-3 rounded bg-[#e0e0e0]" style={{ opacity }} />
      <Animated.View className="h-3 w-[70%] rounded bg-[#e0e0e0]" style={{ opacity }} />
    </View>
  </View>
));

export const FeedSkeleton = () => {
  const opacity = useShimmer();
  return (
    <View>
      {Array.from({ length: CARD_COUNT }).map((_, i) => (
        <SkeletonCard key={i} opacity={opacity} />
      ))}
    </View>
  );
};
