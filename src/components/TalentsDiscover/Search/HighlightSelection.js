import React from 'react'
import PropTypes from 'prop-types'
import Tag from 'components/Common/CheckableTag'

export default class HighlightSelection extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
  }

  static defaultProps = {
    value: {},
  }

  handleChange = (type) => (checked) => {
    this.props.onChange({
      ...this.props.value,
      [type]: checked ? 1 : 0,
    })
  }

  render() {
    const { value } = this.props
    return (
      <div>
        <Tag
          // closable
          onChange={this.handleChange('is_211_985')}
          checked={!!value.is_211_985}
        >
          985/211
        </Tag>
      </div>
    )
  }
}
