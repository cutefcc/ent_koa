import * as React from 'react'
import * as styles from './index.less'

const CircularProcessBar = ({
  title,
  showName,
  percent = 0,
  radius = 40,
  width = 20,
  style = {},
  cardStyle = { width: 250 },
}) => {
  const TOTAL_DISTANCE = 232
  const PIE = 3.1415926
  const DASHED_WIDTH = 2 * (2 * PIE * radius) // large enough
  const totalWidth = radius * 2 + width
  const boxStyle = {
    width: totalWidth,
    height: totalWidth,
  }
  const cx = (totalWidth - 10) / 2
  const dashArray = `${TOTAL_DISTANCE * percent} ${DASHED_WIDTH}`

  return (
    <div className={styles.card} style={{ width: totalWidth, ...cardStyle }}>
      <div className={styles.box} style={{ width: totalWidth }}>
        <div className={styles.percent} style={boxStyle}>
          <svg style={boxStyle}>
            <circle cx={cx} cy={cx} r={radius}></circle>
            {percent > 0 && (
              <circle
                cx={cx}
                cy={cx}
                r={radius}
                stroke-dasharray={`${dashArray}`}
              ></circle>
            )}
          </svg>

          <div className={styles.number}>
            {showName !== '暂无数据' ? (
              <h2 style={style}>{showName}</h2>
            ) : (
              <h3>{showName}</h3>
            )}
          </div>
        </div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  )
}

export default CircularProcessBar
