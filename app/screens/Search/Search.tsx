import { StyleSheet, View } from 'react-native'
import React from 'react'
import { StyleProps, useTheme } from '../../context/ThemeProvider'
import Typography from '../../components/Typography';

const Search = () => {
  const { colors } = useTheme();
  const styles = getStyles({ colors });
  return (
    <View style={styles.container}>
      <Typography variant={'title03'}>Good things take time's</Typography>
      <Typography variant={'title03'}>This feature is on its way!</Typography>
    </View>
  )
}

export default Search

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
})