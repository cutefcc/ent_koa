import React from 'react'
import { Checkbox } from 'antd'

function MMCheckbox(props) {
  return <Checkbox {...props} />
}

MMCheckbox.Group = Checkbox.Group

export default MMCheckbox
