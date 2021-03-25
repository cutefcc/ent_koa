import React from 'react'
import { Text, Icon } from 'mm-ent-ui'
// import {Text} from 'mm-ent-ui'
import ItemTitle from './ItemTitle'
import styles from './SpreadTarget.less'

export default function Target(props) {
  const { employerSpreadData = {}, handleTargetChanged = () => {} } = props
  const getSpreadTargetConfig = () => {
    return [
      {
        text: '内容推广',
        iconTpye: 'icon_employer_star',
        key: 8,
      },
      {
        text: '精准增粉',
        iconTpye: 'icon_employer_enterprise',
        key: 5,
      },
      {
        text: '职位急招',
        iconTpye: 'icon_job_intention',
        key: 7,
      },
      {
        text: '雇主活动',
        iconTpye: 'icon_employer_activity',
        key: 6,
      },
    ]
    // return [
    //   {
    //     text: '推广企业号',
    //     iconTpye: 'icon_employer_enterprise',
    //     key: 5,
    //   },
    //   {
    //     text: '推广雇主活动',
    //     iconTpye: 'icon_employer_activity',
    //     key: 6,
    //   },
    //   {
    //     text: '获取求职意向',
    //     iconTpye: 'icon_job_intention',
    //     key: 7,
    //   },
    // ]
  }
  const renderSpreadTargetItem = (item) => {
    const { promote_type: promoteType } = employerSpreadData
    return (
      <div
        className={`${styles.targetTabsItem} ${
          item.key === promoteType ? styles.active : ''
        }`}
        key={item.text}
        onClick={() => {
          handleTargetChanged(item)
        }}
      >
        <Text type="text_primary" size={14} style={{ color: '#4A4A4A' }}>
          <Icon
            type={item.iconTpye}
            style={{
              fontSize: '16px',
              position: 'relative',
              top: '3px',
              marginRight: '8px',
            }}
          />
          {item.text}
        </Text>
      </div>
    )
  }
  const renderTargetTabs = () => {
    return (
      <div className={`${styles.targetTabs} flex`}>
        {getSpreadTargetConfig().map(renderSpreadTargetItem)}
      </div>
    )
  }

  return (
    <div className={styles.employerSpreadProcessingTarget}>
      <ItemTitle str="主要推广目标" />
      {renderTargetTabs()}
    </div>
  )
}
