import { Table, Popover } from 'antd'
import React, { useState, useEffect } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Message, PaginationHiddenLastPage } from 'mm-ent-ui'
import WaterMark from 'componentsV2/Common/WaterMark'
import CompanyFansHover from 'componentsV3/CompanyFansHover'
import * as R from 'ramda'
import { trackEvent } from 'utils'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CommonFormModal from './CommonFormModal'
import ImportFormModal from './ImportFormModal'
import ImportSubscribeModal from './ImportSubscribeModal'
import styles from './commonTable.less'

const tipsManager = (setImportTipsVisible, showImportTips) => {
  if (showImportTips) {
    const tipsTimer = setTimeout(() => {
      setImportTipsVisible(false)
      clearTimeout(tipsTimer)
    }, 5000)
  }
}

const renderBadgeNumbers = (number) => {
  if (number === 0) return null
  return <span className="badge">+{number}</span>
}

const CommonTable = withRouter(
  ({
    subscribeList,
    paginationParam,
    subscribeCurrentCount,
    subscribeMaxCount,
    statistics,
    editCondition,
    subscribeListLoading,
    newAddCount,
    currentUser,
    dispatch,
    urlPrefix,
    history,
  }) => {
    let waterMarkVisible = false
    const [subscriptionLimit, setSubscriptionLimit] = useState(false)
    const [refRight, setRefRight] = useState()
    const page = R.pathOr(0, ['page'], paginationParam)
    const size = R.pathOr(20, ['size'], paginationParam)
    const total = R.pathOr(0, ['total'], paginationParam)

    const fetchConditionList = () => {
      dispatch({
        type: 'homeSubscribe/fetchSubscribeList',
        payload: {
          page: 1,
        },
      }).then((data = {}) => {
        if (
          R.pathOr(0, ['data', 'subscribe_current_count'], data) >=
          R.pathOr(0, ['data', 'subscribe_max_count'], data)
        ) {
          setSubscriptionLimit(true)
        } else {
          setSubscriptionLimit(false)
        }
      })
    }

    const setWaterMark = () => {
      if (R.isEmpty(currentUser)) {
        return
      }
      const name = R.pathOr('', ['ucard', 'name'], currentUser)
      const phone = R.pathOr('', ['ucard', 'mobile_last_four'], currentUser)
      const text = name + phone
      if (!name && !phone) {
        return
      }
      WaterMark({
        text,
        container: document.querySelector('#container'),
      })

      WaterMark({
        text,
        container: document.querySelector('#right-container'),
      })

      waterMarkVisible = true
    }

    const showImportTips = newAddCount > 0
    const [commonFormModalVisible, setCommonFormModalVisible] = useState(false)
    const [importFormModalVisible, setImportFormModalVisible] = useState(false)
    const [importTipsVisible, setImportTipsVisible] = useState(showImportTips)

    useEffect(() => {
      fetchConditionList()
      setImportTipsVisible(showImportTips)
    }, [showImportTips])

    if (!waterMarkVisible) {
      setWaterMark()
    }

    tipsManager(setImportTipsVisible, showImportTips)

    const flattenKeys = (list) => {
      return list.map((item) => {
        const {
          delivery_cnt,
          has_dynamic_cnt,
          fans_cnt,
          view_rate,
          view_cnt,
          all_cnt,
        } = item.statistics_total
        const newItem = {
          ...item,
          delivery_cnt,
          has_dynamic_cnt,
          fans_cnt,
          view_statistics: {
            view_rate,
            view_cnt,
            all_cnt,
          },
        }
        return newItem
      })
    }

    const onSubmitSubscribe = (params) => {
      const type = params.id
        ? 'subscribe/modifyCondition'
        : 'subscribe/addCondition'
      dispatch({
        type,
        payload: {
          ...params,
        },
      }).then(() => {
        fetchConditionList()
        setCommonFormModalVisible(false)
        dispatch({ type: 'subscribe/setEditCondition', payload: {} })
        dispatch({
          type: 'homeSubscribe/setSubscribeList',
          payload: subscribeList.map((item) => {
            if (item.id === params.id) {
              Object.assign(item, params)
            }
            return item
          }),
        })
        Message.success({
          content: '????????????!',
        })
      })
    }

    const onDeleteSubscribe = (id) => {
      dispatch({
        type: 'subscribe/deleteCondition',
        payload: {
          id,
        },
      }).then(() => {
        fetchConditionList()
        setCommonFormModalVisible(false)
        dispatch({ type: 'subscribe/setEditCondition', payload: {} })
        Message.success({
          content: '????????????!',
        })
      })
    }

    const onImportSubscribe = (params) => {
      return params
        ? dispatch({
            type: 'subscribe/addCondition',
            payload: {
              ...params,
            },
          }).then(() => {
            fetchConditionList()
            setCommonFormModalVisible(false)
            dispatch({ type: 'subscribe/setEditCondition', payload: {} })
            Message.success({
              content: '????????????',
            })
          })
        : null
    }

    const refreshCurrentUser = () => {
      dispatch({
        type: 'global/fetchCurrentUser',
      })
    }

    const onImportSubscribeConditions = (params = []) => {
      return dispatch({
        type: 'subscribe/importSubscribes',
        payload: {
          ids: params.join(','),
        },
      }).then(() => {
        fetchConditionList()
        refreshCurrentUser()
        Message.success({
          content: '????????????',
        })
      })
    }

    const getStatistics = (data, key) => {
      return data && data[key]
    }

    const setNotifications = (item) => {
      const { is_notify, id } = item
      trackEvent('jobs_pc_talent_subscribe_table_click', {
        type: 'notice',
        method: is_notify ? 'close' : 'open',
      })
      dispatch({
        type: 'homeSubscribe/fetchNotifications',
        payload: {
          id,
          is_notify: is_notify ^ 1,
        },
      }).then(() => {
        Message.success({
          content: is_notify ? '???????????????' : '???????????????',
        })
      })
    }

    const setSwitch = (item) => {
      const { id } = item
      dispatch({
        type: 'homeSubscribe/fetchSwitch',
        payload: {
          id,
        },
      })
    }

    const customizeRenderEmpty = () => (
      <div className={styles.emptyContainer}>
        <img
          src={`${urlPrefix}/images/v3/subscribe/empty_icon.jpg`}
          width={198}
          height={152}
        />
        <p className={styles.emptyText}>????????????</p>
      </div>
    )

    const columns = [
      {
        title: '??????',
        dataIndex: 'is_notify',
        key: 'is_notify',
        width: 48,
        render: (v, data) => {
          const icon =
            v === 1 ? 'notify_enable_icon.png' : 'notify_disable_icon.png'
          return (
            <div className={styles.notifyContainer}>
              <img
                className={styles.notifyIcon}
                src={`${urlPrefix}/images/v3/subscribe/${icon}`}
                alt="??????"
                onClick={setNotifications.bind(this, data)}
              />
              <div className={styles.notifyTooltips}>
                {v === 1 ? (
                  <span>
                    <span style={{ color: '#FFA408' }}>??????????????????</span>
                    ????????????????????????????????????????????????????????????????????????
                  </span>
                ) : (
                  '???????????????????????????????????????????????????????????????????????????????????????'
                )}
              </div>
            </div>
          )
        },
      },
      {
        title: '????????????',
        dataIndex: 'title',
        key: 'title',
        render: (v, data, index) => {
          v =
            v.trim() ||
            [data.positions, data.query, data.companys]
              .filter((item) => !!item)
              .join('/')
          return (
            <div className={styles.subscribePos}>
              <div
                className={styles.subscribePosTitle}
                onClick={() => {
                  trackEvent('jobs_pc_talent_subscribe_table_click', {
                    type: 'subscribe_condition',
                  })
                  handleGoSubscribe(data, '')
                }}
              >
                {v}
              </div>
              <div className="subscribe-handle-container">
                {index !== 0 ? (
                  <div className={styles.setSwitchContainer}>
                    <img
                      className={styles.notify}
                      src={`${urlPrefix}/images/v3/subscribe/set_switch_icon.png`}
                      alt="??????"
                      onClick={setSwitch.bind(this, data)}
                    />
                    <div className={styles.setSwitchTooltips}>
                      <span>????????????</span>
                    </div>
                  </div>
                ) : null}
                <img
                  className={styles.notify}
                  style={{ marginLeft: 8 }}
                  src={`${urlPrefix}/images/v3/subscribe/edit_icon.png`}
                  alt="??????"
                  onClick={() => {
                    trackEvent('jobs_pc_talent_subscribe_table_click', {
                      type: 'edit',
                    })
                    setCommonFormModalVisible(true)
                    dispatch({
                      type: 'subscribe/setEditCondition',
                      payload: data,
                    })
                  }}
                />
              </div>
            </div>
          )
        },
      },
      {
        title: '?????????',
        dataIndex: 'view_statistics',
        key: 'view_statistics',
        width: 204,
        render: ({ view_cnt, view_rate, all_cnt }, data) => {
          return (
            <div
              className={styles.viewRateCell}
              onClick={() => {
                trackEvent('jobs_pc_talent_subscribe_table_click', {
                  type: 'browse',
                })
                handleGoSubscribe(data, 'view')
              }}
            >
              <div className={styles.viewRateContainer}>
                <div className={styles.viewLoaderBox}>
                  <div
                    className={styles.viewLoader}
                    style={{ width: view_rate }}
                  />
                </div>
                <div className={styles.viewNumber}>
                  {getStatistics(data.statistics_total, 'view_rate')}
                </div>
              </div>
              {/* <ul className={styles.loaderTooltips}>
                <li>
                  ????????????<span className={styles.orangeFont}>
                    {getStatistics(data.statistics_total, 'view_rate')}
                  </span>
                </li>
                <li>
                  ??? ??????<span className={styles.orangeFont}>
                    {getStatistics(data.statistics_total, 'all_cnt')}
                  </span>
                </li>
                <li>
                  ????????????<span className={styles.orangeFont}>
                    {getStatistics(data.statistics_total, 'view_cnt')}
                  </span>
                </li>
                <li>
                  ????????????<span className={styles.orangeFont}>
                    {getStatistics(data.statistics_total, 'touched_cnt')}
                  </span>
                </li>
                <li>
                  ????????????<span className={styles.orangeFont}>
                    {getStatistics(data.statistics_total, 'unsuitable_cnt')}
                  </span>
                </li>
              </ul> */}
            </div>
          )
        },
      },
      {
        title: (
          <div>
            ????????????{' '}
            <Popover
              getPopupContainer={() => refRight}
              autoAdjustOverflow={false}
              placement="bottom"
              content={<CompanyFansHover />}
              trigger="hover"
            >
              <QuestionCircleOutlined style={{ color: '#b1b6c1' }} />
            </Popover>
          </div>
        ),
        key: 'fans_cnt',
        width: 104,
        dataIndex: 'fans_cnt',
        render: (fans_cnt, data) => (
          <div
            className={styles.fans}
            onClick={() => {
              trackEvent('jobs_pc_talent_subscribe_table_click', {
                type: 'fans',
              })
              handleGoSubscribe(data, 'fans')
            }}
          >
            {dataConversion(fans_cnt)}
            <span className={styles.numbers}>
              {renderBadgeNumbers(
                dataConversion(data.statistics_new_add.fans_cnt)
              )}
            </span>
          </div>
        ),
      },
      {
        title: '?????????',
        key: 'delivery_cnt',
        width: 104,
        dataIndex: 'delivery_cnt',
        render: (delivery_cnt, data) => (
          <div
            className={styles.delivery}
            onClick={() => {
              trackEvent('jobs_pc_talent_subscribe_table_click', {
                type: 'delivery',
              })
              handleGoSubscribe(data, 'delivery')
            }}
          >
            {dataConversion(delivery_cnt)}
            <span className={styles.numbers}>
              {renderBadgeNumbers(
                dataConversion(data.statistics_new_add.delivery_cnt)
              )}
            </span>
          </div>
        ),
      },
      {
        title: '???????????????',
        dataIndex: 'has_dynamic_cnt',
        width: 104,
        key: 'has_dynamic_cnt',
        render: (has_dynamic_cnt, data) => (
          <div
            className={styles.dynamicCnt}
            onClick={() => {
              trackEvent('jobs_pc_talent_subscribe_table_click', {
                type: 'has_dynamic',
              })
              handleGoSubscribe(data, 'dynamic')
            }}
          >
            {dataConversion(has_dynamic_cnt)}
            <span className={styles.numbers}>
              {renderBadgeNumbers(
                dataConversion(data.statistics_new_add.has_dynamic_cnt)
              )}
            </span>
          </div>
        ),
      },
    ]
    const dataConversion = (data) => {
      data = parseInt(data) >= 0 ? parseInt(data) : 0
      data =
        data >= 10000
          ? Math.floor(data / 10000) +
            '.' +
            Math.floor((data % 10000) / 1000) +
            '???'
          : data
      return data
    }
    const list = flattenKeys(subscribeList).map((item) => {
      if (statistics.id) {
        item.statistics_total = Object.assign(
          {},
          item.statistics_total,
          statistics
        )
      }
      return item
    })

    const goSubscribe = (search, state = {}) => {
      // ????????????????????????
      dispatch({
        type: 'subscribe/setPaginationParam',
        payload: {
          page: 1,
          size: 20,
          total: 0,
        },
      })
      history.push({
        pathname: '/ent/v3/index/subscribe',
        search,
        state,
      })
    }

    const handleGoSubscribe = (data = {}, type) => {
      const subscribeId = R.pathOr('', ['id'], data)
      const filterMap = {
        view: 'is_exclude_search_seen',
        fans: 'is_fans',
        delivery: 'is_delivery',
        dynamic: 'is_has_dynamic',
      }
      const payload = {
        id: subscribeId,
      }
      const type_v = filterMap[type]
      const cnt = data.statistics_new_add[`${type_v}_cnt`.replace('is_', '')]
      let search = `?id=${subscribeId}&`

      if (type_v) {
        payload[type_v] = 1
      }

      let filter = ''
      if (type) {
        filter = filterMap[type]
      }

      if (filter) {
        search += `filter=${filter}&`
      }

      if (type_v && cnt) {
        dispatch({
          type: 'homeSubscribe/clearBadge',
          payload,
        })
          .then(({ data }) => {
            search += `currentTab=dynamic&`
            goSubscribe(search, { cnt, update_time: data[type_v] })
          })
          .catch((err) => goSubscribe(search))
      } else {
        goSubscribe(search)
      }
    }

    const limitMessage = () => {
      Message.error(
        `??????????????????????????????(${subscribeMaxCount}???)???????????????????????????????????????`
      )
    }

    const handlePageChange = (subPage, pageSize) => {
      refRight ? (refRight.scrollTop = 0) : null
      dispatch({
        type: 'homeSubscribe/setPaginationParam',
        payload: {
          ...paginationParam,
          page: subPage,
          size: pageSize,
        },
      })
      dispatch({
        type: 'homeSubscribe/fetchSubscribeList',
        payload: {
          page: subPage,
          pageSize,
        },
      })
    }

    return (
      <div
        className={styles.subscribeContainer}
        id="container"
        ref={(node) => setRefRight(node)}
      >
        <div className={styles.subscribeHeader}>
          <h6 className={styles.subscribeTitle}>????????????</h6>
          <div className={styles.subscribeHandler}>
            <div
              className={styles.subscribeBtn}
              onClick={() => {
                trackEvent('jobs_pc_talent_index_import_position_click')
                if (subscriptionLimit) {
                  limitMessage()
                } else {
                  setImportTipsVisible(false)
                  setImportFormModalVisible(true)
                }
              }}
            >
              ????????????
              <div
                style={{ display: importTipsVisible ? 'block' : 'none' }}
                className={styles.importTooltips}
              >
                ??????????????????????????????
              </div>
            </div>
            <div
              className={styles.subscribeBtn}
              onClick={() => {
                trackEvent('jobs_pc_talent_index_add_subscribe_click')
                subscriptionLimit
                  ? limitMessage()
                  : setCommonFormModalVisible(true)
              }}
            >
              ????????????
            </div>
          </div>
        </div>
        {subscribeList.length && subscribeCurrentCount > subscribeMaxCount ? (
          <ImportSubscribeModal
            subscribeMaxCount={subscribeMaxCount}
            onCancel={() => {}}
            onSubmit={onImportSubscribeConditions}
          />
        ) : null}
        {subscribeList.length ? (
          <Table
            loading={subscribeListLoading}
            rowKey={(record) => record.id}
            className={styles.commonTable}
            columns={columns}
            dataSource={list}
            pagination={false}
          />
        ) : (
          customizeRenderEmpty()
        )}
        {total > size && (
          <div className={styles.pagination}>
            <PaginationHiddenLastPage
              total={total}
              pageSize={size}
              current={page}
              onChange={handlePageChange}
            />
          </div>
        )}
        {importFormModalVisible ? (
          <ImportFormModal
            onCancel={() => setImportFormModalVisible(false)}
            onSubmit={onImportSubscribe}
          />
        ) : null}
        {commonFormModalVisible && (
          <CommonFormModal
            condition={editCondition}
            onCancel={() => {
              setCommonFormModalVisible(false)
              dispatch({ type: 'subscribe/setEditCondition', payload: {} })
            }}
            onSubmit={onSubmitSubscribe}
            onDelete={onDeleteSubscribe}
          />
        )}
      </div>
    )
  }
)

export default connect((state, dispatch) => ({
  editCondition: state.subscribe.editCondition,
  subscribeList: state.homeSubscribe.subscribeList,
  paginationParam: state.homeSubscribe.paginationParam,
  subscribeCurrentCount: state.homeSubscribe.subscribeCurrentCount,
  subscribeMaxCount: state.homeSubscribe.subscribeMaxCount,
  statistics: state.homeSubscribe.statistics,
  subscribeListLoading: state.homeSubscribe.subscribeListLoading,
  newAddCount: state.global.newAddCount,
  currentUser: state.global.currentUser,
  dispatch,
  urlPrefix: state.global.urlPrefix,
}))(CommonTable)
