import React from 'react'
import { Text, Popover, Icon } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

@connect(() => ({}))
export default class HighGrowthAndQualityButton extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {
      high_growth: {
        text: '',
      },
      high_quality: {
        text: '',
      },
    },
  }

  componentDidMount() {}

  handleSetContainerDom = (dom) => {
    this.containerDom = dom
  }

  handleIsRender = () => {
    const {
      data: { high_growth: highGrowth, high_quality: highQuality },
    } = this.props
    if (!highGrowth || !highQuality) return null
    const { text: highGrowthText } = highGrowth
    const { text: highQualityText } = highQuality
    if (!highQualityText && !highGrowthText) return null
    return { highGrowthText, highQualityText }
  }

  renderHighQualityPopover = (highQualityText) => {
    const title = (
      <Text size={16}>
        <Icon
          type="gem"
          style={{
            color: '#6A9BFF',
            marginRight: 4,
          }}
        />
        优质人才
      </Text>
    )
    const content = (
      <div style={{ paddingBottom: '17px' }}>
        <Text>{highQualityText}</Text>
      </div>
    )
    return (
      <Popover
        title={title}
        // trigger="click"
        content={content}
        placement="bottomLeft"
        autoAdjustOverflow={false}
        getPopupContainer={() => this.containerDom}
        // width={450}
        onVisibleChange={() => {}}
      >
        <span className="margin-right-8 cursor-pointer">
          <Text type="label" size={12}>
            <Icon
              type="gem"
              style={{
                color: '#6A9BFF',
                marginRight: 4,
              }}
            />
            优质人才
          </Text>
        </span>
      </Popover>
    )
  }

  renderHighGrowthPopover = (highGrowthText) => {
    const title = (
      <Text size={16}>
        <Icon
          type="lightning"
          style={{
            color: '#FFBD08',
            marginRight: 4,
          }}
        />
        高速成长型人才
      </Text>
    )
    const content = (
      <div style={{ paddingBottom: '17px' }}>
        <Text>{highGrowthText}</Text>
      </div>
    )
    return (
      <Popover
        title={title}
        content={content}
        placement="bottomLeft"
        autoAdjustOverflow={false}
        getPopupContainer={() => this.containerDom}
        // width={450}
        onVisibleChange={() => {}}
      >
        <span className="margin-right-8 cursor-pointer">
          <Text type="label" size={12}>
            <Icon
              type="lightning"
              style={{
                color: '#FFBD08',
                marginRight: 4,
              }}
            />
            高速成长
          </Text>
        </span>
      </Popover>
    )
  }

  render() {
    const obj = this.handleIsRender()
    if (!obj) return null
    const { highGrowthText, highQualityText } = obj

    return (
      <div style={{ display: 'inline-block' }} ref={this.handleSetContainerDom}>
        {highGrowthText && this.renderHighGrowthPopover(highGrowthText)}
        {highQualityText && this.renderHighQualityPopover(highQualityText)}
      </div>
    )
  }
}
