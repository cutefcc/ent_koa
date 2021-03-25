import React, { useState, useEffect, useReducer, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Icon, MUIAvatar, MUIButton, Loading, MUIModal } from 'mm-ent-ui'
import { Input } from 'antd'
import { GUID, formatArea, trackEvent } from 'utils'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import request from 'utils/request'
import * as styles from './index.less'

const mediumHighPortraitFields = [
  'high_degree_percent',
  'work_in_top_company_percent',
  'work_exp_gt_5_years_percent',
  'senior_manager_percent',
]

const bottomTags = [
  {
    title: '高效锁定',
    subTitle:
      '建设企业号，用优质雇主品牌形象，把更多中高端人才转化为你的企业粉丝。',
  },
  {
    title: '精准触达',
    subTitle:
      '通过IM消息直接触达，给你的意向人才发送互动话题。批量邀请，坐等回复。',
  },
  {
    title: '定向影响',
    subTitle: '企业粉丝邀约成功率比普通用户高34%。提前布局，助力招聘效果。',
  },
]
const tags = [
  '产品经理',
  '后端开发',
  '前端开发',
  '设计师',
  '销售',
  '运营',
  '人力资源',
  '算法',
  '数据分析',
]

function AnalysisReport(props) {
  const { bgcolor, title, color } = props
  return (
    <div
      className={styles.analysisReport}
      style={{
        background: bgcolor,
        color,
        width: '60px',
        height: '116px',
        padding: '28px 9px',
      }}
    >
      {title}
    </div>
  )
}

