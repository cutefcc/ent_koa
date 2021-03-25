import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import styles from './SubGroups.less'
import { Tag } from 'antd'
import { Button, Icon, Modal } from 'mm-ent-ui'
import EditCustomGroup from 'componentsV2/TalentDiscover/GroupsContainer/EditCustomGroup'
import EditCompanyFocused from 'components/TalentPool_v3/Enterprise/Navigator/EditCompanyFocused_v3'
// import { debounce } from 'utils/index'
const { CheckableTag } = Tag
function SubGroups({
  groupNav,
  currentGroup,
  currentUser,
  dispatch,
  subGroup,
  paginationParam,
  loading,
}) {
  const [showEditGroup, setShowEditGroup] = useState(false)
  const [showEditCompanyGroup, setShowEditCompanyGroup] = useState(false)
  const [tagsHeight, setTagsHeight] = useState()
  const [arrow, setArrow] = useState(false)
  const [unfold, setUnfold] = useState(false)
  const groupData = groupNav.filter((n) => n.key === currentGroup.key)
  const title = groupData[0] && groupData[0].title
  const all = { title: '全部', total: '' }
  const [currentTag, setCurrentTag] = useState(all)
  const originOption =
    title === '关注公司'
      ? R.filter(
          (item) => item.action_code !== 1,
          (groupData[0] && groupData[0].options) || []
        )
      : (groupData[0] && groupData[0].options) || []
  const options = originOption ? [all, ...originOption] : []
  const typeName = currentGroup.key === 'user_group' ? 'personal' : 'ent'
  const handleChange = (item, checked) => {
    fetchSetGroup(item)
    dispatch({
      type: 'groups/setPaginationParam',
      payload: {
        ...paginationParam,
        page: 1,
        size: 20,
      },
    })
    // 清除tags
    dispatch({
      type: 'groups/setMappingTags',
      payload: [],
    })
    dispatch({
      type: 'groups/fetchData',
      payload: {},
    })
    if (checked) setCurrentTag(item)
  }
  // const hanleChangeDebounce = debounce(handleChange, 2000)
  const handleUnfold = () => {
    setArrow(!arrow)
    setUnfold(!unfold)
  }
  const fetchGroupNav = () => {
    dispatch({ type: 'groups/fetchNav' })
  }
  const fetchSetGroup = (item) => {
    dispatch({
      type: 'groups/setSubGroup',
      payload: item,
    })

    console.log('item', item)
  }
  useEffect(() => {
    setUnfold(false)
    setTagsHeight()
    setArrow(false)
    // fetchGroupNav()
  }, [currentGroup.key])
  useEffect(() => {
    let box = document.getElementById('tags')
    let computedStyle = getComputedStyle(box, null)
    box = box.offsetHeight + parseInt(computedStyle.marginTop)
    box && setTagsHeight(box > 86 ? 86.1 : box)
  })

  const isAdmin = () => R.pathOr(0, ['ucard', 'is_adm'], currentUser) === 1

  const handleShowEditCompanyGroup = () => {
    // const remain = R.pathOr(
    //   0,
    //   ['talent_lib', 'attention_company_left'],
    //   currentUser
    // )

    if (R.pathOr(0, ['talent_lib_version'], currentUser) === 2) {
      dispatch({
        type: 'global/setMemberUpgradeTip',
        payload: {
          show: true,
        },
      })
      return
    }

    if (!isAdmin()) {
      Modal.confirm({
        title: '暂无权限',
        content: '您没有此操作的权限，请联系企业管理员进行此操作。',
        type: 'common',
      })
      return
    }

    // if (!(remain > 0)) {
    //   Modal.confirm({
    //     title: '添加关注公司',
    //     content:
    //       '您的关注企业名额已经达上限，请联系销售专员开通高级服务获得更多名额',
    //     type: 'common',
    //   })
    //   return
    // }

    setShowEditCompanyGroup(true)
  }

  const handleHideEditCompanyGroup = () => {
    setShowEditCompanyGroup(false)
  }
  const deleteTagsState = () => {
    dispatch({ type: 'groups/fetchNav' }).then((res) => {
      for (let index in res) {
        if (res[index].title === title) {
          const data = [all, ...res[index].options]
          // 检查当前选中的标签已更新
          for (let j in data) {
            if (JSON.stringify(data[j]) === JSON.stringify(currentTag)) {
              return
            }
          }
          // 当前选中的标签处于编辑状态
          for (let j in data) {
            if (
              JSON.stringify(data[j].post_param) ===
              JSON.stringify(currentTag.post_param)
            ) {
              fetchSetGroup(data[j])
              setCurrentTag(data[j])
              return
            }
          }
          // 当前选中的标签已被删除
          fetchSetGroup(all)
          setCurrentTag(all)
          dispatch({
            type: 'groups/fetchData',
            payload: {},
          })
        }
      }
    })
  }
  const handleConfirm = () => {
    fetchGroupNav()
  }

  return (
    <div
      className={styles.subGroups}
      style={
        title === '个人储备' || title === '企业储备'
          ? { overflow: 'hidden', height: unfold ? 'auto' : tagsHeight }
          : { overflow: 'hidden', height: 'auto' }
      }
    >
      <div
        className={styles.tags}
        id="tags"
        style={{
          marginTop:
            options[1] ||
            title === '关注公司' ||
            title === '个人储备' ||
            title === '企业储备'
              ? '16px'
              : '0px',
        }}
      >
        {(options[1] ||
          title === '关注公司' ||
          title === '个人储备' ||
          title === '企业储备') &&
          options.map((item, index) => {
            return (
              <Tag key={item.title + index}>
                <CheckableTag
                  key={item}
                  checked={JSON.stringify(subGroup) === JSON.stringify(item)}
                  onChange={(checked) => {
                    !loading && handleChange(item, checked)
                  }}
                >
                  <span
                    style={
                      loading
                        ? { cursor: 'not-allowed', fontSize: '12px' }
                        : { cursor: 'pointer', fontSize: '12px' }
                    }
                  >
                    {item.title}
                    {item.title === '全部' ? '' : '·'}
                    {item.title === '全部' ? '' : item.total || 0}
                  </span>
                </CheckableTag>
              </Tag>
            )
          })}
      </div>
      {title === '个人储备' || title === '企业储备' ? (
        <div className={styles.btnDiv} style={{ marginTop: '21px' }}>
          <Button
            className={styles.btn}
            type="button_m_exact_link_gray"
            onClick={() => {
              setShowEditGroup(true)
            }}
          >
            管理分组
          </Button>
          {tagsHeight && tagsHeight > 86 ? (
            <Icon
              className={arrow ? styles.arrow : ''}
              type="icon_arrow_down"
              onClick={handleUnfold}
            />
          ) : null}
        </div>
      ) : null}
      {title === '关注公司' ? (
        <div className={styles.btnDiv} style={{ marginTop: '21px' }}>
          <Button
            className={styles.btn}
            type="button_m_exact_link_gray"
            onClick={handleShowEditCompanyGroup}
          >
            添加关注
          </Button>
        </div>
      ) : null}
      {showEditGroup && (
        <EditCustomGroup
          type={typeName}
          onCancel={() => {
            setShowEditGroup(false), deleteTagsState()
          }}
          canDelete={isAdmin()}
        />
      )}
      {showEditCompanyGroup && (
        <EditCompanyFocused
          onCancel={handleHideEditCompanyGroup}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

export default connect((state, dispatch) => ({
  groupNav: state.groups.groupNav,
  currentGroup: state.groups.currentGroup,
  currentUser: state.global.currentUser,
  subGroup: state.groups.subGroup,
  config: state.global.config,
  paginationParam: state.groups.paginationParam,
  loading: state.loading.effects['groups/fetchData'],
  dispatch,
}))(SubGroups)
