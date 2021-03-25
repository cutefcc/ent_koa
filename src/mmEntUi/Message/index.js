import { message } from 'antd'

const Message = message

Message.config({
  top: 24,
  duration: 3,
  maxCount: 4,
})

export default Message
