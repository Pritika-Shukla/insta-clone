import React, { memo, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const SKELETON_COUNT = 7;

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

const SkeletonRow = memo(({ opacity }: { opacity: Animated.Value }) => (
  <View className="flex-row px-4 py-3">
    <Animated.View className="w-9 h-9 rounded-full bg-[#e0e0e0]" style={{ opacity }} />
    <View className="ml-3 flex-1 gap-1.5">
      <Animated.View className="bg-[#e0e0e0] rounded w-[110px] h-3" style={{ opacity }} />
      <Animated.View className="bg-[#e0e0e0] rounded h-3" style={{ opacity }} />
      <Animated.View className="bg-[#e0e0e0] rounded w-[65%] h-3" style={{ opacity }} />
      <Animated.View className="bg-[#e0e0e0] rounded w-[72px] h-2.5 mt-0.5" style={{ opacity }} />
    </View>
  </View>
));

export const CommentSkeleton = () => {
  const opacity = useShimmer();
  return (
    <View>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <SkeletonRow key={i} opacity={opacity} />
      ))}
    </View>
  );
};
