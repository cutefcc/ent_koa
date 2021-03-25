import React, { useState } from 'react'
import * as R from 'ramda'
import { Checkbox, Icon } from 'mm-ent-ui'
import { Modal, Button, Popover } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { FILTERITEMS } from 'constants/talentDiscover'
import * as styles from './index.less'
import CompanyFansHover from 'componentsV3/CompanyFansHover'

function FilterContainer(props) {
  const [visible, setVisible] = useState(false)
  const [prompt, setPrompt] = useState(true)
  const {
    isShowDataAnalysis,
    mappingTags: { length: mappingTagsLen },
    onAnalysisDataClick,
    onFilterChange,
    hasAdvancesSearch = false,
    dispatch,
    checkboxGroup = [],
    title = '高级检索',
    advanceParamsNum = 0,
    analysis = {},
    listLoading,
  } = props
  const getFilterOptions = () => {
    return FILTERITEMS.map((item) => ({
      label: (
        <span>
          {item.name}{' '}
          {item.name === '企业粉丝' && (
            <Popover
              autoAdjustOverflow={false}
              placement="bottom"
              content={<CompanyFansHover />}
              trigger={['hover', 'click']}
            >
              <QuestionCircleOutlined style={{ color: '#b1b6c1' }} />
            </Popover>
          )}
        </span>
      ),
      value: item.key,
    }))
  }
  const handleOk = () => {
    setVisible(false)
    if (prompt) {
      localStorage.setItem('no_prompt_for_advance_search', '1')
    }
    dispatch({
      type: 'groups/setAdvanceSearchModal',
      payload: true,
    })
  }
  const handleCancel = () => {
    setVisible(false)
  }
  const onCheckBoxChange = (e) => {
    setPrompt(e.target.checked)
  }

  const isAnalysDataEmpty = () =>
    Object.keys(analysis).every((item) => R.isEmpty(analysis[item]))

  return (
    <div>
      <div className={`${styles.filterContainer} flex`}>
        <div>
          <Checkbox.Group
            disabled={listLoading}
            options={getFilterOptions()}
            onChange={onFilterChange}
            value={checkboxGroup}
          />
        </div>
        <div>
          {hasAdvancesSearch && (
            <span
              className={styles.advanceSearch}
              style={{
                color: advanceParamsNum > 0 ? '#0052FF' : 'rgba(0, 0, 0, 0.45)',
              }}
              onClick={() => {
                const sign = localStorage.getItem(
                  'no_prompt_for_advance_search'
                )
                if (sign !== '1' && mappingTagsLen > 0) {
                  setVisible(true)
                  return
                }

                dispatch({
                  type: 'groups/setAdvanceSearchModal',
                  payload: true,
                })
              }}
            >
              <Icon
                type="icon_search_nor"
                className={styles.advanceSearchIcon}
              />
              <span className="margin-left-4">
                {advanceParamsNum > 0 ? `${title}(${advanceParamsNum})` : title}
              </span>
            </span>
          )}
          <span
            className={`${styles.dataAnaly} ${
              mappingTagsLen !== 0 ? styles.blue : styles.noBlue
            }`}
            onClick={onAnalysisDataClick}
            style={
              isAnalysDataEmpty()
                ? { cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }
                : null
            }
          >
            <Icon
              type="arrow_up"
              className={
                isShowDataAnalysis && !isAnalysDataEmpty()
                  ? styles.dataAnalyUpIcon
                  : styles.dataAnalyDownIcon
              }
            />
            <span className="margin-left-4">
              {isShowDataAnalysis && !isAnalysDataEmpty() ? '收起' : '展开'}
              数据分析
              {!isShowDataAnalysis && mappingTagsLen !== 0
                ? `(${mappingTagsLen})`
                : ''}
            </span>
          </span>
        </div>
      </div>
      {!isShowDataAnalysis ? (
        <div style={{ height: '16px', backgroundColor: '#F2F4F8' }} />
      ) : (
        <div className={styles.line} />
      )}
      <Modal
        visible={visible}
        onCancel={handleCancel}
        centered={true}
        footer={null}
        width={360}
        className={styles.dataChange}
      >
        <div className={styles.content}>
          {' '}
          <span>更改检索条件将清空数据面板中的筛选项</span>
        </div>
        <Checkbox
          style={{ marginLeft: '8px' }}
          checked={prompt}
          onChange={onCheckBoxChange}
        >
          下次不再提示
        </Checkbox>
        <div className={styles.cancel}>
          <Button
            key="cancel"
            onClick={handleOk}
            type="primary"
            className={styles.buttonCancel}
          >
            我知道了
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default withRouter(
  connect((state, dispatch) => ({
    dispatch,
  }))(FilterContainer)
)
