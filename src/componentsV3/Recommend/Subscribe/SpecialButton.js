import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button } from 'antd'

const SpecialButton = withRouter(({ history, path, text }) => {
  return (
    <Button
      onClick={() => {
        history.push(path)
      }}
      type="link"
    >
      {text}
    </Button>
  )
})
export default SpecialButton
