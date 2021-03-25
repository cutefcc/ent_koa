import React, { PureComponent } from 'react'
import { Button, Text } from 'mm-ent-ui'
import { FeedCard } from './SpreadContent'
import { injectUnmount } from 'utils'
import { Modal } from 'antd'
import * as R from 'ramda'
import { connect } from 'react-redux'
import ItemTitle from './ItemTitle'
import styles from './ComfirmModal.less'

@connect((state) => ({
  profession: state.global.profession,
  config: state.global.config,
  jobs: state.global.jobs,
}))
@injectUnmount
export default class ComfirmModal extends PureComponent {
  state = {}
  getProfessionText = () => {
    const {
      profession,
      employerSpreadData: { professions = [] },
    } = this.props
    const filterProfession = profession.filter((item) =>
      professions.includes(item.code)
    )
    if (filterProfession.length === 0) {
      return ''
    }
    return filterProfession.reduce((pre, curr) => ({
      name: `${pre.name}、${curr.name}`,
    })).name
  }

  getDegreesText = () => {
    const degreeConfig = R.propOr([], 'degree', this.props.config)
    const {
      employerSpreadData: { degrees = [] },
    } = this.props
    const filterDegree = degreeConfig.filter((item) => {
      return degrees.includes(String(item.value))
    })
    if (filterDegree.length === 0) {
      return ''
    }
    return filterDegree.reduce((pre, curr) => ({
      label: `${pre.label}、${curr.label}`,
    })).label
  }

  getCompanysText = () => {
    const {
      employerSpreadData: { companys = [] },
    } = this.props
    return companys.map((v) => v.key).join('、')
  }

  getWorkTimeText = () => {
    const worktimeConfig = R.propOr([], 'worktime', this.props.config)
    const {
      employerSpreadData: { worktimes = [] },
    } = this.props
    const filterWorkTime = worktimeConfig.filter((item) => {
      return worktimes.includes(String(item.value))
    })
    if (filterWorkTime.length === 0) {
      return ''
    }
    return filterWorkTime.reduce((pre, curr) => ({
      label: `${pre.label}、${curr.label}`,
    })).label
  }

  getCitysText = () => {
    const {
      employerSpreadData: { provinces = [] },
    } = this.props
    return provinces.join('、')
  }

  getContent = () => {
    const {
      employerSpreadData: { content = '' },
    } = this.props

    let dom = null

    if (content) {
      dom = (
        <div>
          <div>
            <Text
              type="title"
              size={14}
              style={{
                marginTop: '16px',
                marginLeft: '20px',
                marginBottom: '8px',
              }}
            >
              推广文案
            </Text>
          </div>

          <Text
            className={styles.content}
            type="text_primary"
            size={12}
            style={{ marginLeft: '20px' }}
          >
            {content}
          </Text>
        </div>
      )
    }

    return dom
  }

  getPushType = () => {
    const {
      employerSpreadData: { push_type: pushType },
    } = this.props
    return pushType === 0 ? '聊天消息推送' : '首页粉丝头条'
  }

  getFeed = () => {
    const {
      employerSpreadData: { feed },
    } = this.props
    return (
      <div
        style={{
          marginLeft: '20px',
        }}
      >
        <FeedCard {...feed} />
      </div>
    )
  }

  getJobsText = () => {
    const {
      sourceJobs,
      employerSpreadData: { jid = null },
    } = this.props
    if (!jid || (sourceJobs && sourceJobs.length === 0)) {
      return ''
    }
    const station = sourceJobs.find((element) => element.jid === jid)
    const city = R.propOr('', 'city', station)
    const position = R.propOr('', 'position', station)
    const salary = R.propOr('', 'salary_info', station)
    return city && position
      ? `${city}·${position} ${salary}`
      : `${city} ${position} ${salary}`
  }

