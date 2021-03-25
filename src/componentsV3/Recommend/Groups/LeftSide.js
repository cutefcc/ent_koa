import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import urlParse from 'url'
// import {getModuleName} from 'utils'
import { INIT_SEARCH_GROUP } from 'constants/groups'
import * as R from 'ramda'
import { Loading } from 'mm-ent-ui'
import styles from './index.less'

function LeftSide({
  groupNav,
  currentGroup,
  dispatch,
  paginationParam,
  scrollCon,
  listLoading,
  currentUser,
}) {
  const handleFetchData = () => {
    dispatch({
      type: 'groups/fetchData',
      payload: {},
    })
  }
  const getUrlObj = () => {
    return urlParse.parse(window.location.search, true)
  }
  const renderLoading = () => {
    return (
      <p className="text-center margin-top-32">
        <Loading />
        <span className="color-gray400 margin-left-8">加载中...</span>
      </p>
    )
  }
  const fetchGroupNavOnly = () => {
    dispatch({ type: 'groups/fetchNav' })
  }
  const fetchGroupNav = (refresh = false, addGroup) => {
    const urlObj = getUrlObj()
    const type = R.pathOr('', ['query', 'type'], urlObj)
    const currentTab = R.pathOr('', ['query', 'currentTab'], urlObj)
    dispatch({ type: 'groups/fetchNav' }).then((data) => {
      if (data) {
        if (refresh) {
          if (type) {
            dispatch({
              type: 'groups/setState',
              payload: { currentGroup: data.find((item) => item.key === type) },
            })
          } else {
            dispatch({
              type: 'groups/setState',
              payload: { currentGroup: data[0] },
            })
          }
          dispatch({
            type: 'groups/setSubGroup',
            payload: { title: '全部', total: '' },
          })
          // comment this for avoid dipatching duplicated(currentTab in query and onTabChange) actions
          // dispatch({
          //   type: 'groups/setCurrentTab',
          //   payload: currentTab || 'dynamic',
          // })
        }
        if (addGroup === 'addGroup') return
        // 清空总数
        dispatch({
          type: 'groups/setPaginationParam',
          payload: {
            ...paginationParam,
            total: 0,
          },
        })
        handleFetchData()
      }
    })
  }

  useEffect(() => {
    fetchGroupNav(true)
    window.broadcast.bind('addGroupSuccess', () => {
      fetchGroupNav(false, 'addGroup')
    })
  }, [])
  const onClickGroup = (key, loading) => {
    if (loading) {
      return
    }
    // 清除tags
    dispatch({
      type: 'groups/setMappingTags',
      payload: [],
    })
    dispatch({
      type: 'groups/setState',
      payload: { currentGroup: groupNav.find((item) => item.key === key) },
    })
    dispatch({
      type: 'groups/setSearchParam',
      payload: { ...INIT_SEARCH_GROUP },
    })
    dispatch({
      type: 'groups/setSubGroup',
      payload: { title: '全部', total: '' },
    })
    dispatch({
      type: 'groups/setCheckboxGroup',
      payload: [],
    })
    dispatch({
      type: 'groups/setAdvanceParams',
      payload: {},
    })
    dispatch({
      type: 'groups/setPaginationParam',
      payload: {
        page: 1,
        size: 20,
        total: 0,
        total_match: 0,
      },
    })
    dispatch({
      type: 'groups/setIsShowDataAnalysis',
      payload: false,
    })
    // 特别关注，员工好友没有子分组

    // 不合适
    if (currentGroup.key === 'inappropriate') {
      dispatch({
        type: 'groups/setCurrentTab',
        payload: 'talent',
      })
    }
    // 右侧滚动区域从顶部开始显示
    if (scrollCon) {
      scrollCon.scrollTop = 0
    }

    handleFetchData()

    fetchGroupNavOnly()
  }

  return (
    <div className={styles.leftSidebar}>
      {groupNav.length ? null : renderLoading()}
      <div className={styles.list}>
        {groupNav &&
          groupNav.slice(0, -4).map((item) => {
            return (
              <div
                className={`${styles.subItem} ${
                  currentGroup.key === item.key ? styles.selectedItem : null
                } ${listLoading ? styles.listLoading : null}`}
                key={item.key}
                onClick={() => {
                  onClickGroup(item.key, listLoading)
                }}
              >
                <span>
                  {item.title}·{item.total || 0}
                </span>
              </div>
            )
          })}
        {groupNav.length ? <div className={styles.border1px} /> : null}
        {groupNav &&
          groupNav.slice(-4).map((item) => {
            return (
              <div
                className={`${styles.subItem} ${
                  currentGroup.key === item.key ? styles.selectedItem : null
                } ${listLoading ? styles.listLoading : null}`}
                key={item.key}
                onClick={() => {
                  onClickGroup(item.key, listLoading)
                }}
              >
                <span>
                  {item.title}·{item.total || 0}
                </span>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  groupNav: state.groups.groupNav,
  currentGroup: state.groups.currentGroup,
  config: state.global.config,
  paginationParam: state.groups.paginationParam,
  listLoading: state.loading.effects['groups/fetchData'],
  dispatch,
}))(LeftSide)
