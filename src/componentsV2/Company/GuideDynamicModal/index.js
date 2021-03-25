import React, { useEffect } from 'react'
import { trackEvent } from 'utils'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd'
import styles from './index.less'

/* eslint-disable */
function GuideDynamicModal({
  type,
  onCancel,
  publishDynamic,
  weeklyData,
  primaryIndexData,
}) {
  useEffect(() => {
    trackEvent('bprofile_company_weekly', {
      target_type: 'show',
      modal_type: type,
    })
  }, [])

  const renderWeekly = () => {
    const {
      date_str,
      week_total_exposure, // 总曝光
      week_fan, // 周增粉丝数
      week_visitor, // 吸引访客数
      enterprise_feed_count, // 发布企业动态数
      enterprise_feed_likes, // 企业动态获赞数
      employer_feed_uv, // 发动态员工数
      employer_feed_count, // 员工发动态数
      week_total_employee_exposure, // 员工动态带来的曝光
    } = weeklyData
    const { month_influence_rank } = primaryIndexData
    return (
      <Modal
        width={375}
        visible={true}
        footer={null}
        wrapClassName={styles.guideDynamicModal}
        onCancel={onCancel}
        closeIcon={
          <img
            alt="close"
            src="https://i9.taou.com/maimai/p/24648/4507_53_B2MlefODjQY6jf"
          />
        }
      >
        <p className={styles.weeklyTitle}>
          <img
            src="https://i9.taou.com/maimai/p/24643/2740_53_3PHjaFbMy98WYb"
            alt="企业号周报"
          />
          <p>{date_str}</p>
        </p>
        <div className={styles.weeklyBoard}>
          <div className={styles.board}>
            <span>新增曝光</span>
            <p>{week_total_exposure}个</p>
          </div>
          <div className={styles.board}>
            <span>收获粉丝</span>
            <p>{week_fan}位</p>
          </div>
          <div className={styles.board}>
            <span>企业影响力</span>
            <p>第{month_influence_rank}名</p>
          </div>
          <div className={styles.board}>
            <span>吸引访客</span>
            <p>{week_visitor}位</p>
          </div>
        </div>
        <div className={styles.weeklyContent}>
          <p>
            共发布了<span>{enterprise_feed_count}</span>条企业动态，获得了
            <span>{enterprise_feed_likes}</span>个点赞
          </p>
          <p>
            有<span>{employer_feed_uv}</span>个员工发布了
            <span>{employer_feed_count}</span>条内容为企业代言
          </p>
          <p>
            为企业号带来了<span>{week_total_employee_exposure}</span>个曝光
          </p>
        </div>

        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={publishDynamic}
        >
          使用超级曝光推广包
        </Button>
        <p className={styles.packageDesc} style={{ margin: '16px 0 8px' }}>
          <span>连续每周发布动态即可获得此推广包</span>
          <br />
          <span>领取后当周前2条内容可获得大流量推荐</span>
        </p>
      </Modal>
    )
  }

  const renderPackageGuide = () => {
    return (
      <Modal
        width={375}
        visible={true}
        footer={null}
        wrapClassName={styles.guideDynamicModal}
        onCancel={onCancel}
        closeIcon={
          <img
            alt="close"
            src="https://i9.taou.com/maimai/p/24648/4507_53_B2MlefODjQY6jf"
          />
        }
      >
        <p className={styles.packageTitle}>
          <img
            src="https://i9.taou.com/maimai/p/24643/2743_53_62uwervhu9JHccrL"
            alt="恭喜你获得企业号专项曝光推广包"
          />
        </p>
        <p className={styles.packageGift}>
          <img
            src="https://i9.taou.com/maimai/p/24643/2745_53_8IlxCQ3ZsNsl0p"
            alt="gift"
          />
        </p>
        <p className={styles.packageDesc}>
          <span>当天发布动态即可享受大流量曝光推广</span>
          <br />
          <span>赶紧上车发布动态吧</span>
        </p>
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={publishDynamic}
        >
          立即发布动态，赢大流量！
        </Button>
      </Modal>
    )
  }

  return type === 1 ? renderWeekly() : renderPackageGuide()
}

export default connect((state, dispatch) => ({
  weeklyData: state.company.weeklyData,
  currentUser: state.global.currentUser,
  config: state.global.config,
  dispatch,
}))(GuideDynamicModal)
