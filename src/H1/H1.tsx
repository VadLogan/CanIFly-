import {PropsWithChildren} from 'react';
import {StyleSheet} from 'react-native';
import {AppText} from '../AppText';

interface AppTextProps {
  style?: StyleSheet.NamedStyles<unknown>;
}

export const H1 = ({style, children}: PropsWithChildren<AppTextProps>) => {
  const h1Style = [styles.root, style];
  return <AppText style={h1Style}>{children}</AppText>;
};
const styles = StyleSheet.create({
  root: {
    fontSize: 26,
  },
});
