import React, { memo } from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import type { IconName, IconProps } from '../../types';

type RenderFn = (color: string) => React.ReactNode;

const ICONS: Record<IconName, RenderFn> = {
  'heart': color => (
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={color}
    />
  ),
  'heart-outline': color => (
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  'chatbubble-outline': color => (
    <Path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  'paper-plane-outline': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 2L11 13" />
      <Path d="M22 2L15 22 11 13 2 9l20-7z" />
    </G>
  ),
  'bookmark': color => (
    <Path
      d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
      fill={color}
    />
  ),
  'bookmark-outline': color => (
    <Path
      d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  'ellipsis-horizontal': color => (
    <G fill={color}>
      <Circle cx={5} cy={12} r={1.5} />
      <Circle cx={12} cy={12} r={1.5} />
      <Circle cx={19} cy={12} r={1.5} />
    </G>
  ),
  'arrow-back': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 12H5" />
      <Path d="M12 19l-7-7 7-7" />
    </G>
  ),
  'alert-circle-outline': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={10} />
      <Path d="M12 8v4M12 16h.01" />
    </G>
  ),
  'add-circle-outline': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={10} />
      <Path d="M12 8v8M8 12h8" />
    </G>
  ),
  'add': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M12 5v14M5 12h14" />
    </G>
  ),
  'home': color => (
    <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color} />
  ),
  'home-outline': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Path d="M9 22V12h6v10" />
    </G>
  ),
  'play-circle': color => (
    <>
      <Circle cx={12} cy={12} r={10} fill={color} />
      <Path d="M10 8l6 4-6 4V8z" fill="#fff" />
    </>
  ),
  'play-circle-outline': color => (
    <G fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Path d="M10 8l6 4-6 4V8z" fill={color} />
    </G>
  ),
  'volume-high': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11 5L6 9H2v6h4l5 4V5z" />
      <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </G>
  ),
  'volume-mute': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11 5L6 9H2v6h4l5 4V5z" />
      <Path d="M23 9l-6 6M17 9l6 6" />
    </G>
  ),
  'person': color => (
    <G fill={color}>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M20 21a8 8 0 1 0-16 0h16z" />
    </G>
  ),
  'person-outline': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={8} r={4} />
      <Path d="M20 21a8 8 0 1 0-16 0" />
    </G>
  ),
  'log-out-outline': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Path d="M16 17l5-5-5-5" />
      <Path d="M21 12H9" />
    </G>
  ),
  'grid-outline': color => (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
    </G>
  ),
};

const Icon = memo(({ name, size = 24, color = '#000000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {ICONS[name]?.(color)}
  </Svg>
));

export default Icon;
