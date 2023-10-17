import {PropsWithChildren} from 'react';
import {StyleSheet} from 'react-native';
import {AppText} from '../AppText';

interface AppTextProps {
  style?: StyleSheet.NamedStyles<unknown>;
}

export const H2 = ({style, children}: PropsWithChildren<AppTextProps>) => {
  const h2Style = [styles.root, style];
  return <AppText style={h2Style}>{children}</AppText>;
};
const styles = StyleSheet.create({
  root: {
    fontSize: 22,
  },
});
