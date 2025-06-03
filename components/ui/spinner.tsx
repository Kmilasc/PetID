import { ActivityIndicator, View } from 'react-native';
import { cn } from '~/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'small',
  lg: 'large',
} as const;

export function Spinner({ size = 'lg', className }: SpinnerProps) {
  return (
    <View className={cn('items-center justify-center', className)}>
      <ActivityIndicator
        size={sizeMap[size]}
        color='black'
      />
    </View>
  );
} 