import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { trackEvent } from 'utils'
import { Button } from 'mm-ent-ui'
import { Row, Col, Input } from 'antd'
import * as styles from './index.less'

function IndexSearch() {
  const [inputVal, setInputVal] = useState('')

  const handleBtnClick = () => {
    trackEvent('jobs_pc_talent_index_search_btn_click', { query: inputVal })
    window.open(
      `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? `:${window.location.port}` : ''
      }/ent/v3/discover?query=${inputVal}`
    )
  }

  const inputKeyUp = (event) => {
    if (event.keyCode === 13) {
      handleBtnClick()
    }
  }

  const handleValueChanged = (e) => {
    setInputVal(R.pathOr('', ['target', 'value'], e))
  }

  return (
    <div className={`${styles.indexSearch}`}>
      <Row className={styles.row}>
        <Col span={4} />
        <Col span={16} className={`${styles.indexSearchMiddle} flex`}>
          <Input
            placeholder="按职位、技能、公司等条件搜索人才"
            onKeyUp={inputKeyUp}
            className={`${styles.input}`}
            onChange={handleValueChanged}
            onClick={() => {
              trackEvent('jobs_pc_talent_index_search_input_click')
            }}
          />
          <Button
            type="button_m_fixed_blue450"
            onClick={handleBtnClick}
            className={styles.searchBtn}
          >
            高级搜索
          </Button>
        </Col>
        <Col span={4} />
      </Row>
    </div>
  )
}

export default withRouter(
  connect((state, dispatch) => ({
    dispatch,
  }))(IndexSearch)
)
