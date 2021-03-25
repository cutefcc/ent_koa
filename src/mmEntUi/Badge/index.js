import { Badge } from 'antd'
import styles from './index.less'

const MMBadge = (props) => {
  return <Badge className={styles.mm_badge} {...props} />
}

export default MMBadge
