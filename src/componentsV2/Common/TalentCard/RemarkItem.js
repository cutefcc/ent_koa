import React from 'react'
import * as R from 'ramda'
import Avatar from 'componentsV2/Common/Avatar'
import { connect } from 'react-redux'
import styles from './RemarkItem.less'

function renderAvatar(item) {
  const { avatar = '', name = '' } = item
  const style = {
    width: '40px',
    height: '40px',
    fontSize: '24px',
    lineHeight: '40px',
    borderRadius: '20px',
  }

  return <Avatar avatar={avatar} name={name} style={style} />
}

@connect((state) => ({
  loading: state.loading.effects['talents/fetchRemarks'],
  configLoading: state.loading.effects['global/fetchConfig'],
  config: state.global.config,
}))
export default class RemarkItem extends React.PureComponent {
  componentDidMount() {
    if (R.isEmpty(this.props.config) && !this.props.configLoading) {
      this.fetchConfig()
    }
  }

  getNodeName = (value) => {
    const remarkNode = R.propOr([], 'remark_node', this.props.config)
    const node = remarkNode.find(R.propEq('value', value))
    return R.propOr(value, 'label', node)
  }

  fetchConfig = () => {
    this.props.dispatch({ type: 'global/fetchConfig' })
  }

  render() {
    const { list = [] } = this.props.data
    return (
      <div className={styles.commonFriends}>
        {list.map((item, index) => {
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`${item.name}${index}`}
              className={`${index === 0 ? '' : 'margin-top-16'} flex`}
            >
              {renderAvatar(item)}
              <span className="flex-column space-between margin-left-16">
                <span className="color-stress font-size-14 font-weight-bold">
                  {item.name}
                </span>
                <span className="color-dilution font-size-12">
                  {item.remark_time}
                </span>
                {(!!item.node || item.content) && (
                  <span className="color-common font-size-14">
                    {!!item.node && this.getNodeName(item.node)}
                    {!!item.node && item.content && '：'}
                    {item.content ? item.content : ''}
                  </span>
                )}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
}
