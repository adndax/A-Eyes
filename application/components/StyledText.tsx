import { Text, TextProps } from 'react-native';

type FontWeight = 'regular' | 'bold' | 'semibold' | 'light' | 'medium';

interface PoppinsTextProps extends TextProps {
  weight?: FontWeight;
}

export function PoppinsText({ weight = 'regular', style, ...props }: PoppinsTextProps) {
  let fontFamily = 'PoppinsRegular';
  if (weight === 'bold') fontFamily = 'PoppinsBold';
  if (weight === 'semibold') fontFamily = 'PoppinsSemiBold';
  if (weight === 'light') fontFamily = 'PoppinsLight';
  if (weight === 'medium') fontFamily = 'PoppinsMedium';

  return <Text {...props} style={[style, { fontFamily }]} />;
}
