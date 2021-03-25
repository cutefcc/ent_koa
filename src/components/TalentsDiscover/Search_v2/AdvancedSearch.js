import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  DEFAULT_SCHOOL_OPTIONS,
  DEFAULT_POSITION_OPTIONS,
  DEFAULT_COMPANY_OPTIONS,
  MUNICIPALITY,
  COMPANY_EXTRA_OPTIONS,
} from 'constants'
import * as R from 'ramda'
import { Icon } from 'mm-ent-ui'
import EntInvite from 'componentsV2/Common/EntInvite'
import Facet from './Facet'
import styles from './advancedSearch.less'
import EditConditionModal from './EditConditionModal'

@connect((state) => ({
  dictionary: state.global.dictionary,
  currentUser: state.global.currentUser,
  profession: state.global.profession,
  currentConditionId: state.subscribe.currentConditionId,
  conditionStat: state.subscribe.conditionStat,
  config: state.global.config,
  configLoading: state.loading.effects['global/fetchConfig'],
}))
class AdvancedSearch extends React.PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      positionSugs: [],
      schoolSugs: [],
      companySugs: [],
      value: this.getFormatValue(props.value),
      showEditConditionModal: false,
    }
  }
  componentDidMount() {
    this.fetchProfession()
    if (R.isEmpty(this.props.config) && !this.props.configLoading) {
      this.fetchConfig()
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.props.value) {
      const value = this.getFormatValue(newProps.value)
      this.setState({ value })
    }
  }
  getFormatValue = (values) => ({
    ...values,
    cities: R.without([''], (R.propOr('', 'cities', values) || '').split(',')),
    provinces: R.without(
      [''],
      (R.propOr('', 'provinces', values) || '').split(',')
    ),
    schools: [
      ...R.without([''], (R.propOr('', 'schools', values) || '').split(',')),
      ...(values.is_211 ? ['211'] : []),
      ...(values.is_985 ? ['985'] : []),
    ].join(','),
  })
  getFormatOption = (options, valueField, labelField) =>
    options.map((item) => ({
      value: item[valueField],
      label: item[labelField],
    }))
  getPositionOptions = () => {
    const { positionSugs } = this.state
    return R.isEmpty(positionSugs)
      ? DEFAULT_POSITION_OPTIONS
      : this.getFormatOption(positionSugs.slice(0, 10), 'name', 'name')
  }
  getCityOptions = () => {
    const { loc = [] } = this.props.dictionary
    const getCityOption = ({ city }) => ({
      value: `l2-${city}`,
      label: city,
    })
    return [
      ...loc.map(({ province, cities = [] }) => ({
        value: province,
        label: province,
        children: MUNICIPALITY.includes(province)
          ? [
              {
                value: province,
                label: province,
              },
            ]
          : [
              {
                value: province,
                label: '全部',
              },
              ...cities.map(getCityOption),
            ],
      })),
    ]
  }
  getCompanyOptions = () => {
    const { companySugs } = this.state
    if (R.isEmpty(companySugs)) {
      return DEFAULT_COMPANY_OPTIONS
    }
    return this.getFormatOption(companySugs.slice(0, 10), 'name', 'name')
  }
  getSchoolOptions = () => {
    const { schoolSugs } = this.state
    if (R.isEmpty(schoolSugs)) {
      return DEFAULT_SCHOOL_OPTIONS
    }
    return this.getFormatOption(schoolSugs.slice(0, 10), 'name', 'name')
  }
  getProfessionOptions = () =>
    this.props.profession.map((item) => ({
      value: item.code,
      label: item.name,
    }))
  fetchProfession = () =>
    this.props.dispatch({ type: 'global/fetchProfession' })
  fetchCompanySugs = (keyword) =>
    this.props
      .dispatch({
        type: 'global/fetchCompanySugs',
        payload: {
          keyword,
        },
      })
      .then(({ data }) => {
        this.setState({
          companySugs: data || [],
        })
      })
  fetchPositionSugs = (keyword) =>
    this.props
      .dispatch({
        type: 'global/fetchPositionSugs',
        payload: {
          keyword,
        },
      })
      .then(({ data }) => {
        this.setState({
          positionSugs: data || [],
        })
      })

  fetchSchoolSugs = (keyword) =>
    this.props
      .dispatch({
        type: 'global/fetchSchoolSugs',
        payload: {
          keyword,
        },
      })
      .then(({ data }) => {
        this.setState({
          schoolSugs: data || [],
        })
      })

  fetchConfig = () =>
    this.props.dispatch({
      type: 'global/fetchConfig',
    })

  handleCommonFacetChange = (key) => (value) =>
    this.props.onChange({
      ...this.props.value,
      [key]: value,
    })

  handleRegionChange = (value) => {
    const formatValues = R.without([''], value.split(',')).reduce(
      (res, item) => {
        const list = item.split('-')
        if (list.length === 2) {
          res.cities = [...res.cities, list[1]]
        } else {
          res.provinces = [...res.provinces, item]
        }
        return res
      },
      { cities: [], provinces: [] }
    )
    this.props.onChange({
      ...this.props.value,
      cities: R.propOr([], 'cities', formatValues).join(','),
      provinces: R.propOr([], 'provinces', formatValues).join(','),
    })
  }
  handleSchoolChange = (value) => {
    let list = R.without(['', undefined, null], value.split(','))
    const is985 = list.includes('985')
    const is211 = list.includes('211')
    if (is985) {
      list = R.without(['985'], list)
    }
    if (is211) {
      list = R.without(['211'], list)
    }

    this.props.onChange({
      ...this.props.value,
      schools: list.join(','),
      is_211: is211 ? 1 : 0,
      is_985: is985 ? 1 : 0,
    })
  }
  handlePositionOptionsChange = (value) => {
    if (this.positionTimer) {
      clearTimeout(this.positionTimer)
    }
    this.positionTimer = setTimeout(() => this.fetchPositionSugs(value), 500)
  }
  handleCompanyOptionsChange = (value) => {
    if (this.companyTimer) {
      clearTimeout(this.companyTimer)
    }
    this.companyTimer = setTimeout(() => this.fetchCompanySugs(value), 500)
  }
  handleSchoolOptionsChange = (value) => {
    if (this.schoolTimer) {
      clearTimeout(this.schoolTimer)
    }
    this.schoolTimer = setTimeout(() => this.fetchSchoolSugs(value), 500)
  }
  handleHideEditConditionModal = () =>
    this.setState({
      showEditConditionModal: false,
    })
  handleSaveCondition = () =>
    this.setState({
      showEditConditionModal: true,
    })

  render() {
    const { value } = this.state
    const province = R.propOr([], 'provinces', value) || []
    const city = R.propOr([], 'cities', value) || []
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <span onClick={this.handleSaveCondition}>
            <Icon type="download" className="margin-right-5" />
            保存订阅人才
          </span>
        </div>
        <div className={styles.item}>
          <Facet
            title="关键词"
            value={value.query}
            inputType="input"
            placeholder="添加关键词"
            onChange={this.handleCommonFacetChange('query')}
            inputProps={{
              placeholder: '输入关键词',
            }}
          />
        </div>
        <div className={styles.item}>
          <Facet
            title="职位技能"
            value={R.propOr('', 'positions', value)}
            inputType="select"
            placeholder="添加职位"
            onChange={this.handleCommonFacetChange('positions')}
            multiple
            inputProps={{
              mode: 'tags',
              placeholder: '请输入职位名或技能',
              level: 1,
              onSearch: this.handlePositionOptionsChange,
              options: this.getPositionOptions(),
            }}
          />
        </div>
        <div className={styles.item}>
          <Facet
            title="城市地区"
            value={[...province, ...city.map((i) => `l2-${i}`)].join(',')}
            inputType="select"
            placeholder="添加城市或地区"
            onChange={this.handleRegionChange}
            multiple
            inputProps={{
              placeholder: '选择城市或地区(可多选)',
              level: 2,
              options: this.getCityOptions(),
              showSearch: true,
            }}
          />
        </div>
        <div className={styles.item}>
          <Facet
            title="工作年限"
            value={value.worktimes || ''}
            inputType="select"
            placeholder="添加工作年限"
            onChange={this.handleCommonFacetChange('worktimes')}
            multiple
            inputProps={{
              placeholder: '选择工作年限（可多选）',
              level: 1,
              options: R.propOr([], 'worktime', this.props.config),
              showSearch: false,
            }}
          />
        </div>
        <div className={styles.item}>
          <Facet
            title="学历要求"
            value={R.propOr('', 'degrees', value)}
            inputType="select"
            placeholder="添加学历"
            onChange={this.handleCommonFacetChange('degrees')}
            multiple
            inputProps={{
              placeholder: '选择学历（可多选）',
              level: 1,
              options: R.propOr([], 'degree', this.props.config),
              showSearch: true,
            }}
          />
        </div>
        <div className={styles.item}>
          <Facet
            title="就职公司"
            value={R.propOr('', 'companys', value)}
            inputType="select"
            placeholder="添加公司"
            onChange={this.handleCommonFacetChange('companys')}
            multiple
            extraParam={{
              onChange: this.handleCommonFacetChange('companyscope'),
              options: COMPANY_EXTRA_OPTIONS,
              value: value.companyscope,
            }}
            inputProps={{
              placeholder: '输入公司（可多选）',
              level: 1,
              onSearch: this.handleCompanyOptionsChange,
              options: this.getCompanyOptions(),
              mode: 'tags',
            }}
          />
        </div>
        <div className={styles.item}>
          <Facet
            title="毕业学校"
            value={R.propOr('', 'schools', value)}
            inputType="select"
            placeholder="添加学校"
            onChange={this.handleSchoolChange}
            multiple
            inputProps={{
              placeholder: '输入学校（可多选）',
              level: 1,
              onSearch: this.handleSchoolOptionsChange,
              options: this.getSchoolOptions(),
              mode: 'tags',
            }}
          />
        </div>
        <div className={styles.item}>
          <Facet
            title="所属行业"
            value={R.propOr('', 'professions', value)}
            inputType="select"
            placeholder="添加行业"
            onChange={this.handleCommonFacetChange('professions')}
            multiple
            inputProps={{
              placeholder: '选择行业（可多选）',
              level: 1,
              options: this.getProfessionOptions(),
              showSearch: true,
            }}
          />
        </div>
        {this.state.showEditConditionModal && (
          <EditConditionModal
            onCancel={this.handleHideEditConditionModal}
            data={this.props.value}
            id={this.props.currentConditionId}
          />
        )}
        <EntInvite
          data={this.props.value}
          onOldVersionChange={this.props.onChange}
        />
      </div>
    )
  }
}
export default AdvancedSearch
