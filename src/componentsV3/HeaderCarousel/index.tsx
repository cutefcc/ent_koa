import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import Carousel from 'antd/lib/carousel'
import * as styles from './index.less'
import 'antd/lib/carousel/style/index.less'

export interface Props {
  list: object
  urlPrefix: string
  dispatch: Function
}

@connect((state) => ({
  list: state.talentMap.totalList,
  urlPrefix: state.global.urlPrefix,
}))
export default class HeaderCarousel extends React.PureComponent<Props> {
  renderCard = (data, index) => {
    return (
      <div key={index} className={styles.msg}>
        {data.msg}
      </div>
    )
  }

  click = () => {
    this.props.dispatch({
      type: 'talentMap/setVisible',
      payload: true,
    })
  }

  render() {
    const list = R.pathOr([], ['props', 'list'], this)
    if (list.length === 0) {
      return null
    }

    return (
      <div className={styles.carouselWrapper} onClick={this.click.bind(this)}>
        <img
          className={styles.headerImage}
          src={`${R.pathOr(
            [],
            ['props', 'urlPrefix'],
            this
          )}/images/v3/header/header_carousel.png`}
          alt="emptyImage"
        />
        <Carousel
          dotPosition="right"
          autoplay
          className={styles.carousel}
          dots={false}
          autoplaySpeed={3000}
        >
          {list.map((talent, index) => this.renderCard(talent, index))}
        </Carousel>
      </div>
    )
  }
}
