import React, { RefObject } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface CommentInputProps {
  inputRef: RefObject<TextInput | null>;
  text: string;
  onChangeText: (t: string) => void;
  onPost: () => void;
}

export const CommentInput = ({ inputRef, text, onChangeText, onPost }: CommentInputProps) => (
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View className="flex-row items-center px-3 py-2 border-t border-[#dbdbdb] gap-2">
      <View className="w-8 h-8 rounded-full bg-[#e8eaf6] items-center justify-center">
        <Text className="text-xs font-bold text-[#4f46e5]">Y</Text>
      </View>
      <View className="flex-1 flex-row items-center bg-[#fafafa] border border-[#dbdbdb] rounded-[20px] px-4 py-[7px]">
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={onChangeText}
          placeholder="Add a comment..."
          placeholderTextColor="#8e8e8e"
          className="flex-1 text-[13.5px] text-[#262626]"
          style={{ padding: 0 }}
          returnKeyType="send"
          onSubmitEditing={onPost}
        />
        {text.trim().length > 0 && (
          <TouchableOpacity onPress={onPost} activeOpacity={0.6}>
            <Text className="text-[13.5px] font-semibold text-[#0095f6] ml-2">Post</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </KeyboardAvoidingView>
);
