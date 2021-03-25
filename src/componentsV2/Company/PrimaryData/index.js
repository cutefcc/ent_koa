import React from 'react'
import { Text } from 'mm-ent-ui'
import styles from './index.less'

export default function PrimaryData(props) {
  const renderSinglePrimaryIndex = (config, index) => {
    const { data = {}, webcid } = props
    const weeklyIncValue = data[config.weeklyIncreaseKey]
    const isRank = config.totalKey === 'month_influence_score'
    /* eslint-disable */
    const content = (
      <div className={styles.primaryIndexItem} key={config.title}>
        <Text type="text_secondary" size={14}>
          {config.title}
        </Text>
        <Text
          type="title"
          size={28}
          style={isRank ? { color: '#3375FF', cursor: 'pointer' } : {}}
          onClick={() => {
            if (!isRank) return
            window.open(`https://maimai.cn/company/rank_list?webcid=${webcid}`)
          }}
        >
          {data[config.totalKey] || '-'}
        </Text>
        <Text type="text_common" size={14}>
          {isRank ? '排名' : '本周'}
          {` `}
          {isRank ? (
            <span>{weeklyIncValue || '--'}</span>
          ) : (
            <span className={weeklyIncValue ? 'color-blue450' : ''}>
              {weeklyIncValue
                ? weeklyIncValue > 0
                  ? `+${weeklyIncValue}`
                  : weeklyIncValue
                : '--'}
            </span>
          )}
        </Text>
      </div>
    )
    return index !== 0 ? (
      <div key={config.title} className={styles.primaryIndexItemContainer}>
        <span className={styles.seperator} />
        {content}
      </div>
    ) : (
      content
    )
  }

  const configs = [
    {
      title: '企业影响力',
      totalKey: 'month_influence_score',
      weeklyIncreaseKey: 'month_influence_rank',
    },
    {
      title: '粉丝数',
      totalKey: 'total_follows_uv',
      weeklyIncreaseKey: 'week_follows_uv',
    },
    {
      title: '企业号累计访问量',
      totalKey: 'total_visitors_pv',
      weeklyIncreaseKey: 'week_visitors_pv',
    },
    {
      title: '动态累计曝光量',
      totalKey: 'total_feeds_show_pv',
      weeklyIncreaseKey: 'week_feeds_show_pv',
    },
  ]

  return (
    <div className={styles.primaryIndex}>
      {configs.map(renderSinglePrimaryIndex)}
    </div>
  )
}
