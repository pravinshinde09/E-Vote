import { StyleSheet, View } from 'react-native'
import React from 'react'
import PostCreation from '../../components/Create/PostCreation'
import { SPACING } from '../../theme'

const CreatePost = () => {
  return (
    <View style={styles.container}>
      <PostCreation />
    </View>
  )
}

export default CreatePost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:SPACING.spacing02
  },
})