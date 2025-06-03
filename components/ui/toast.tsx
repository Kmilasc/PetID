import { useTheme } from '@react-navigation/native';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '~/lib/utils';
import { Text } from '~/components/ui/text';
import { MaterialIcons } from '@expo/vector-icons';

const toastVariants = cva(
  'relative bg-background w-full rounded-lg border border-border p-4 shadow shadow-foreground/10 flex flex-row items-center gap-x-2',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'border-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface ToastProps extends ViewProps, VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  iconName?: MaterialIconName;
  iconSize?: number;
}

export function Toast({
  className,
  variant,
  title,
  description,
  iconName,
  iconSize = 16,
  ...props
}: ToastProps) {
  const { colors } = useTheme();
  return (
    <View role='alert' className={toastVariants({ variant, className })} {...props}>
      {iconName && (
        <MaterialIcons
          name={iconName}
          size={iconSize}
          color={variant === 'destructive' ? colors.notification : colors.text}
        />
      )}
      <View className="flex-1">
        {title && (
          <Text
            className={cn(
              'font-medium text-base leading-none tracking-tight text-foreground mb-1',
              iconName && 'pl-7'
            )}
          >
            {title}
          </Text>
        )}
        {description && (
          <Text className={cn('text-sm leading-relaxed text-foreground', iconName && 'pl-7')}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
}

export function useToast() {
  const [toast, setToast] = React.useState<ToastProps | null>(null);

  const showToast = React.useCallback((props: ToastProps) => {
    setToast(props);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return {
    toast,
    showToast,
  };
} 