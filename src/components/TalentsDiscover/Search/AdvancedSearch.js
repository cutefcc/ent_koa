import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
// import * as R from 'ramda'

// import {flatternCities} from 'utils/talentDiscover'
import CitySelection from './CitySelection'
import WorktimeSelection from './worktimeSelection'
import DegreeSelection from './degreeSelection'
// import ProfeesionSelection from './pofessionSelection'
import V5ProfessionSelection from './V5ProfessionSelection'
// import SchollLevelOption from './schollLevelSelection'
import HighlightSelection from './HighlightSelection'
import SearchInput from './SearchInput'

import styles from './advancedSearch.less'

@connect((state) => ({
  dictionary: state.global.dictionary,
  currentUser: state.global.currentUser,
}))
@Form.create()
class AdvancedSearch extends React.PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = props.value
  }

  handleValueChange = (key) => (value) => {
    this.props.onChange({
      ...this.props.value,
      [key]: value,
    })
  }

  handleCityChange = (value = []) => {
    const [province, city] = value
    this.props.onChange({
      ...this.props.value,
      province,
      city,
    })
  }

  handlePfmjChange = (value = []) => {
    const [profession, major] = value
    this.props.onChange({
      ...this.props.value,
      profession,
      major,
    })
  }

  handlePfChange = (value = []) => {
    const [pf] = value
    this.props.onChange({
      ...this.props.value,
      pf,
    })
  }

  handleHighlightChange = (value) => {
    this.props.onChange({
      ...this.props.value,
      ...value,
    })
  }

  render() {
    const { dictionary, value } = this.props
    return (
      <div>
        <div className={`${styles.item} ${styles.searchInput}`}>
          <h3 className={styles.title}>搜索</h3>
          <SearchInput
            onSearch={this.handleValueChange('query')}
            value={value.keyword}
            autoFocus
          />
        </div>
        <div className={`${styles.item} ${styles.city}`}>
          <h3 className={styles.title}>地区</h3>
          <CitySelection
            onChange={this.handleCityChange}
            value={value.city ? [value.province, value.city] : [value.province]}
          />
        </div>
        <div className={`${styles.item} ${styles.profession}`}>
          <h3 className={styles.title}>行业</h3>
          {/* <ProfeesionSelection
            onChange={this.handlePfmjChange}
            value={[value.profession, value.major]}
            pfmj={dictionary.pfmj}
          /> */}
          <V5ProfessionSelection
            onChange={this.handlePfChange}
            value={[value.pf]}
            pfmj={dictionary.pfmj}
          />
        </div>
        <div className={`${styles.item} ${styles.worktime}`}>
          <h3 className={styles.title}>工作年限</h3>
          <WorktimeSelection
            onChange={this.handleValueChange('work_time')}
            value={value.work_time}
          />
        </div>
        <div className={`${styles.item} ${styles.degree}`}>
          <h3 className={styles.title}>最低学历要求</h3>
          <DegreeSelection
            onChange={this.handleValueChange('degree')}
            value={value.degree}
          />
        </div>
        <div className={`${styles.item} ${styles.schollLevel}`}>
          {/* <h3 className={styles.title}>亮点</h3> */}
          <h3 className={styles.title}>学校要求</h3>
          {/* <SchollLevelOption
            onChange={this.handleValueChange('is_211_985')}
            value={value.is_211_985}
          /> */}
          <HighlightSelection
            onChange={this.handleHighlightChange}
            value={{ is_211_985: value.is_211_985 }}
          />
        </div>
      </div>
    )
  }
}

export default AdvancedSearch
