import React from 'react'
import { Text, MUIIcon } from 'mm-ent-ui'
import * as R from 'ramda'
import { Select, TreeSelect, InputNumber, Tooltip, Spin } from 'antd'
import ItemTitle from './ItemTitle'
import styles from './SpreadPeople.less'

const { Option } = Select
const { SHOW_PARENT } = TreeSelect

export default function SpreadPeople(props) {
  const {
    positionOptions: positionData,
    companyOptions: companyData,
    employerBalance: employerPromoteNbr = 0,
    worktimeData,
    professionData,
    degreeData,
    dictionaryData,
    preData,
    employerSpreadData,
    handleCitysChange,
    handlePositionSkillChange,
    handleCompanyChange,
    handlePositionOptionsChange,
    handleCompanyOptionsChange,
    handleDegreeChange,
    handleworktimeChange,
    handleProfessionChange,
    handlerConsumeNumChange,
    handleFanChange,
    preCountLoading,
    funOptions = [
      {
        value: -1,
        name: '不限',
      },
      {
        value: 1,
        name: '是',
      },
      {
        value: 0,
        name: '否',
      },
    ],
  } = props

  const {
    consume_num: consumeNum = 1,
    is_fan: isFan,
    promote_type: promoteType = 8,
    push_type: pushType = 1,
  } = employerSpreadData
  const { exposure_max = 100000 } = preData
  const exposure_maxOne = isFan !== 1 ? `${exposure_max}＋` : exposure_max
  let consumeMax = Math.floor(employerPromoteNbr / (isFan === 1 ? 1 : 2))
  const isFanStatus = isFan === 1
  if (isFanStatus && exposure_max <= 3000 && consumeMax > 3000) {
    consumeMax = exposure_max
  } else if (isFanStatus && exposure_max > 3000 && consumeMax > 3000) {
    consumeMax = 3000
  } else if (!isFanStatus && consumeMax > 3000) {
    consumeMax = 3000
  }
  // consumeMax = consumeMax > exposure_max ? exposure_max : consumeMax
  const renderSpreadPeople = () => {
    const { loc = [] } = dictionaryData
    loc.forEach((item, index) => {
      // eslint-disable-next-line no-param-reassign
      item.title = item.province
      // eslint-disable-next-line no-param-reassign
      item.value = item.province
      // eslint-disable-next-line no-param-reassign
      item.key = `${index}-${item.province}`
      // eslint-disable-next-line no-param-reassign
      item.children = R.propOr([], 'cities', item)
        .filter((i) => {
          return i.city !== '其它' && i.city !== item.province
        })
        .map((cityItem, cityItemIndex) => {
          // 针对 青海下面的 海南藏族自治州
          if (item.value === '青海' && cityItem.city === '海南') {
            return {
              title: '海南藏族自治州',
              value: '海南藏族自治州',
              key: `${cityItemIndex}-海南藏族自治州`,
            }
          }
          return {
            title: cityItem.city,
            value: cityItem.city,
            key: `${cityItemIndex}-${cityItem.city}`,
          }
        })
    })

    const renderfunOptions = funOptions.map((item) => {
      return (
        <Option key={item.value} value={item.value}>
          {item.name}
        </Option>
      )
    })

    const positionSkillsOptions = positionData.map((item) => {
      return <Option key={item.value}>{item.value}</Option>
    })
    const getCompanyOptions = companyData.map((item) => {
      return (
        <Option key={item.label} value={item.label} data={item.value}>
          {item.label}
        </Option>
      )
    })
    const worktimeOptions = worktimeData.map((item) => {
      return <Option key={item.value}>{item.label}</Option>
    })
    const professionOptions = professionData.map((item) => {
      return (
        <Option key={item.code} value={item.code}>
          {item.name}
        </Option>
      )
    })
    const degreeOptions = degreeData.map((item) => {
      return (
        <Option key={item.label} value={String(item.value)}>
          {item.label}
        </Option>
      )
    })
    const cityProps = {
      treeData: loc,
      value: R.propOr(undefined, 'provinces', employerSpreadData),
      onChange: handleCitysChange,
      treeCheckable: true,
      dropdownStyle: { maxHeight: 300, overflow: 'auto' },
      showCheckedStrategy: SHOW_PARENT,
      placeholder: '请选择',
      style: {
        width: '100%',
      },
      showSearch: true,
      allowClear: true,
      multiple: true,
      treeDefaultExpandAll: false,
    }

    return (
      <div className={`${styles.spreadPeopleCon}`}>
        <div className={`${styles.spreadPeopleConLine1} flex`}>
          <div className={`${styles.spreadPeopleConLineLeft} flex`}>
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_primary" size={14}>
                是否粉丝
              </Text>
            </div>
            <div className={styles.spreadPeopleConLineLeftInput}>
              <Select
                size="default"
                placeholder="请选择"
                style={{ width: '100%' }}
                disabled={
                  (promoteType === 8 && pushType === 1) ||
                  (promoteType === 5 && pushType === 0)
                }
                value={isFan}
                onChange={handleFanChange}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              >
                {renderfunOptions}
              </Select>
            </div>
          </div>
          <div className={`${styles.spreadPeopleConLineRight} flex`}>
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_primary" size={14}>
                职位技能
              </Text>
            </div>
            <div className={styles.spreadPeopleConLineLeftInput}>
              <Select
                // mode="tags"
                mode="multiple"
                size="default"
                value={R.propOr(undefined, 'positions', employerSpreadData)}
                placeholder="请选择"
                onChange={handlePositionSkillChange}
                style={{ width: '100%' }}
                onSearch={handlePositionOptionsChange}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              >
                {positionSkillsOptions}
              </Select>
            </div>
          </div>
        </div>
        <div className={`${styles.spreadPeopleConLine2} flex`}>
          <div className={`${styles.spreadPeopleConLineLeft} flex`}>
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_primary" size={14}>
                城市地区
              </Text>
            </div>
            <div className={styles.spreadPeopleConLineLeftInput}>
              <TreeSelect
                {...cityProps}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                showSearch={false}
              />
            </div>
          </div>
          <div className={`${styles.spreadPeopleConLineRight} flex`}>
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_primary" size={14}>
                学历要求
              </Text>
            </div>
            <div className={styles.spreadPeopleConLineLeftInput}>
              <Select
                // mode="tags"
                mode="multiple"
                value={R.propOr(undefined, 'degrees', employerSpreadData)}
                size="default"
                placeholder="请选择"
                onChange={handleDegreeChange}
                style={{ width: '100%' }}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              >
                {degreeOptions}
              </Select>
            </div>
          </div>
        </div>
        <div className={`${styles.spreadPeopleConLine} flex`}>
          <div className={`${styles.spreadPeopleConLineLeft} flex`}>
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_prsimary" size={14}>
                工作年限
              </Text>
            </div>
            <div className={styles.spreadPeopleConLineLeftInput}>
              <Select
                // mode="tags"
                mode="multiple"
                value={R.propOr(undefined, 'worktimes', employerSpreadData)}
                size="default"
                placeholder="请选择"
                onChange={handleworktimeChange}
                style={{ width: '100%' }}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              >
                {worktimeOptions}
              </Select>
            </div>
          </div>
          <div className={`${styles.spreadPeopleConLineRight} flex`}>
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_primary" size={14}>
                所属行业<span style={{ color: '#FF4D3C' }}>*</span>
              </Text>
            </div>
            <div className={styles.spreadPeopleConLineLeftInput}>
              <Select
                // mode="tags"
                mode="multiple"
                value={R.propOr(undefined, 'professions', employerSpreadData)}
                size="default"
                placeholder="请选择"
                onChange={handleProfessionChange}
                style={{ width: '100%' }}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              >
                {professionOptions}
              </Select>
            </div>
          </div>
        </div>
        {/* <div className={`${styles.spreadPeopleConLine1} flex`}>
          <div className={`${styles.spreadPeopleConLineLeft} flex`}>
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_primary" size={14}>
                期望公司
              </Text>
            </div>
            <div className={styles.spreadPeopleConLineLeftInput}>
              <Select
                mode="multiple"
                maxTagCount={50}
                size="default"
                filterOption={false}
                value={R.propOr(undefined, 'companys', employerSpreadData).map(
                  (v) => v.value
                )}
                placeholder="请搜索选择"
                onChange={(value, options) => handleCompanyChange(options)}
                style={{ width: '100%' }}
                onSearch={handleCompanyOptionsChange}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              >
                {getCompanyOptions}
              </Select>
            </div>
          </div>
        </div> */}
        <div className={`${styles.spreadPeopleConLine} flex`}>
          <div className={`${styles.spreadPeopleConLineLeft} flex`}>
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_prsimary" size={14}>
                圈定人群总量
              </Text>
            </div>
            <div className={styles.spreadPeopleConLineLeftInput}>
              约
              <div className={styles.spreadPeopleConLineLeftNumer}>
                {preCountLoading ? <Spin /> : exposure_maxOne}
              </div>
              人
            </div>
          </div>
        </div>
        <div className={`${styles.spreadPeopleConLine} flex`}>
          <div
            className={`${styles.spreadPeopleConLineLeft} flex`}
            style={{ width: 450, justifyContent: 'flex-start' }}
          >
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_prsimary" size={14}>
                期望曝光<span style={{ color: '#FF4D3C' }}>*</span>
              </Text>
            </div>
            <div
              className={styles.spreadPeopleConLineLeftInput}
              style={{ width: 120 }}
            >
              <InputNumber
                style={{ width: '88px', marginRight: '10px' }}
                min={1}
                max={consumeMax || 1}
                onChange={handlerConsumeNumChange}
                value={consumeNum}
                precision={0}
              />{' '}
              人
            </div>
            <div style={{ paddingTop: 5, marginLeft: 14 }}>
              (单次推广曝光不能超过3000人)
            </div>
          </div>
        </div>
        <div className={`${styles.spreadPeopleConLine3} flex`}>
          <div className={`${styles.spreadPeopleConLineLeft} flex`}>
            <div className={styles.spreadPeopleConLineLeftText}>
              <Text type="text_prsimary" size={14}>
                预计消耗
              </Text>
            </div>
            <div
              className={styles.spreadPeopleConLineLeftInput}
              style={{ lineHeight: '32px' }}
            >
              <span style={{ color: '#3B7AFF', margin: '0 4px' }}>
                {consumeNum * (isFan === 1 ? 1 : 2)}
              </span>
              曝光币, 当前剩余
              <span style={{ color: '#3B7AFF', margin: '0 4px' }}>
                {employerPromoteNbr}
              </span>
              曝光币
              <Tooltip
                placement="right"
                title={
                  <span>
                    消耗规则
                    <br />
                    曝光1个粉丝，消耗1曝光币
                    <br />
                    曝光1个非粉丝，消耗2曝光币
                  </span>
                }
              >
                <MUIIcon
                  type="question-circle"
                  style={{ fontSize: 16, color: '#ABADB8', marginLeft: 4 }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.employerSpreadProcessingPelple}>
      <ItemTitle str="定向人群" />
      {renderSpreadPeople()}
    </div>
  )
}
