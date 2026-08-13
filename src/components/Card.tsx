import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`bg-white border border-kerala-border rounded-card p-4 ${className}`}
    >
      {children}
    </View>
  );
}
