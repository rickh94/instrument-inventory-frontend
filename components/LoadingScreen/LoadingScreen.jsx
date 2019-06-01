import React from 'react'
import { BulletList as LoadingList } from 'react-content-loader'

import { RootPaper } from '..'

const LoadingScreen = () => {
  return (
    <RootPaper>
      <LoadingList />
    </RootPaper>
  )
}


export default LoadingScreen