// eslint-disable-next-line max-statements
function SnatchTalent(props) {
  const avatarIndexChangeReducer = (state, action = {}) => {
    switch (action.type) {
      case 'clickChange':
        return action.payload
      default:
        return state === 7 ? 0 : state + 1
    }
  }
  const { currentUser, urlPrefix, history, companyFans, dispatch } = props
  // 人才列表-当前索引
  const [avatarIndex, dispatchAvatarIndexChange] = useReducer(
    avatarIndexChangeReducer,
    0
  )
  // 是否目标用户：v2 + v3
  const [isAimsUser, setIsAimsUser] = useState(false)
  // 活动是否在有效时间
  const [valid, setValid] = useState(false)
  // 人才列表-当前索引变化的定时器id
  const [avatarIndexId, setAvatarIndexId] = useState(null)
  // 人才列表-搜索参数-query
  const [query, setQuery] = useState('')
  // 人才列表-是否在搜索中
  const [isSearching, setIsSearching] = useState(false)
  // 人才报告-是否在搜索中
  const [isReportSearching, setIsReportSearching] = useState(false)
  // 人才列表-是否搜过
  const [hasSearch, setHasSearch] = useState(false)
  // 人才列表
  const [talentLists, setTalentLists] = useState([])
  // 人才列表- total_match
  const [totalMatch, setTotalMatch] = useState(0)
  // 是否开通企业号
  const [openStatus, setOpenStatus] = useState(0)
  // 是否企业号管理员
  const [isCompanyVip, setIsCompanyVip] = useState(0)
  // 是否付费企业号
  const [saleType, setSaleType] = useState(0)
  // modal1
  const [modal1, setModal1] = useState(false)
  // modal2
  const [modal2, setModal2] = useState(false)
  // randamTags
  const [randamTags, setRandamTags] = useState([])
  // 搜索结果<10 ?
  const [resLessTen, setResLessTen] = useState(false)
  // 二次搜索 随机的hot词
  const [againHot, setAgainHot] = useState('')
  // headerImg
  const headerImg = useRef(null)
  // headerImgHeight
  const [headerImgHeight, setHeaderImgHeight] = useState(0)
  // headerImgWidth
  const [headerImgWidth, setHeaderImgWidth] = useState(0)
  // search status
  const [searchIsSuccess, setSearchIsSuccess] = useState(true)
  // report search status
  const [reportSearchIsSuccess, setReportSearchIsSuccess] = useState(true)

  const [analysisData, setAnalysisData] = useState([
    {
      type: 'mediumHighPortrait',
      info: [
        { title: '硕士以上高学历', field: 'high_degree_percent', num: 0.1 },
        {
          title: '在大厂或500强工作',
          field: 'work_in_top_company_percent',
          num: 0.1,
        },
        {
          title: '五年以上工作经验',
          field: 'work_exp_gt_5_years_percent',
          num: 0.1,
        },
        { title: '在企业担任高管', field: 'senior_manager_percent', num: 0.1 },
      ],
    },
    {
      type: 'jobSearchTalentPortrait',
      info: [
        { title: '关注行情', field: 'watch_market_percent', num: 0.1 },
        { title: '正在看机会', field: 'seeking_chances_percent', num: 0.1 },
        {
          title: '近期投递简历',
          field: 'recently_submitted_resume_percent',
          num: 0.1,
        },
        {
          title: '近期沟通职位',
          field: 'recently_communicated_percent',
          num: 0.1,
        },
      ],
    },
  ])

  const handleGetValidateTime = (isV23 = false) => {
    request(
      `/api/ent/discover/search/middle_and_high_end/validate?channel=www&version=1.0.0`
    ).then((res) => {
      if (res && res.data) {
        setValid(R.pathOr(0, ['data', 'valid'], res) === 1)
        // v2 v3 且过期了
        if (R.pathOr(0, ['data', 'valid'], res) === 0 && isV23) {
          setTimeout(() => {
            window.location.href = 'https://maimai.cn/'
          }, 3000)
        }
      }
    })
  }

  const handleGetCompanyInfo = () => {
    setOpenStatus(R.pathOr(0, ['openStatus'], companyFans))
    setIsCompanyVip(R.pathOr(0, ['isCompanyVip'], companyFans))
    setSaleType(R.pathOr(0, ['saleType'], companyFans))
  }

  const handleGetRandam = () => {
    const indexArr = []
    while (indexArr.length < 6) {
      const randomInt = Math.floor(Math.random() * tags.length)
      if (!indexArr.includes(randomInt)) {
        indexArr.push(randomInt)
      }
    }
    return tags.filter((item, index) => indexArr.includes(index))
  }

  const handleResize = () => {
    const headerHeight = R.pathOr(0, ['current', 'clientHeight'], headerImg)
    const headerWidth = R.pathOr(0, ['current', 'clientWidth'], headerImg)
    if (headerHeight && headerWidth) {
      setHeaderImgHeight(headerHeight)
      setHeaderImgWidth(headerWidth)
    }
  }

  useEffect(() => {
    const randTags = handleGetRandam()
    setRandamTags(randTags)
    // get company info
    handleGetCompanyInfo()
    // 这里currentUser有可能还没有就绪，是{}
    handleGetValidateTime(R.pathOr(3, ['identity'], currentUser) !== 3)
    window.addEventListener('resize', handleResize, false)
    // pageView
    trackEvent('snatch_talent_page_view', {
      uid: window.uid,
    })
    dispatch({
      type: 'companyFans/fetchCompanyInfos',
    })
    handleSearch(randTags[0])
    setQuery(randTags[0])
    return () => {
      if (avatarIndexId) {
        clearInterval(avatarIndexId)
        setAvatarIndexId(null)
      }
      window.removeEventListener('resize', handleResize, false)
    }
  }, [])

  useEffect(() => {
    handleResize()
    if (
      openStatus !== R.pathOr(0, ['openStatus'], companyFans) ||
      isCompanyVip !== R.pathOr(0, ['isCompanyVip'], companyFans) ||
      saleType !== R.pathOr(0, ['saleType'], companyFans)
    ) {
      handleGetCompanyInfo()
    }
    if (
      currentUser &&
      Object.prototype.hasOwnProperty.call(currentUser, 'identity')
    ) {
      setIsAimsUser(currentUser.identity !== 3)
      // 非v2 v3 跳转人才银行免费版本
      if (currentUser.identity === 3) {
        // console.log('非 v2 v3 跳转 人才银行免费版本')
        history.push(`/ent/talents/discover/search_v2`)
        // v2 v3
      } else if (isAimsUser !== (currentUser.identity !== 3)) {
        handleGetValidateTime(true)
      }
    }
  })

  const scrollToSearchTalent = () => {
    window.scrollTo(0, headerImgHeight + 680)
  }

  const handleAvatarIndexChange = () => {
    dispatchAvatarIndexChange()
  }

  const handleGetAnalysisReport = (str) => {
    const sid = GUID()
    setIsReportSearching(true)
    request(
      `/api/ent/discover/search/middle_and_high_end/analysis?query=${str}&sid=${sid}&sessionid=${sid}&channel=www&version=1.0.0`
    ).then((res) => {
      if (res && res.data && res.data.code === 0) {
        setReportSearchIsSuccess(true)
        const resData = res.data.data
        const newAnalysisData = analysisData
        newAnalysisData[0].info.forEach((item) => {
          if (Object.prototype.hasOwnProperty.call(resData, item.field)) {
            const i = item
            i.num = resData[item.field]
          }
        })
        newAnalysisData[1].info.forEach((item) => {
          if (Object.prototype.hasOwnProperty.call(resData, item.field)) {
            const i = item
            i.num = resData[item.field]
          }
        })
        setAnalysisData(newAnalysisData)
        setIsReportSearching(false)
        setHasSearch(true)
      } else {
        // report 接口失败
        setReportSearchIsSuccess(false)
      }
    })
  }

  const handleSearchTalent = (str, again = false) => {
    // 是否 二次搜索
    setResLessTen(again)
    setIsSearching(true)
    // 清空定时器
    if (avatarIndexId) {
      clearInterval(avatarIndexId)
      setAvatarIndexId(null)
      // 重置 avatar index
      dispatchAvatarIndexChange({
        type: 'clickChange',
        payload: 0,
      })
    }
    const sid = GUID()
    request(`/api/ent/discover/search`, {
      method: 'POST',
      query: {
        channel: 'www',
        data_version: '3.0',
        version: '3.0',
      },
      body: {
        search: {
          query: str,
          page: 0,
          size: 10,
          sid,
          sortby: 0,
          sessionid: sid,
        },
      },
    }).then((res) => {
      if (res && res.data && res.data.code === 0) {
        setSearchIsSuccess(true)
        const totalMatchNum = R.pathOr(0, ['data', 'data', 'total_match'], res)
        const list = R.pathOr(0, ['data', 'data', 'list'], res)
        const total = R.pathOr(0, ['data', 'data', 'total'], res)
        if (totalMatchNum >= 10) {
          if (list.length === 0 && total === 0) {
            // 当错误处理
            setIsSearching(false)
            setSearchIsSuccess(false)
          } else {
            setTalentLists(
              R.pathOr([], ['data', 'data', 'list'], res).slice(0, 9)
            )
            setIsSearching(false)
            setHasSearch(true)
            setTotalMatch(totalMatchNum)
            setAvatarIndexId(setInterval(handleAvatarIndexChange, 3000))
          }
        } else {
          // 随机hot 再搜
          const randamIndex = Math.floor(Math.random() * 6)
          setAgainHot(randamTags[randamIndex] || '产品经理')
          handleSearchTalent(randamTags[randamIndex] || '产品经理', true)
          handleGetAnalysisReport(randamTags[randamIndex] || '产品经理')
        }
      } else {
        // search 接口失败
        setSearchIsSuccess(false)
      }
    })
  }

  const handleSearch = (str = '') => {
    // 是否在搜索中
    if (isSearching || isReportSearching) {
      return
    }
    // 搜索人才列表
    handleSearchTalent(str)
    // 分析报告
    handleGetAnalysisReport(str)
  }

  const handleHotClick = (item) => {
    scrollToSearchTalent()
    setQuery(item)
    handleSearch(item)
  }

  const handleInputClick = () => {
    scrollToSearchTalent()
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const handleCompany = () => {
    trackEvent('snatch_talent_immediately_get_talent')
    // 已开通企业号 且是管理员---跳转企业号 /ent/v2/company/home
    if (openStatus === 1 && isCompanyVip === 1) {
      history.push(`/ent/v2/company/home?fr=snatch_talent&query=${query}`)
    }
    // 已开通企业号 且非管理员---弹窗a
    if (openStatus === 1 && isCompanyVip === 0) {
      setModal1(true)
    }
    // 未开通企业号---弹窗b
    if (openStatus === 0) {
      setModal2(true)
    }
  }

  const handleOpenEnterpriseAuthority = () => {
    const webcid = R.pathOr('', ['company', 'webcid'], currentUser)
    const stdname = R.pathOr('', ['company', 'stdname'], currentUser)
    trackEvent('snatch_talent_open_free_account_btn')
    // 商机沉淀
    dispatch({
      type: 'entInvite/keepBusiness',
      payload: {
        fr: 'snatchTalent',
        uid: window.uid,
      },
    })
    dispatch({
      type: 'global/fetchOpenFreeAccount',
      payload: {
        u: window.uid,
        webcid,
        cname: stdname,
      },
    }).then((res) => {
      const { code } = res
      if (code === 0) {
        dispatch({
          type: 'companyFans/fetchCompanyInfos',
          payload: {
            use_master: 1,
          },
        }).then(() => {
          setTimeout(() => {
            window.open(
              `/ent/v2/company/home?fr=snatch_talent&query=${query || againHot}`
            )
            window.location.reload()
          }, 500)
        })
      }
    })
  }

  const renderButtonTags = (item) => {
    return (
      <div key={item.title} className={styles.bottomTagsItem}>
        <div className={styles.title}>{item.title}</div>
        <div className={styles.subTitle}>{item.subTitle}</div>
      </div>
    )
  }

  const renderAnalysisReportItemRight = ({ title = '', num, field }) => {
    return (
      <div
        key={title}
        style={{
          height: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: '106px',
            height: '20px',
            color: '#15161F',
            fontSize: '12px',
            lineheight: '20px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: '326px',
            height: '16px',
            background: '#F4F5FA',
            borderRadius: '4px',
            position: 'relative',
          }}
        >
          <span
            style={{
              width: `${326 * num}px`,
              display: 'inline-block',
              height: '16px',
              lineHeight: '16px',
              fontSize: '12px',
              borderRadius: '4px',
              position: 'absolute',
              left: 0,
              background: `${
                mediumHighPortraitFields.includes(field) ? '#3B7AFF' : '#78C905'
              }`,
            }}
          />
          <span
            style={{
              display: 'inline-block',
              height: '16px',
              lineHeight: '16px',
              fontSize: '12px',
              marginLeft: '4px',
              position: 'absolute',
              left: `${326 * num - 3}px`,
              top: '0',
              color: `${
                mediumHighPortraitFields.includes(field) ? '#3B7AFF' : '#78C905'
              }`,
            }}
          >
            {`${(num * 100).toFixed(0)}%`}
          </span>
        </div>
      </div>
    )
  }

  const renderAnalysisReportItem = ({ type, info = [] }) => {
    const isMediumHighPortrait = type === 'mediumHighPortrait'
    return (
      <div
        className={`${styles.analysisReportItem} ${
          isMediumHighPortrait
            ? styles.mediumHighPortraitItem
            : styles.jobSearchTalentPortraitItem
        }`}
      >
        <div className={styles.analysisReportItemLeft}>
          <AnalysisReport
            bgcolor={isMediumHighPortrait ? '#E6EEFF' : '#F4FFE6'}
            color={isMediumHighPortrait ? '#3B7AFF' : '#78C905'}
            title={
              isMediumHighPortrait ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ height: '20px', lineHeight: '20px' }}>
                    中高端
                  </div>
                  <div style={{ height: '20px', lineHeight: '20px' }}>人才</div>
                  <div style={{ height: '20px', lineHeight: '20px' }}>画像</div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ height: '20px', lineHeight: '20px' }}>求职</div>
                  <div style={{ height: '20px', lineHeight: '20px' }}>人才</div>
                  <div style={{ height: '20px', lineHeight: '20px' }}>画像</div>
                </div>
              )
            }
          />
        </div>
        <div className={styles.analysisReportItemRight}>
          {info.map(renderAnalysisReportItemRight)}
        </div>
      </div>
    )
  }

  const renderHeader = () => {
    let snatchbtnStyles = {}
    snatchbtnStyles = {
      top: `${(274 / 386) * headerImgHeight}px`,
      left: `${(headerImgWidth - 128) / 2}px`,
      height: `${(3 / 28) * headerImgHeight}px`,
    }
    return (
      <div
        className={styles.header}
        style={{
          position: 'relative',
        }}
      >
        <img
          ref={headerImg}
          style={{ width: '100%' }}
          alt="headerImg"
          src={`${urlPrefix}/images/snatchTalentHeader.png`}
        />
        <div
          style={{ position: 'absolute', ...snatchbtnStyles }}
          className={styles.snatchbtn}
          onClick={scrollToSearchTalent}
        >
          {' '}
        </div>
      </div>
    )
  }

  const renderCarousel = () => {
    const arrowStyles = {
      position: 'absolute',
      zIndex: 2,
      top: 'calc(50% - 15px)',
      width: 30,
      height: 30,
      cursor: 'pointer',
    }
    return (
      <div className={styles.carousel}>
        <div className={styles.carouselCon}>
          <Carousel
            autoPlay
            renderThumbs={() => {}}
            showStatus={false}
            infiniteLoop
            interval={3000}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <div
                  style={{ ...arrowStyles, left: 15 }}
                  title={label}
                  onClick={onClickHandler}
                >
                  <img
                    alt="img"
                    src={`${urlPrefix}/images/snatchTalentLeftArrow.png`}
                  />
                </div>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <div
                  style={{ ...arrowStyles, right: 15 }}
                  title={label}
                  onClick={onClickHandler}
                >
                  <img
                    alt="img"
                    src={`${urlPrefix}/images/snatchTalentRightArrow.png`}
                  />
                </div>
              )
            }
          >
            <div>
              <img alt="img" src={`${urlPrefix}/images/snatch_talent01.png`} />
            </div>
            <div>
              <img alt="img" src={`${urlPrefix}/images/snatch_talent02.png`} />
            </div>
            <div>
              <img alt="img" src={`${urlPrefix}/images/snatch_talent03.png`} />
            </div>
          </Carousel>
        </div>
      </div>
    )
  }

  const renderLoading = (type = 'talentSearch') => {
    return (
      <div
        className={styles.left}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          float: type === 'talentSearch' ? 'left' : 'right',
        }}
      >
        {isSearching && (
          <div style={{ width: '90px', margin: '0 auto' }}>
            <div>
              <Loading /> 加载中...
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderErrorInterface = (type = 'talentSearch') => {
    const errorJsx = (
      <React.Fragment>
        <div className={styles.title}>
          {type === 'talentSearch' ? '正在为您搜索人才…' : '搜索结果分析中…'}
        </div>
        <div
          style={{
            width: '120px',
            height: '120px',
            margin: '0 auto',
            marginTop: '24px',
            marginBottom: '16px',
          }}
        >
          <img
            alt="empty_position"
            style={{
              width: '120px',
              height: '120px',
              display: 'inline-block',
            }}
            src={`${urlPrefix}/images/empty_position.png`}
          />
        </div>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          {`服务器好像出了点问题…>.<`}
        </div>
        <div style={{ textAlign: 'center' }}>
          <MUIButton
            type="mbutton_m_exact_blue450_l1"
            style={{
              height: '32px',
              width: '88px',
            }}
            onClick={() => {
              if (type === 'talentSearch') {
                handleSearchTalent(query)
              } else {
                handleGetAnalysisReport(query)
              }
            }}
          >
            点击重试
          </MUIButton>
        </div>
      </React.Fragment>
    )

    return errorJsx
  }

  const renderSearch = () => {
    const currentItem = R.pathOr({}, [`${avatarIndex}`], talentLists)
    const activeState = R.pathOr('', ['active_state'], currentItem)
    const company = R.pathOr('', ['company'], currentItem)
    const position = R.pathOr('', ['position'], currentItem)
    const school = R.pathOr('', ['school'], currentItem)
    const sdegree = R.pathOr('', ['sdegree'], currentItem)
    const job_preferences = R.pathOr('', ['job_preferences'], currentItem)
    const area = formatArea({
      province: currentItem.province,
      city: currentItem.city,
    })
    const baseInfoFields = [
      'area',
      'sdegree',
      'worktime',
      'age',
      'gender_str',
      'salary',
    ]

    const baseInfo = R.evolve(
      {
        age: (v) => `${v}岁`,
      },
      R.compose(
        R.pickBy((v) => !R.isNil(v) && !R.isEmpty(v) && !R.equals(v, '不限')),
        R.pickAll(baseInfoFields)
      )({
        ...currentItem,
        area,
      })
    )
    return (
      <div className={styles.search}>
        <div className={styles.bigTitle}>
          <div>全库智能搜索人才，</div>
          <div>第一时间发现求职动向。</div>
        </div>
        <div className={styles.searchInput}>
          <div className={styles.left}>
            <Input
              value={query}
              onPressEnter={() => {
                if (isSearching || isReportSearching) {
                  return
                }
                handleSearch(query)
              }}
              onClick={handleInputClick}
              onChange={handleInputChange}
              placeholder="输入职位、技能、公司等条件搜索"
              style={{ height: '56px', border: 'none', paddingLeft: '32px' }}
            />
          </div>
          <MUIButton
            type="mbutton_m_exact_blue450_l1"
            style={{
              height: '56px',
              width: '128px',
              cursor:
                isSearching || isReportSearching ? 'not-allowed' : 'pointer',
            }}
            onClick={() => {
              if (isSearching || isReportSearching) {
                return
              }
              trackEvent('snatch_talent_discovery_talent_btn_click')
              handleSearch(query)
            }}
          >
            发现人才
          </MUIButton>
        </div>
        <div className={styles.tags}>
          <span className={styles.tagsPreText}>热门</span>
          {randamTags.map((item) => {
            return (
              <span
                key={item}
                className={styles.tagsItem}
                style={{
                  cursor:
                    isSearching || isReportSearching
                      ? 'not-allowed'
                      : 'pointer',
                }}
                onClick={() => {
                  if (isSearching || isReportSearching) {
                    return
                  }
                  trackEvent('snatch_talent_hot_btn_click', {
                    query: item,
                  })
                  handleHotClick(item)
                }}
              >
                {item}
              </span>
            )
          })}
        </div>
        <div className={styles.searchResult}>
          {isSearching && renderLoading('talentSearch')}
          {!isSearching && hasSearch && searchIsSuccess && (
            <div className={styles.left}>
              {!resLessTen && (
                <div className={styles.title}>
                  为你找到
                  <span className={styles.talentNum}>
                    {totalMatch > 9999 ? '9999+' : totalMatch}
                  </span>
                  个符合条件的人才
                </div>
              )}
              {resLessTen && (
                <div className={styles.title}>
                  相关人才较少，推荐“
                  <span style={{ color: '#3F7FFF' }}>{againHot}</span>
                  ”的搜索结果
                </div>
              )}
              <div className={styles.avatar}>
                {talentLists.map((item, index) => {
                  const scaleParams =
                    index === avatarIndex
                      ? {
                          transform: `matrix(1.2, 0, 0, 1.2, 0, 0)`,
                          boxShadow: `0px 6px 18px 0px rgba(21, 22, 31, 0.14)`,
                        }
                      : {}
                  return (
                    <MUIAvatar
                      key={`${item.avatar}`}
                      shape="circle"
                      size="40px"
                      src={item.avatar}
                      style={{
                        marginRight: '16px',
                        cursor: 'pointer',
                        ...scaleParams,
                      }}
                      onClick={() => {
                        if (index === 8) {
                          return
                        }
                        dispatchAvatarIndexChange({
                          type: 'clickChange',
                          payload: index,
                        })
                      }}
                    />
                  )
                })}
                <img
                  alt="more"
                  className={styles.lastAvatarImg}
                  src={`${urlPrefix}/images/snatch_talent_more_avatar.png`}
                />
                <div className={styles.lastAvatarMask} />
              </div>
              <div className={styles.card}>
                <div
                  className={styles.smallArrow}
                  style={{
                    transform: `matrix(0.707,0.707,-0.707,0.707,${
                      -3 + avatarIndex * 56
                    },-12)`,
                  }}
                />
                <div className={styles.line1}>
                  <span className={styles.name}>
                    {R.pathOr('', [`${avatarIndex}`, 'name'], talentLists)}
                  </span>
                  {R.pathOr('', [`${avatarIndex}`, 'judge'], talentLists) ===
                    1 && <Icon type="v" className="margin-left-4" />}
                  {activeState && (
                    <span className={styles.time}>
                      {activeState === '在线'
                        ? activeState
                        : `${activeState}来过`}
                    </span>
                  )}
                </div>
                <div className={styles.line2}>
                  {Object.values(baseInfo).join(' / ')}
                </div>
                <div className={styles.line3}>
                  <span className={styles.l}>现任</span>
                  {company}·{position}
                </div>
                <div className={styles.line4}>
                  <span className={styles.l}>学历</span>
                  {school}·{sdegree}
                </div>
                <div className={styles.line5}>
                  <span className={styles.l}>期望</span>
                  {job_preferences || '-'}
                </div>
              </div>
            </div>
          )}
          {!isSearching && !searchIsSuccess && (
            <div className={styles.left}>
              {renderErrorInterface('talentSearch')}
            </div>
          )}
          {!isReportSearching && !reportSearchIsSuccess && (
            <div className={styles.left} style={{ float: 'right' }}>
              {renderErrorInterface('report')}
            </div>
          )}

          {isReportSearching && renderLoading('report')}
          {!isReportSearching && hasSearch && reportSearchIsSuccess && (
            <div className={styles.right}>
              <div>
                <img
                  alt="img"
                  style={{ width: '24px', height: '24px', marginRight: '4px' }}
                  src={`${urlPrefix}/images/snatchTalentData.png`}
                />
                <span className={styles.title}>搜索分析报告</span>
                {analysisData.map(renderAnalysisReportItem)}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderFooter = () => {
    return (
      <div className={styles.getTalent}>
        <div className={styles.bigTitle}>
          <div>获取你要找的人才，</div>
          <div>有多个好方法。</div>
        </div>
        <div className={styles.tabs}>{bottomTags.map(renderButtonTags)}</div>
        <div
          className={styles.btnCon}
          onClick={handleCompany}
          style={{ position: 'relative' }}
        >
          <MUIButton
            type="mbutton_m_exact_blue450_l1"
            style={{ height: '48px', width: '100%' }}
          >
            立即获取人才
          </MUIButton>
          <div
            style={{
              color: '#FFF',
              background: '#FF4D3C',
              borderRadius: '4px',
              textAlign: 'center',
              width: '31px',
              heiht: '16px',
              lineHeight: '16px',
              position: 'absolute',
              top: '-8px',
              right: '-8px',
            }}
          >
            限免
          </div>
        </div>
      </div>
    )
  }

  const renderModal1 = () => {
    const stdname = R.pathOr('', ['company', 'stdname'], currentUser)
    return (
      <MUIModal
        key="Modal1"
        type="notice"
        title={
          <div>
            <span>温馨提示</span>
          </div>
        }
        visible={modal1}
        onOk={() => {
          setModal1(false)
        }}
        onCancel={() => {
          setModal1(false)
        }}
        width={420}
        footer={
          <div>
            <MUIButton
              type="mbutton_m_fixed_blue450_l1"
              onClick={() => {
                setModal1(false)
              }}
            >
              我知道了
            </MUIButton>
          </div>
        }
      >
        <p style={{ color: '#6E727A' }}>
          你的账号非{stdname}企业号管理员，暂无权限登录企业号。
        </p>
      </MUIModal>
    )
  }

  const renderModal2 = () => {
    return (
      <MUIModal
        key="Modal2"
        type="notice"
        title={
          <div>
            <span>温馨提示</span>
          </div>
        }
        visible={modal2}
        onOk={() => {
          setModal2(false)
        }}
        onCancel={() => {
          setModal2(false)
        }}
        width={420}
        footer={
          <div>
            <MUIButton
              type="mbutton_m_fixed_l3"
              onClick={() => {
                setModal2(false)
                trackEvent('snatch_talent_cancel_free_account_btn')
              }}
            >
              取消
            </MUIButton>
            <MUIButton
              type="mbutton_m_fixed_blue450_l1"
              onClick={() => {
                setModal2(false)
                // 开通企业号
                handleOpenEnterpriseAuthority()
              }}
            >
              开通
            </MUIButton>
          </div>
        }
      >
        <p style={{ color: '#6E727A' }}>
          恭喜！你获得了开通脉脉企业号的机会（30天免费版），是否立刻开通？
        </p>
      </MUIModal>
    )
  }

  return (
    <div className={`${styles.snatchTalent}`}>
      {isAimsUser && !valid && <div>活动已失效，3s后为您自动跳转到脉脉</div>}
      {!(isAimsUser && !valid) && (
        <React.Fragment>
          {renderHeader()}
          {renderCarousel()}
          {renderSearch()}
          {hasSearch && renderFooter()}
          {renderModal1()}
          {renderModal2()}
        </React.Fragment>
      )}
    </div>
  )
}

export default withRouter(
  connect((state, dispatch) => ({
    dispatch,
    currentUser: state.global.currentUser,
    urlPrefix: state.global.urlPrefix,
    companyFans: state.companyFans,
  }))(SnatchTalent)
)
