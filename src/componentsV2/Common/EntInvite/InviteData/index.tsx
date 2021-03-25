import * as React from 'react'
import { connect } from 'react-redux'
import { compact, replaceCompanySpecialCharacter } from 'utils'
import * as R from 'ramda'
import * as styles from './index.less'
import { INVITE_FILTER_MAP, INVITE_FILTER_SORT } from 'constants/talentDiscover'

export interface Props {
  data: object
  config?: object
  profession: object
  jobs: object[]
}

export interface GlobalStore {}

export interface GlobalState {
  global: GlobalStore
}

@connect((state: GlobalState) => ({
  config: state.global.config,
  profession: state.global.profession,
  jobs: state.global.jobs,
}))
export default class InviteData extends React.PureComponent<
  Props & GlobalStore,
  State
> {
  formatSearchData = (val) => {
    const { config = {}, profession = [], jobs = [] } = this.props
    const degreeMap = R.propOr([], 'degree', config)
    const worktimeMap = R.propOr([], 'worktime', config)
    const professionMap = profession.map((item) => ({
      value: item.code,
      label: item.name,
    }))
    const res = []

    const findConf = (config) => (value) =>
      R.propOr(
        '',
        'label',
        R.find((conf) => `${conf.value}` === `${value}`, config)
      )

    const findJob = (config) => (value) =>
      R.propOr(
        '',
        'position',
        R.find((conf) => `${conf.jid}` === `${value}`, config)
      )

    // 普通数据转化，将 ',' 换为 '/'
    const transCommonValue = R.compose(R.join('/'), compact, R.split(','))

    // 1. 由于 985 211，会用 is_985, is_211 字段特殊标识，所以这里需要将 985， 211 特殊添加到 schools 中
    // 2. 由于省份和城市是单独存的，这里需要合并展示
    const formatData = {
      ...R.omit(['provinces', 'cities', 'is_985', 'is_211'], val),
      schools: compact([
        val.schools || '',
        val.is_985 ? '985' : '',
        val.is_211 ? '211' : '',
      ]).join(','),
      provinces_cities: compact([val.provinces || '', val.cities || '']).join(
        ','
      ),
    }

    // 特殊数据的单独映射关系
    const valuesMapFunc = {
      worktimes: R.compose(
        R.join('/'),
        compact,
        R.map(findConf(worktimeMap)),
        R.split(',')
      ),
      degrees: R.compose(
        R.join('/'),
        compact,
        R.map(findConf(degreeMap)),
        R.split(',')
      ),
      companys: R.compose(
        R.join('/'),
        R.uniq,
        compact,
        R.split(','),
        replaceCompanySpecialCharacter
      ),
      professions: R.compose(
        R.join('/'),
        compact,
        R.map(findConf(professionMap)),
        R.split(',')
      ),
      jid: R.compose(R.join('/'), compact, R.map(findJob(jobs)), R.split(',')),
    }

    R.forEachObjIndexed((value, key) => {
      if (!value) {
        return
      }

      res.push({
        key: key,
        value: valuesMapFunc[key]
          ? valuesMapFunc[key](`${value}`)
          : transCommonValue(`${value}`),
      })
    }, formatData)

    const filterRes = R.filter((v) => !!INVITE_FILTER_MAP[v.key], res)
    const func = (v) => R.propOr(-1, v, INVITE_FILTER_SORT)
    const sortByKey = R.sortBy(R.compose(func, R.prop('key')))

    return sortByKey(filterRes)
  }

  renderSearchData = (val) => {
    let { key, value } = val
    const showKey = INVITE_FILTER_MAP[key]
    if (key === 'search_total') {
      value =
        Number.parseInt(value) >= 10000
          ? '1w+ 活跃人才 +30天内新增人才'
          : `${value} 人+30天内新增人才`
    }
    if (!showKey) {
      return null
    }
    return (
      <div
        className={`${styles.item} flex flex-justify-start flex-align-start`}
      >
        <div className={styles.left}>{showKey}</div>
        <div className={styles.right}>{value}</div>
      </div>
    )
  }

  render() {
    const { data = {} } = this.props
    const empty = R.isEmpty(data)
    if (empty) {
      return null
    }
    return (
      <div className={styles.inviteData}>
        {this.formatSearchData(data).map(this.renderSearchData)}
      </div>
    )
  }
}
