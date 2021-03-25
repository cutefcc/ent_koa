import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Loading, LoadMore } from 'mm-ent-ui'
import * as R from 'ramda'
import urlParse from 'url'
import { withRouter } from 'react-router-dom'
import { FILTERITEMS } from 'constants/talentDiscover'
import { Tooltip } from 'antd'
import { trackEvent } from 'utils'
import CommonFormModal from './CommonFormModal'
import ImportFormModal from './ImportFormModal'
import styles from './index.less'

const Subscribe = withRouter(
  ({
    conditionList = ['default'],
    editCondition,
    config,
    dispatch,
    paginationParam,
    currCondition,
    talentList,
    scrollCon,
    history,
    listLoading,
    moreLoading,
    subscribeCurrentCount,
    subscribeMaxCount,
    conditionPaginationParam,
  }) => {
    const [currSelectId, setCurrSelectId] = useState(0)
    // 展开更多
    const [commonFormModalVisible, setCommonFormModalVisible] = useState(false)
    const [importFormModalVisible, setImportFormModalVisible] = useState(false)
    // 订阅是否达到上限
    const [subscriptionLimit, setSubscriptionLimit] = useState(false)
    // 是否加载中
    const [loadingState, setLoadingState] = useState(true)
    const handleFetchData = () => {
      const urlObj = getUrlObj()
      const id = R.pathOr('', ['query', 'id'], urlObj)

      const { state } = history.location
      const payload = {
        subscribe_id: id,
      }

      if (state && state.update_time) {
        // payload.update_time = encodeURIComponent(state.update_time);
        payload.update_time = state.update_time
      }

      // 清空总数
      dispatch({
        type: 'subscribe/setPaginationParam',
        payload: {
          ...paginationParam,
          total: 0,
        },
      })
      dispatch({
        type: 'subscribe/fetchData',
        payload,
      })
    }
    // // 是否超过订阅数目上限
    // const maxCount = () => {
    //   dispatch({
    //     type: 'homeSubscribe/fetchSubscribeList',
    //     payload: {
    //       page: 1,
    //     },
    //   }).then(data => {
    //     if (
    //       data.data.subscribe_current_count >= data.data.subscribe_max_count
    //     ) {
    //       setSubscriptionLimit(true)
    //     } else {
    //       setSubscriptionLimit(false)
    //     }
    //   })
    // }
    const getUrlObj = () => {
      return urlParse.parse(window.location.search, true)
    }

    const fetchConditionList = (refresh = false, type = 'add', deleteId) => {
      const urlObj = getUrlObj()
      const id = R.pathOr('', ['query', 'id'], urlObj)
      const filter = R.pathOr('', ['query', 'filter'], urlObj)

      dispatch({
        type: 'subscribe/fetchConditionList',
        payload: {
          page: 0,
          size: 20,
        },
        // eslint-disable-next-line
      }).then((data) => {
        if (data.code === 0) {
          // 是否超过订阅数目上限
          if (
            data.data.subscribe_current_count >= data.data.subscribe_max_count
          ) {
            setSubscriptionLimit(true)
          } else {
            setSubscriptionLimit(false)
          }

          const conditionLists = R.pathOr([], ['data', 'list'], data)
          let currItem = conditionLists.find((item) => item.id === Number(id))
          if (refresh) {
            // 结束loading
            setLoadingState(false)
            // 清除右侧groups选中状态
            dispatch({
              type: 'subscribe/setCheckboxGroup',
              payload: [],
            })
            if (id) {
              if (currItem) {
                setCurrSelectId(Number(id))
                dispatch({
                  type: 'subscribe/setCurrCondition',
                  payload: currItem,
                })
              } else if (conditionLists.length > 0) {
                currItem = conditionLists[0]
                setCurrSelectId(Number(currItem.id))
                dispatch({
                  type: 'subscribe/setCurrCondition',
                  payload: currItem,
                })
              }

              let payload = currItem
              if (filter) {
                const obj = {}
                FILTERITEMS.forEach((item) => {
                  obj[item.key] = 0
                })
                obj[filter] = 1
                payload = { ...currItem, ...obj }
                dispatch({
                  type: 'subscribe/setCheckboxGroup',
                  payload: [filter],
                })
              }
              dispatch({
                type: 'subscribe/setCurrCondition',
                payload,
              })
            } else {
              const currItem = R.pathOr({}, ['data', 'list', 0], data)
              if (currItem) setCurrSelectId(Number(currItem.id || 0)) // 设置默认选项
              let payload = currItem
              if (filter) {
                const obj = {}
                FILTERITEMS.forEach((item) => {
                  obj[item.key] = 0
                })
                obj[filter] = 1
                payload = { ...currItem, ...obj }
                dispatch({
                  type: 'subscribe/setCheckboxGroup',
                  payload: [filter],
                })
              }
              dispatch({
                type: 'subscribe/setCurrCondition',
                payload,
              })
            }
          } else {
            if (type === 'delete') {
              // 删除的是当前选中项
              if (deleteId === currSelectId) {
                if (conditionLists.length > 0) {
                  setCurrSelectId(conditionLists[0].id)
                  dispatch({
                    type: 'subscribe/setCurrCondition',
                    payload: conditionLists[0],
                  })
                }
              } else {
                // 删除的不是当前选中项
                dispatch({
                  type: 'subscribe/setCurrCondition',
                  payload: currCondition,
                })
              }
            }
            if (type === 'add') {
              setCurrSelectId(conditionLists[0].id)
              dispatch({
                type: 'subscribe/setCurrCondition',
                payload: conditionLists[0],
              })
            }
            if (type === 'import') {
              setCurrSelectId(conditionLists[0].id)
              dispatch({
                type: 'subscribe/setCurrCondition',
                payload: conditionLists[0],
              })
            }

            dispatch({
              type: 'subscribe/setCheckboxGroup',
              payload: [],
            })
          }

          dispatch({
            type: 'subscribe/setTalentList',
            payload: [],
          })

          handleFetchData() // load data from server every time
        }
      })
    }

    useEffect(() => {
      fetchConditionList(true)
      if (conditionList.length > 0) {
        setLoadingState(false)
      }
    }, [])
    // useEffect(
    //   () => {
    //     maxCount()
    //   },
    //   [conditionList]
    // )
    const onSubmitSubscribe = (params) => {
      const type = params.id
        ? 'subscribe/modifyCondition'
        : 'subscribe/addCondition'
      if (params.id) {
        setCurrSelectId(Number(params.id))
      }
      dispatch({
        type,
        payload: {
          ...params,
        },
      }).then(() => {
        fetchConditionList(false, 'add')
        setCommonFormModalVisible(false)
        dispatch({ type: 'subscribe/setEditCondition', payload: {} })
        Message.success({
          content: '提交成功!',
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
            setCurrSelectId(params.id)
            fetchConditionList(false, 'import')
            setCommonFormModalVisible(false)
            dispatch({ type: 'subscribe/setEditCondition', payload: {} })
            dispatch({ type: 'subscribe/setMappingTags', payload: [] })
            Message.success({
              content: '导入成功',
            })
          })
        : null
    }
    const onDeleteSubscribe = (id) => {
      // console.log('id', id)
      // console.log('currSelectId', currSelectId)
      // return
      dispatch({
        type: 'subscribe/deleteCondition',
        payload: {
          id,
        },
      }).then(() => {
        fetchConditionList(false, 'delete', id)
        setCommonFormModalVisible(false)
        dispatch({ type: 'subscribe/setEditCondition', payload: {} })
        Message.success({
          content: '删除成功!',
        })
      })
    }
    const handleCombMainTitle = (item) => {
      const title = R.propOr('', 'title', item)
      const positions = R.propOr('', 'positions', item)
      const query = R.propOr('', 'query', item)
      const companys = R.propOr('', 'companys', item)
      if (title) {
        return title
      }
      let strArr = []
      strArr.push(
        positions, // 职位技能
        query,
        companys // 公司
      )
      strArr = strArr.filter((str) => str !== '')
      return strArr.join('·')
    }
    const limitMessage = () => {
      Message.error(
        `人才订阅数量已达上限(${subscribeMaxCount}个)，如需扩容请联系管理员升级`
      )
    }
    const setSwitch = (item) => {
      const { id } = item
      dispatch({
        type: 'subscribe/fetchSwitch',
        payload: {
          id,
        },
      })
    }
    const renderLoading = () => {
      return (
        <p
          style={{ marginTop: '15%', paddingBottom: '32%' }}
          className="text-center margin-top-32"
        >
          <Loading />
          <span className="color-gray400 margin-left-8">加载中...</span>
        </p>
      )
    }
    const handleItemClick = (item, loading) => {
      if (loading) return
      setCurrSelectId(item.id)
      // 清除tags
      dispatch({
        type: 'subscribe/setMappingTags',
        payload: [],
      })
      dispatch({
        type: 'subscribe/setPaginationParam',
        payload: {
          ...paginationParam,
          page: 1,
        },
      })
      dispatch({
        type: 'subscribe/setCheckboxGroup',
        payload: [],
      })
      dispatch({
        type: 'subscribe/setCurrCondition',
        payload: item,
      })
      dispatch({
        type: 'subscribe/setIsShowDataAnalysis',
        payload: false,
      })
      // 右侧滚动区域从顶部开始显示
      if (scrollCon) {
        scrollCon.scrollTop = 0
      }
      handleFetchData()
    }
    const handleLoadMore = () => {
      if (moreLoading) {
        return
      }
      dispatch({ type: 'subscribe/fetchConditionListMore' })
    }

    return (
      <div className={styles.leftSidebar}>
        <div className={`${styles.title} flex`}>
          <span className={styles.text}>人才订阅</span>
          <div className={styles.action}>
            <Button
              type="button_m_exact_link_gray"
              onClick={() => {
                trackEvent('jobs_pc_talent_left_side_import_click')
                if (subscribeCurrentCount >= subscribeMaxCount) {
                  limitMessage()
                } else {
                  setImportFormModalVisible(true)
                }
              }}
            >
              导入
            </Button>
            <Button
              type="button_m_exact_link_gray"
              onClick={() => {
                trackEvent('jobs_pc_talent_left_side_add_click')
                subscriptionLimit
                  ? limitMessage()
                  : setCommonFormModalVisible(true)
              }}
            >
              +订阅
            </Button>
          </div>
        </div>
        <div className={styles.list}>
          {loadingState && renderLoading()}
          {conditionList.map((item, index) => {
            const mainTitle = handleCombMainTitle(item)
            return (
              <div
                className={`${styles.subItem} ${
                  currSelectId === item.id ? styles.selectedItem : null
                } ${listLoading ? styles.listLoading : null}`}
                key={item.id}
              >
                <span
                  onClick={() => {
                    handleItemClick(item, listLoading)
                  }}
                >
                  {mainTitle}
                </span>
                {index !== 0 && (
                  <div
                    onClick={() => {
                      setSwitch(item)
                    }}
                  >
                    <Tooltip title="移到顶部">
                      <img
                        className={styles.notify}
                        alt="empty"
                        src="https://i9.taou.com/maimai/p/24386/7598_53_1BsXrVfcwLJdEV"
                      />
                    </Tooltip>
                  </div>
                )}
                <span
                  onClick={() => {
                    setCommonFormModalVisible(true)
                    dispatch({
                      type: 'subscribe/setEditCondition',
                      payload: item,
                    })
                  }}
                >
                  <img
                    alt="empty"
                    src="https://i9.taou.com/maimai/p/24386/7768_53_1Gc2hUKlJRsHdl"
                  />
                </span>
              </div>
            )
          })}
          {!conditionList.length && !loadingState ? (
            <p className={styles.emptyTip}>请添加订阅或导入职位</p>
          ) : null}
          {R.pathOr(0, ['total'], conditionPaginationParam) >
            conditionList.length && (
            <LoadMore loading={moreLoading} onloadMore={handleLoadMore} />
          )}
        </div>
        {commonFormModalVisible ? (
          <CommonFormModal
            condition={editCondition}
            onCancel={() => {
              setCommonFormModalVisible(false)
              dispatch({ type: 'subscribe/setEditCondition', payload: {} })
            }}
            onSubmit={onSubmitSubscribe}
            onDelete={onDeleteSubscribe}
          />
        ) : null}

        {importFormModalVisible ? (
          <ImportFormModal
            onCancel={() => setImportFormModalVisible(false)}
            onSubmit={onImportSubscribe}
          />
        ) : null}
      </div>
    )
  }
)

export default connect((state, dispatch) => ({
  conditionList: state.subscribe.conditionList,
  editCondition: state.subscribe.editCondition,
  subscribeCurrentCount: state.homeSubscribe.subscribeCurrentCount,
  subscribeMaxCount: state.homeSubscribe.subscribeMaxCount,
  conditionPaginationParam: state.subscribe.conditionPaginationParam,
  paginationParam: state.subscribe.paginationParam,
  config: state.global.config,
  currCondition: state.subscribe.currCondition,
  talentList: state.subscribe.talentList,
  listLoading: state.loading.effects['subscribe/fetchData'],
  moreLoading: state.loading.effects['subscribe/fetchConditionListMore'],
  dispatch,
}))(Subscribe)
