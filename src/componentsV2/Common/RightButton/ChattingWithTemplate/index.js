import React, { useState, useEffect, useRef } from 'react'
import { Modal, Avatar, Popover, Select } from 'antd'
import { Icon, MUIButton as Button } from 'mm-ent-ui'
import { connect } from 'react-redux'
import * as R from 'ramda'
import request from 'utils/request'
import * as styles from './index.less'

const MutiAvatars = (props) => {
  const { item } = props
  return (
    <Popover content={item.name} trigger="hover" key={item.name}>
      <Avatar
        src={item.avatar}
        className={`${styles.multiAvatar} ${item.className}`}
        key={item.name}
      />
    </Popover>
  )
}

const SingleTalent = (props) => {
  const {
    name = '',
    avatar = '',
    company = '',
    position = '',
    active_state,
    id,
    judge,
    is_job_hunting_dynamic,
  } = props.talent
  const activeText =
    active_state === '在线' ? '在线' : active_state ? `${active_state}来过` : ''
  const { isTalentBankStable } = props.auth
  const [count, setCount] = useState(0)

  const fetchData = () => {
    return request('/api/ent/card/recruiter/attention/count', {
      query: {
        channel: 'www',
        version: '1.0.0',
        to_uid: id,
      },
    }).then((res) => {
      if (res && res.data && res.data.data) {
        const data = res.data.data
        setCount(data.count)
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <p className="flex">
        <Avatar src={avatar} className={styles.singleAvatar} />
        <div className="flex-column margin-left-8 space-between ">
          <div className="margin-bottom-8">
            <span
              className={`font-size-16 font-weight-bold color-stress ${styles.intro}`}
            >
              {name}
            </span>
            <div className={`font-size-14 ${styles.intro}`}>
              {`${company}·${position}`}
              {judge === 1 && (
                <Icon
                  type="v"
                  className="color-orange2 margin-left-2 font-size-12"
                />
              )}
            </div>
          </div>
          <div className="flex">
            {activeText ? <div className={styles.tag}>{activeText}</div> : null}
            {is_job_hunting_dynamic && isTalentBankStable ? (
              <div className={styles.tag}>近期有动向</div>
            ) : null}
            {count > 0 && (
              <div className={styles.tag}>有{count}位招聘者关注</div>
            )}
          </div>
        </div>
      </p>
    </div>
  )
}

const MultiTalents = (props) => {
  const { notRecentChat, recentChat, talents, avatar } = props

  return (
    <div>
      <p className={`flex space-between ${styles.multiTalents}`}>
        <div className={styles.talentList}>
          <Avatar src={avatar} className={styles.singleAvatar} />
          <div className={styles.ellipsis}>
            <div className={styles.willSendContent}>
              将发送给
              <span className={styles.willSendNum}>{`${notRecentChat}`}</span>
              位人才
            </div>
          </div>
          {talents.slice(0, 5).map((item) => (
            <MutiAvatars item={item} />
          ))}
          {talents.length > 7 && (
            <MutiAvatars
              item={{
                avatar: '',
                name: '···',
                className: styles.multiAvatarEllipsis,
              }}
            />
          )}
        </div>
      </p>
      {recentChat > 0 ? (
        <div className={styles.multiTipsContent}>
          <div className={styles.multiTipsBottom}>
            {`已选${talents.length}人，其中${recentChat}人已沟通过`}
            {notRecentChat === 0
              ? '（本次将不发送）'
              : `，实际发送${notRecentChat}人`}
          </div>
        </div>
      ) : null}
    </div>
  )
}

const JidSelection = (props) => {
  const { allJobs, parentCallback } = props
  const getJidIfValid = () => {
    let jid = localStorage.getItem('directChatWithJid')
    jid = parseInt(jid, 10)
    if (!jid) return

    const job = allJobs.find(R.propEq('jid', jid))
    if (jid && job) {
      return jid
    }

    return
  }
  const [jid, setJid] = useState(getJidIfValid())
  const renderWithoutJidOption = () => {
    return (
      <Select.Option value={0} key={0}>
        <div className={styles.jobItem}>不带职位</div>
      </Select.Option>
    )
  }

  const renderOption = (item) => {
    const jobDescription = [item.position, item.salary, item.city].join('·')
    const time = item.judge_time
      ? item.judge_time.substr(0, 10).replace(/-/g, '/')
      : ''

    return (
      <Select.Option value={item.jid} key={item.jid}>
        <div className={styles.jobItem}>
          {jobDescription} <span className={styles.jobTime}>{time}</span>
        </div>
      </Select.Option>
    )
  }

  const handleJidChange = (jobId) => {
    let job
    if (jobId) {
      job = allJobs.find(R.propEq('jid', jobId))
    } else {
      job = { jid: 0 }
    }
    setJid(jobId)
    if (parentCallback) {
      parentCallback(job)
    }
  }

  useEffect(() => {
    parentCallback({ jid })
  }, [])

  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      listHeight={160}
      placeholder="请选择职位"
      optionFilterProp="children"
      onChange={handleJidChange}
      className={styles.positionSelect}
      value={jid}
    >
      {renderWithoutJidOption()}
      {props.allJobs
        .sort(
          (a, b) =>
            new Date(b.judge_time).getTime() - new Date(a.judge_time).getTime()
        )
        .map(renderOption)}
    </Select>
  )
}

const NameSelector = (props) => {
  const { talents, parentCallback } = props
  if (talents.length !== 1) return null
  const directChatWithName = localStorage.getItem('directChatWithName')
  const isWithName = directChatWithName === null || directChatWithName === '1'
  const name = talents[0].name
  const defaultNoName = '不使用称呼'
  const defaultName = isWithName ? name : defaultNoName
  const [nickname, setNickname] = useState(defaultName)
  const [show, setShow] = useState(false)
  const originLists = [
    { key: 'name', value: name },
    { key: 'noname', value: defaultNoName },
  ]
  const lists = isWithName ? originLists : originLists.reverse()

  useEffect(() => {
    parentCallback(lists[0])
  }, [])

  const handleClick = (item) => {
    setNickname(item.value)
    parentCallback(item)
    setShow(false)
  }
  const makeListsVisible = () => setShow(!show)

  return (
    <div>
      <div className={styles.nameSelector} onClick={makeListsVisible}>
        <span className={styles.name}>{nickname}</span>
        <Icon
          type="arrow-right-2"
          className="color-orange2 margin-left-6 font-size-12"
        />
      </div>
      <ul
        className={styles.nameLists}
        style={{ display: show ? 'block' : 'none' }}
      >
        {lists.map((item) => (
          <li key={item.key} onClick={handleClick.bind(this, item)}>
            {item.value}
          </li>
        ))}
      </ul>
    </div>
  )
}

const Template = React.forwardRef((props, ref) => {
  const { templateTextArray, parentCallback } = props
  const defaultTemplateText = templateTextArray[0] || ''
  const [length, setLength] = useState(defaultTemplateText.length)
  const [value, setValue] = useState(defaultTemplateText || '')
  const [active, setActive] = useState(0)

  const setTemplateValue = (v) => {
    setValue(v)
    parentCallback(v)
    setLength(v.length)
  }

  const handleChange = (evt) => {
    const {
      target: { value: v },
    } = evt
    if (typeof v === 'string') {
      if (v.length <= 300) {
        setTemplateValue(v)
      }
    }
  }

  useEffect(() => {
    setTemplateValue(defaultTemplateText)
  }, [defaultTemplateText])

  const clear = () => {
    setTemplateValue('')
  }

  const toggleActive = (index) => {
    if (index === active || !templateTextArray[index]) return
    setTemplateValue(templateTextArray[index])
    setActive(index)
  }

  const templateNames =
    templateTextArray.length > 1 ? ['上次发送', '招聘模板'] : ['招聘模板']

  return (
    <div>
      <textarea
        ref={ref}
        className={styles.templateInput}
        placeholder="请写一份属于ta的邀约信息，每一个人才都值得你认真对待"
        onChange={handleChange}
        value={value}
      ></textarea>
      <div className={styles.templateFooter}>
        <div>
          {templateNames.slice(0, templateTextArray.length).map((item, i) => (
            <div
              key={i}
              className={`${styles.templateTag} ${
                active === i ? styles.active : ''
              }`}
              onClick={toggleActive.bind(this, i)}
            >
              {item}
            </div>
          ))}
        </div>
        <div>
          <div className={styles.templateRightText} onClick={clear}>
            清空
          </div>
          <div className={`${styles.templateRightText} ${styles.displayText}`}>
            <span className={styles.totalText}>{length}</span>/300
          </div>
        </div>
      </div>
    </div>
  )
})

function ChattingWithTemplate(props) {
  const {
    isBatch,
    talents,
    allJobs,
    currentUser: { ucard, equity_direct_oppo },
    loading,
    dispatch,
    fromProfile,
  } = props
  const template = useRef(null)
  const [templateValue, setTemplateValue] = useState([])
  const [templateTextArray, setTemplateTextArray] = useState([])
  const [jid, setJid] = useState(0)
  const [greet, setGreet] = useState({})
  const remainFree = (equity_direct_oppo && equity_direct_oppo.remain_free) || 0
  const totalMember =
    (equity_direct_oppo && equity_direct_oppo.total_member) || 0

  const templateCallback = (v) => {
    setTemplateValue(v)
  }

  const jidCallback = (job) => {
    if (job) {
      setJid(job.jid)
    }
  }

  const nameCallback = (item) => {
    setGreet(item)
  }

  const getTemplateTextFromLocal = () => {
    let directChatTemplateText
    try {
      directChatTemplateText = localStorage.getItem('directChatTemplateText')
    } catch (err) {
      console.log(err)
      directChatTemplateText = ''
    }

    return directChatTemplateText
  }

  const fetchData = () => {
    return request('/api/ent/templates/get', {
      query: {
        channel: 'www',
        version: '1.0.0',
      },
    }).then((res) => {
      if (res && res.data && res.data.data) {
        const { content } = res.data.data

        const lastTemplateText = getTemplateTextFromLocal()
        const defaultTemplateText = content.join('')
        if (lastTemplateText && lastTemplateText !== defaultTemplateText) {
          setTemplateTextArray([lastTemplateText, defaultTemplateText])
        } else {
          setTemplateTextArray([defaultTemplateText])
        }

        setTemplateValue(defaultTemplateText)
      }
    })
  }

  useEffect(() => {
    fetchData()
    // profile will be reloaded after fetching current user
    if (fromProfile !== '1') {
      dispatch({
        type: 'global/fetchCurrentUser',
      })
    }
  }, [])

  useEffect(() => {
    if (template.current) {
      template.current.focus()
    }
  }, [template])

  const handleSubmit = (cb) => {
    let content = ''
    if (greet && greet.key) {
      content =
        greet.key === 'noname'
          ? templateValue
          : `${greet.value}，${templateValue}`
    } else {
      content = templateValue
    }

    if (templateTextArray.length && templateValue !== templateTextArray[0]) {
      localStorage.setItem('directChatTemplateText', templateValue)
    }

    localStorage.setItem('directChatWithName', greet.key === 'noname' ? 0 : 1)

    if (!Number.isNaN(jid)) {
      localStorage.setItem('directChatWithJid', jid)
    }
    props.onSubmit(content, jid, cb)
  }

  const renderTips = () => {
    const { fr } = props
    const specialFr = ['visitor_pc', 'canchat_pc']
    if (specialFr.includes(fr)) {
      return <span>候选人对你的职位有潜在意愿，本次联系免费</span>
    } else {
      return (
        <span>
          今日剩余免费额度<span className={styles.yellow}>{remainFree}</span>
          次，会员专享额度<span className={styles.yellow}>{totalMember}</span>次
        </span>
      )
    }
  }

  let notRecentChat = 0
  let recentChat = 0
  talents.forEach((item) => {
    if (
      R.pathOr('0', ['recent_dc_chat'], item) === 1 ||
      R.pathOr('0', ['is_direct_im'], item) === 1
    ) {
      recentChat += 1
    } else {
      notRecentChat += 1
    }
  })

  const footer = (
    <div className={styles.footer}>
      <div>
        <Button
          type="mbutton_m_fixed_blue450_l2"
          key="cancel"
          onClick={handleSubmit}
          disabled={
            (notRecentChat === 0 && isBatch) || loading || !templateValue
          }
          loading={loading}
        >
          发送后继续沟通
        </Button>
        <Button
          type="mbutton_m_fixed_blue450_l1"
          style={{ paddingLeft: 16, paddingRight: 16, width: 'auto' }}
          onClick={handleSubmit.bind(null, () => {})}
          disabled={
            (notRecentChat === 0 && isBatch) || loading || !templateValue
          }
          loading={loading}
          key="submit"
        >
          发送后留在此页
        </Button>
      </div>
    </div>
  )

  return (
    <Modal
      title="招聘立即沟通"
      visible={props.show}
      onCancel={props.onCancel}
      footer={footer}
      width={560}
      className={`${styles.main} ${
        talents.length === 1 ? styles.mainWithSingle : ''
      }`}
      maskClosable={false}
    >
      {talents.length === 1 && !isBatch && (
        <SingleTalent talent={talents[0]} auth={props.auth} />
      )}
      {(talents.length > 1 || isBatch) && (
        <MultiTalents
          talents={talents}
          notRecentChat={notRecentChat}
          recentChat={recentChat}
          avatar={ucard && ucard.avatar}
        />
      )}
      <div className={styles.template}>
        <NameSelector talents={talents} parentCallback={nameCallback} />
        <Template
          ref={template}
          templateTextArray={templateTextArray}
          parentCallback={templateCallback}
        />
      </div>
      <JidSelection allJobs={allJobs} parentCallback={jidCallback} />
      <p className={styles.tips}>
        将通过脉脉消息等方式极速送达（{renderTips()}）
      </p>
    </Modal>
  )
}

export default connect((state, dispatch) => ({
  auth: state.global.auth,
  dispatch,
  currentUser: state.global.currentUser,
}))(ChattingWithTemplate)
