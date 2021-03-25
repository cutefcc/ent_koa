import React, { memo, useState, useEffect, useRef } from 'react'
import styles from './ExpandItem.less'

const Desc = ({ desc }) => {
  const [isNeedExpand, setIsNeedExpand] = useState(false) // 是否超出两行，即是否需要展开，默认没有超过两行
  const [isExpand, setIsExpand] = useState(false) // 在isNeedExpand===true的情况，默认初始为不展开状态
  const descriptionRef = useRef()
  useEffect(() => {
    if (
      descriptionRef.current.scrollWidth === 300 &&
      descriptionRef.current.scrollHeight > 40 &&
      !isNeedExpand
    ) {
      setIsNeedExpand(true)
    }
    return () => {}
  }, [isExpand])

  return (
    <div
      ref={descriptionRef}
      className={isExpand ? styles.descExpanded : styles.descNoExpand}
    >
      {desc}
      {isNeedExpand && !isExpand && (
        <div
          onClick={() => {
            setIsExpand(true)
          }}
          className={styles.expandBtn}
        >
          展开
        </div>
      )}
    </div>
  )
}

/** 适用于工作经历、教育经历 */
export default memo(({ data }) => {
  const len = data.length
  return data.map((item, index) => {
    return (
      <div
        // eslint-disable-next-line react/no-array-index-key
        key={`${item.subTitle}${index}`}
        className={`${styles.itemCon} ${
          len === index + 1 ? styles.itemConLast : styles.itemConNoLast
        }`}
      >
        <div
          className={styles.leftLogo}
          style={{
            backgroundImage: `url(${item.leftLogo})`,
            backgroundSize: 'cover',
          }}
        />
        <div className={styles.rightContent}>
          <div className={styles.company}>{item.title}</div>
          <div className={styles.timeAndPosition}>{item.subTitle}</div>
          {item.desc && <Desc desc={item.desc} />}
        </div>
      </div>
    )
  })
})
