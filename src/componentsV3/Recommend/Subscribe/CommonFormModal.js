/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Button, Input, Popconfirm } from 'antd'
import * as R from 'ramda'
import FormFields from 'constants/subscribe'
import { MUNICIPALITY } from 'constants'
import CommonSelect from './CommonSelect'
import CommonInput from './CommonInput'
import CustomCascader from './CustomCascader'
import styles from './commonFormModal.less'

function CommonFormModal({
  config,
  profession,
  dictionary,
  dispatch,
  condition,
  onSubmit,
  onCancel,
  onDelete,
  mode,
}) {
  const [params, setParams] = useState({
    title: '',
    companyscope: 0,
    ...condition,
  })
  const [positionSugs, setPositionSugs] = useState([])
  const [companySugs, setCompanySugs] = useState([])
  const [schoolSugs, setSchoolSugs] = useState([])

  const fetchProfession = () => dispatch({ type: 'global/fetchProfession' })

  const fetchConfig = () =>
    dispatch({
      type: 'global/fetchConfig',
    })

  useEffect(() => {
    fetchProfession()
    if (R.isEmpty(config)) {
      fetchConfig()
    }
  }, [])

  const getFormatValue = (values) => ({
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
  const getFormatOption = (options, valueField, labelField) =>
    options.map((item) => ({
      value: item[valueField],
      label: item[labelField],
    }))

  const getCityOptions = () => {
    const { loc = [] } = dictionary
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
                label: '??????',
              },
              ...cities.map(getCityOption),
            ],
      })),
    ]
  }
  const getOptions = (option) => {
    const sugs = {
      positions: positionSugs,
      companys: companySugs,
      schools: schoolSugs,
    }[option.id]
    switch (option.id) {
      case 'professions':
        return profession.map((v) => ({
          value: v.code,
          label: v.name,
        }))
      case 'region':
        return getCityOptions()
      case 'worktimes':
        return R.propOr([], 'worktime', config)
      case 'degrees':
        return R.propOr([], 'degree', config)
      default:
        return R.isEmpty(sugs) || R.isNil(sugs)
          ? option.options || []
          : getFormatOption(sugs.slice(0, 10), 'name', 'name')
    }
  }

  const fetchSugs = (keyword, type) =>
    dispatch({
      type,
      payload: {
        keyword,
      },
    }).then(({ data }) => {
      return data || []
    })

  const handleRegionChange = (value) => {
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
    setParams({
      ...params,
      cities: R.propOr([], 'cities', formatValues).join(','),
      provinces: R.propOr([], 'provinces', formatValues).join(','),
    })
  }
  const handleSchoolChange = (value) => {
    let list = R.without(['', undefined, null], value.split(','))
    const is985 = list.includes('985')
    const is211 = list.includes('211')
    if (is985) {
      list = R.without(['985'], list)
    }
    if (is211) {
      list = R.without(['211'], list)
    }

    setParams({
      ...params,
      schools: list.join(','),
      is_211: is211 ? 1 : 0,
      is_985: is985 ? 1 : 0,
    })
  }

  const handleChange = (id, value) => {
    if (id === 'region') {
      handleRegionChange(value)
    } else if (id === 'schools') {
      handleSchoolChange(value)
    } else {
      setParams({ ...params, [id]: value })
    }
  }

  let searchSugTimer = null
  const handleSearch = (id, value) => {
    if (searchSugTimer) {
      clearTimeout(searchSugTimer)
    }
    let fetchType = ''
    switch (id) {
      case 'positions':
        fetchType = 'global/fetchPositionSugs'
        searchSugTimer = setTimeout(async () => {
          const sugs = await fetchSugs(value, fetchType, 'positionSugs')
          setPositionSugs(sugs)
        }, 500)
        break
      case 'companys':
        fetchType = 'global/fetchCompanySugs'
        searchSugTimer = setTimeout(async () => {
          const sugs = await fetchSugs(value, fetchType, 'companySugs')
          setCompanySugs(sugs)
        }, 500)
        break
      case 'schools':
        fetchType = 'global/fetchSchoolSugs'
        searchSugTimer = setTimeout(async () => {
          const sugs = await fetchSugs(value, fetchType, 'schoolSugs')
          setSchoolSugs(sugs)
        }, 500)
        break
      default:
    }
  }

  const isEmptyParams = () => {
    const filterArray = [
      'fans_cnt',
      'delivery_cnt',
      '_cnt',
      'id',
      'has_dynamic_cnt',
      'statistics_new_add',
      'statistics_total',
      'view_statistics',
    ]
    return Object.entries(params)
      .map(([k, v]) => {
        if (!filterArray.includes(k)) return v
      })
      .filter((k) => typeof k !== 'undefined')
      .every((v) => !!!v)
  }

  return (
    <Modal
      title={condition.id ? '????????????' : '????????????'}
      width={560}
      visible
      maskClosable={false}
      footer={
        <div className={styles.modalFooter}>
          <div className={styles.left}>
            {/* {
              !isEmptyParams() ? <p>???????????????</p> : null
            } */}
            <div>
              {condition.id ? (
                <Popconfirm
                  title="??????????????????????????????"
                  onConfirm={() => onDelete(condition.id)}
                >
                  <Button style={{ color: '#FF4D3C' }} type="link">
                    ????????????
                  </Button>
                </Popconfirm>
              ) : null}
              {!isEmptyParams() ? (
                <Button
                  onClick={() => setParams({ title: '', companyscope: 0 })}
                  style={{ color: 'rgba(0,0,0,0.65)' }}
                  type="link"
                >
                  ????????????
                </Button>
              ) : null}
            </div>
          </div>
          <div>
            <Button onClick={onCancel}>??????</Button>
            <Button
              type="primary"
              disabled={isEmptyParams()}
              onClick={() => onSubmit(params)}
            >
              ??????
            </Button>
          </div>
        </div>
      }
      className={styles.commonFormModal}
      onCancel={onCancel}
    >
      {mode !== 'search' ? (
        <div style={{ marginTop: '24px' }}>
          <p className={styles.formItemTitle}>????????????</p>
          <Input
            placeholder="?????????"
            style={{ width: 512 }}
            maxLength={10}
            suffix={`${params.title.length}/10`}
            defaultValue={condition.title}
            value={params.title}
            onChange={(e) => setParams({ ...params, title: e.target.value })}
          />
        </div>
      ) : null}
      {FormFields.map((item) => {
        const Component = {
          select: CommonSelect,
          input: CommonInput,
          cascader: CustomCascader,
        }[item.component]
        const value = getFormatValue(params)
        return (
          <Component
            className={styles.formItem}
            key={item.id}
            item={item}
            params={params}
            options={getOptions(item)}
            value={value[item.id]}
            onChange={handleChange}
            onSearch={handleSearch}
          />
        )
      })}
    </Modal>
  )
}

export default connect((state, dispatch) => ({
  config: state.global.config,
  dictionary: state.global.dictionary,
  currentUser: state.global.currentUser,
  profession: state.global.profession,
  dispatch,
}))(CommonFormModal)