  render() {
    const {
      employerSpreadData,
      preData,
      imgSrc,
      onOk,
      onCancel,
      width = '200px',
      height = '112px',
      employerBalance: employerPromoteNbr,
    } = this.props
    const {
      positions = [],
      is_fan: isFan,
      consume_num: consumeNum,
      fid,
    } = employerSpreadData
    const getFunText = () => {
      if (isFan === -1) return '不限'
      if (isFan === 0) return '否'
      if (isFan === 1) return '是'
      return '不限'
    }
    return (
      <Modal
        title="请确认无误后开始推广"
        visible={this.props.visible}
        width={800}
        onCancel={onCancel}
        footer={
          <div className="flex" style={{ justifyContent: 'flex-end' }}>
            <Button type="button_m_fixed_ghost_blue450" onClick={onCancel}>
              取消
            </Button>
            <Button type="button_m_exact_blue450" onClick={onOk}>
              确定
            </Button>
          </div>
        }
      >
        <div className={`${styles.comfirmModalContainer} flex`}>
          <div className={`${styles.comfirmModalContainerLeft}`}>
            <ItemTitle
              str="定向人群"
              style={{ marginTop: '0', marginBottom: '0' }}
              iconPaddingLeft="0px"
            />
            <div>
              <Text
                type="title"
                size={14}
                style={{
                  marginTop: '16px',
                  marginLeft: '20px',
                  marginBottom: '8px',
                }}
              >
                职位技能
              </Text>
            </div>
            <Text type="text_primary" size={12} style={{ marginLeft: '20px' }}>
              {positions.join('、') || '不限'}
            </Text>
            <div>
              <Text
                type="title"
                size={14}
                style={{
                  marginTop: '16px',
                  marginLeft: '20px',
                  marginBottom: '8px',
                }}
              >
                所属行业
              </Text>
            </div>
            <Text type="text_primary" size={12} style={{ marginLeft: '20px' }}>
              {this.getProfessionText() || '不限'}
            </Text>
            <div>
              <Text
                type="title"
                size={14}
                style={{
                  marginTop: '16px',
                  marginLeft: '20px',
                  marginBottom: '8px',
                }}
              >
                期望公司
              </Text>
            </div>
            <Text type="text_primary" size={12} style={{ marginLeft: '20px' }}>
              {this.getCompanysText() || '不限'}
            </Text>

            <div className={`${styles.degreeAndWorkTime} flex`}>
              <div className={`${styles.degree}`}>
                <Text
                  type="title"
                  size={14}
                  style={{
                    marginTop: '16px',
                    marginLeft: '20px',
                    marginBottom: '8px',
                  }}
                >
                  是否粉丝
                </Text>
                <div>
                  <Text
                    type="text_primary"
                    size={12}
                    style={{ marginLeft: '20px' }}
                  >
                    {getFunText() || '不限'}
                  </Text>
                </div>
              </div>
              <div className={`${styles.workTime}`}>
                <Text
                  type="title"
                  size={14}
                  style={{
                    marginTop: '16px',
                    marginLeft: '20px',
                    marginBottom: '8px',
                  }}
                >
                  工作年限
                </Text>
                <div>
                  <Text
                    type="text_primary"
                    size={12}
                    style={{ marginLeft: '20px' }}
                  >
                    {this.getWorkTimeText() || '不限'}
                  </Text>
                </div>
              </div>
            </div>
            <div className={`${styles.degreeAndWorkTime} flex`}>
              <div className={`${styles.degree}`}>
                <Text
                  type="title"
                  size={14}
                  style={{
                    marginTop: '16px',
                    marginLeft: '20px',
                    marginBottom: '8px',
                  }}
                >
                  学历要求
                </Text>
                <div>
                  <Text
                    type="text_primary"
                    size={12}
                    style={{ marginLeft: '20px' }}
                  >
                    {this.getDegreesText() || '不限'}
                  </Text>
                </div>
              </div>
              <div className={`${styles.workTime}`}>
                <div>
                  <Text
                    type="title"
                    size={14}
                    style={{
                      marginTop: '16px',
                      marginLeft: '20px',
                      marginBottom: '8px',
                    }}
                  >
                    城市地区
                  </Text>
                </div>
                <Text
                  type="text_primary"
                  size={12}
                  style={{ marginLeft: '20px', marginBottom: '24px' }}
                >
                  {this.getCitysText() || '不限'}
                </Text>{' '}
              </div>
            </div>
            <ItemTitle
              str="预计曝光人数"
              style={{ marginTop: '0', marginBottom: '0' }}
              iconPaddingLeft="0px"
            />
            <Text type="text_primary" size={12} style={{ marginLeft: '20px' }}>
              <span style={{ fontSize: '24px', color: '#3B7AFF' }}>
                {consumeNum}
              </span>{' '}
              人，消耗
              <span style={{ color: '#3B7AFF' }}>
                {consumeNum * (isFan === 1 ? 1 : 2)}
              </span>
              曝光币，当前剩余
              {employerPromoteNbr - consumeNum * (isFan === 1 ? 1 : 2)}曝光币
            </Text>
          </div>
          <div className={`${styles.comfirmModalContainerMidd}`} />
          <div className={`${styles.comfirmModalContainerRight}`}>
            <ItemTitle
              str="推广场景和内容"
              style={{ marginTop: '0', marginBottom: '0' }}
              iconPaddingLeft="0px"
            />
            <div>
              <Text
                type="title"
                size={14}
                style={{
                  marginTop: '16px',
                  marginLeft: '20px',
                  marginBottom: '8px',
                }}
              >
                推广场景
              </Text>
            </div>
            <Text
              className={styles.content}
              type="text_primary"
              size={12}
              style={{ marginLeft: '20px' }}
            >
              {this.getPushType()}
            </Text>
            {fid > 0 && (
              <div>
                <div>
                  <Text
                    type="title"
                    size={14}
                    style={{
                      marginTop: '16px',
                      marginLeft: '20px',
                      marginBottom: '8px',
                    }}
                  >
                    推广动态
                  </Text>
                  {this.getFeed()}
                </div>
              </div>
            )}
            {this.getContent()}
            {imgSrc && (
              <div>
                <Text
                  type="title"
                  size={14}
                  style={{
                    marginTop: '16px',
                    marginLeft: '20px',
                    marginBottom: '8px',
                  }}
                >
                  配图
                </Text>
              </div>
            )}
            {imgSrc && (
              <img
                alt="s"
                src={imgSrc}
                style={{
                  display: 'block',
                  ...{ width, height, marginLeft: '20px' },
                }}
              />
            )}
            {this.getJobsText() && (
              <div>
                <Text
                  type="title"
                  size={14}
                  style={{
                    marginTop: '16px',
                    marginLeft: '20px',
                    marginBottom: '8px',
                  }}
                >
                  职位
                </Text>
              </div>
            )}
            <Text
              type="text_primary"
              size={12}
              style={{ marginLeft: '20px', marginBottom: '24px' }}
            >
              {this.getJobsText()}
            </Text>
          </div>
        </div>
      </Modal>
    )
  }
}
