import React from 'react'
import * as styles from './index.less'

export default function EchartsBottom(props) {
  return (
    <div className={styles.content}>
      <div className={styles.leftContent}>
        {Object.values(props.echartsCommon).map((item, index) => (
          <div key={index} className={styles.singleContent}>
            {item.isLine ? (
              <div className={styles.showColor}>
                <div
                  className={styles.showColorLine}
                  style={{ backgroundColor: item.color }}
                />
                <div
                  className={styles.showColorLineCircle}
                  style={{ backgroundColor: item.color }}
                />
              </div>
            ) : (
              <div
                className={styles.showColor}
                style={{ backgroundColor: item.color }}
              />
            )}
            <div className={styles.tips}>{item.name}</div>
          </div>
        ))}
      </div>
      <div className={styles.rightContent}>
        <div className={styles.rightTips}>单位：万</div>
        <div className={styles.rightTips}>来源：脉脉数据研究院</div>
      </div>
    </div>
  )
}
