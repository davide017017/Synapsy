import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function Icon({ name, size = 24, color = '#000' }: { name: keyof typeof MaterialIcons.glyphMap; size?: number; color?: string }) {
  return <MaterialIcons name={name} size={size} color={color} />;
}
