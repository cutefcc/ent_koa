import * as React from 'react'
import { Icon, Text } from 'mm-ent-ui'
import { connect } from 'react-redux'
import { ANALYSIS_TAGS_MAP } from 'constants/talentDiscover'
import * as styles from './index.less'

@connect(() => ({}))
export default class MappingTags extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderMappingItemsTags = (item) => {
    const { onMappingTagsChanged } = this.props
    return (
      <div key={`${item.key}${item.name}`} className={styles.mappingTagsItem}>
        {`${ANALYSIS_TAGS_MAP[item.key]}：${item.name}`}
        <Icon
          type="close-outline"
          style={{ position: 'absolute', top: '6px' }}
          onClick={() => {
            onMappingTagsChanged(item, item.key)
          }}
        />
      </div>
    )
  }

  renderClearMapping = () => {
    const { onClearMapping } = this.props
    return (
      <div onClick={onClearMapping} className={styles.clearMapping}>
        <Text
          type="label"
          size={14}
          style={{ color: 'rgba(0,0,0,0.45)', background: '#fff' }}
        >
          <Icon
            type="clear_mapping_tags"
            style={{
              color: 'rgba(0,0,0,0.45)',
              marginRight: 4,
              transform: 'translateY(3px)',
            }}
          />
          清空条件
        </Text>
      </div>
    )
  }

  render() {
    const {
      mappingTags,
      mappingTags: { length = 0 },
      isShowDataAnalysis,
    } = this.props
    if (length <= 0 || !isShowDataAnalysis) return null

    return (
      <div className={`${styles.mappingTags} flex`}>
        {mappingTags.map(this.renderMappingItemsTags)}
        {this.renderClearMapping()}
      </div>
    )
  }
}
