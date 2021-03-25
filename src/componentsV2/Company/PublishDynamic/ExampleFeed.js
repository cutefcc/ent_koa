import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import styles from './index.less'

function ExampleFeed({ exampleFeedData, dispatch }) {
  useEffect(() => {
    if (!exampleFeedData.length) {
      dispatch({
        type: 'company/getExampleFeedData',
        payload: { id: 734 },
      })
    }
  }, [])

  const onClick = (url) => {
    window.open(url)
  }

  return (
    <div className={styles.exampleFeedWrap}>
      <p>看看其他企业号怎么发</p>
      <div className={styles.exampleFeedsScroll}>
        <div className={styles.exampleFeeds}>
          {exampleFeedData.map(({ feed_img: img, feed_url: url }) => {
            return <img key={url} src={img} onClick={() => onClick(url)} />
          })}
        </div>
      </div>
    </div>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  exampleFeedData: state.company.exampleFeedData,
  dispatch,
}))(ExampleFeed)
