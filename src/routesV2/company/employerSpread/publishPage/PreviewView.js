import React, { PureComponent } from 'react'
import { FeedCard, Button, Text } from 'mm-ent-ui'
import { connect } from 'react-redux'
import * as R from 'ramda'
import styles from './PreviewView.less'

const previewbg1 = '/images/employer_spread_preview.png'
const previewbg2 = '/images/employer_spread_preview_home_page.png'

@connect((state) => ({
  urlPrefix: state.global.urlPrefix,
  preData: state.company.preData,
  employerSpreadData: state.company.employerSpreadData,
  jobs: state.global.jobs,
  config: state.global.config,
}))
export default class PreviewView extends PureComponent {
  componentDidMount() {}

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

  renderHomeFeed = () => {}

  render() {
    const promoteTypeMap = {
      5: '+ 关注',
      6: '立即查看',
      7: '接受邀请',
    }

    const {
      employerSpreadData: {
        content = '',
        promote_type: promoteType,
        jid = null,
        feed,
      },
      loadImg,
      imgSrc,
      preData,
      sourceJobs,
    } = this.props
    let station = ''
    // eslint-disable-next-line no-unused-vars
    let city = ''
    // eslint-disable-next-line no-unused-vars
    let position = ''
    // eslint-disable-next-line no-unused-vars
    let salary = ''
    if (jid !== 0) {
      station = sourceJobs.find((element) => element.jid === jid)
      city = R.propOr('', 'city', station)
      position = R.propOr('', 'position', station)
      salary = R.propOr('', 'salary_info', station)
    }

    let dom = null
    if (promoteType === 8) {
      dom = (
        <div
          className={styles.mobileHomeBox}
          style={{
            backgroundImage: `url(${this.props.urlPrefix}${previewbg2}`,
            backgroundSize: 'cover',
            left: `${(document.body.clientWidth - 263) / 2}px`,
          }}
        >
          {' '}
          <MobieFeedCard {...feed} />
        </div>
      )
    } else {
      dom = (
        <div
          className={styles.employerSpreadProcessingPreviewView}
          style={{
            backgroundImage: `url(${this.props.urlPrefix}${previewbg1}`,
            backgroundSize: 'cover',
            left: `${(document.body.clientWidth - 263) / 2}px`,
          }}
        >
          <div className={styles.employerSpreadProcessingContent}>
            <FeedCard
              logoProps={{
                name: R.pathOr('', ['company_info', 'cname'], preData),
                src: R.pathOr('', ['company_info', 'clogo'], preData),
              }}
              line1={[`${R.pathOr('', ['company_info', 'cname'], preData)}`]}
              line2={`${R.pathOr(
                '',
                ['company_info', 'people'],
                preData
              )}·${R.pathOr('', ['company_info', 'stage'], preData)}`}
              style={{ fontSizer: '12px' }}
            />
            <div className={styles.employerSpreadProcessingText}>
              <Text type="text_primary" size={12}>
                {content}
              </Text>
            </div>
            {loadImg && (
              <div className={styles.employerSpreadProcessingImg}>
                <img
                  alt="s"
                  src={imgSrc}
                  style={{
                    display: 'block',
                    ...{ width: '200px', height: '112px' },
                  }}
                />
              </div>
            )}
            {jid !== 0 && (
              <div
                className={`${styles.employerSpreadProcessingPosition} flex`}
              >
                <div style={{ width: '60%' }}>
                  <div>
                    <Text type="text_primary" size={12}>
                      {station.position}
                    </Text>
                  </div>
                  <div>
                    <Text type="text_primary" size={12}>
                      {station.province} {this.getWorkTimeText()}{' '}
                      {this.getDegreesText()}
                    </Text>
                  </div>
                </div>

                <div
                  style={{
                    width: '40%',
                    textAlign: 'right',
                  }}
                >
                  <Text
                    type="text_primary"
                    spreadProps={{ maxLine: 1 }}
                    size={12}
                    style={{ color: '#FCC76F' }}
                  >
                    {salary}
                  </Text>
                </div>
              </div>
            )}
            <Button
              type="button_m_fixed_blue450"
              onClick={this.handleClick}
              style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}
            >
              {promoteTypeMap[promoteType]}
            </Button>
          </div>
        </div>
      )
    }
    return dom
  }
}

const MobieFeedCard = (props) => {
  const { style1 } = props
  const { text, imgs = [], header } = style1 || {}
  const { avatar_card: avatarCard = {}, clean_title: cleanTitle = '' } =
    header || {}
  const { icon_url: iconUrl = '' } = avatarCard.avatar || {}

  return (
    <div className={styles.mobileHomePreview}>
      <div className={styles.head}>
        <img className={styles.avatar} src={iconUrl} />
        <div className={styles.companyInfo}>
          <div className={styles.text}>{cleanTitle}</div>
          <div className={styles.type}>企业号</div>
        </div>
      </div>
      <div className={styles.feedText}>{text}</div>
      {imgs.length > 0 && (
        <div className={styles.feedImg}>
          {imgs.map((item) => (
            <img className={styles.pic} src={item.url} />
          ))}
        </div>
      )}

      <div className={styles.feedTag}>
        <img className={styles.feedTagIcon} src={iconUrl} />
        <div className={styles.feedTagText}>{cleanTitle} </div>
      </div>
      <div className={styles.feedBar}>
        <img
          className={styles.feedBarImg}
          src="https://i9.taou.com/maimai/p/24160/8043_53_61qKwSzFEUCeC5XJ"
        />
      </div>
    </div>
  )
}
