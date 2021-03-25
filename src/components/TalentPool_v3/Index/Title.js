import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'

export default class Title extends React.PureComponent {
  static propTypes = {
    title: PropTypes.object,
    tabs: PropTypes.array,
    onTabChange: PropTypes.func,
    activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    extraComp: PropTypes.element,
  }

  static defaultProps = {
    title: {},
    tabs: [],
    onTabChange: () => {},
    activeTab: '',
    disabled: false,
    extraComp: null,
  }

  handleTabChange = (tab) => (e) => {
    if (!this.props.disabled) {
      this.props.onTabChange(tab, e)
    }
  }

  renderTabs = () => (
    <ul className="flex ul-without-style">
      {this.props.tabs.map((tab) => (
        <li
          key={tab.value}
          className={`margin-left-10 color-common font-size-14 ${
            this.props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <span
            onClick={this.handleTabChange(tab.value)}
            className={
              this.props.activeTab === tab.value
                ? 'color-blue font-weight-bold'
                : ''
            }
            attr={tab.attr ? tab.attr : ''}
            trackparam={JSON.stringify(tab.trackParam || {})}
          >
            {tab.label}
          </span>
        </li>
      ))}
    </ul>
  )

  render() {
    return (
      <div
        style={{
          borderBottom: '1px solid #eee',
          padding: '12px 0',
          margin: '0 16px',
        }}
        className="flex space-between"
      >
        <h5
          className="font-size-14 color-stress font-weight-bold"
          style={{
            marginBottom: 0,
          }}
        >
          {this.props.title}
        </h5>
        <div className="flex">
          {R.propOr(0, 'length', this.props.tabs) > 0 && this.renderTabs()}
          {this.props.extraComp}
        </div>
      </div>
    )
  }
}
