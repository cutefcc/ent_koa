import { Form } from '@ant-design/compatible'
import React from 'react'
import '@ant-design/compatible/assets/index.css'
import { Modal } from 'antd'
import MForm from 'components/Common/MForm'

const ModalForm = (props) => {
  const { config, onSubmit, onCancel, visible, title = '编辑', name } = props
  const NewFrom = Form.create({ name: name || 'baseFrom' })(MForm)
  return (
    <div>
      <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
        <NewFrom
          {...config.formConfig}
          dataSource={config.dataSource}
          onSubmit={onSubmit}
          onCancel={onCancel}
        >
          {' '}
        </NewFrom>
      </Modal>
    </div>
  )
}

export default ModalForm
