import { useTheme } from '@react-navigation/native';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '~/lib/utils';
import { Text } from '~/components/ui/text';
import { MaterialIcons } from '@expo/vector-icons';

const alertVariants = cva(
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

function Alert({
  className,
  variant,
  children,
  icon: Icon,
  iconName,
  iconSize = 16,
  iconClassName,
  ...props
}: ViewProps &
  VariantProps<typeof alertVariants> & {
    ref?: React.RefObject<View>;
    icon: typeof MaterialIcons;
    iconName?: MaterialIconName;
    iconSize?: number;
    iconClassName?: string;
  }) {
  const { colors } = useTheme();
  return (
    <View role='alert' className={alertVariants({ variant, className })} {...props}>
      <Icon
        name={iconName}
        size={iconSize}
        color={variant === 'destructive' ? colors.notification : colors.text}
      />
      {children}
    </View>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        'pl-7 mb-1 font-medium text-base leading-none tracking-tight text-foreground',
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-sm leading-relaxed text-foreground', className)} {...props} />
  );
}

export { Alert, AlertDescription, AlertTitle };
