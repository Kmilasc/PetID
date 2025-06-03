import { MaterialIcons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

export function iconWithClassName(icon: typeof MaterialIcons) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}