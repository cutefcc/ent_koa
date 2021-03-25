import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import { Button, Modal, message, Empty } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { MUIButton, Text } from 'mm-ent-ui'
import { trackEvent } from 'utils'
import styles from './index.less'

const PointsMall = withRouter(
  ({
    auth,
    bprofileUser,
    currentUser,
    totalPoints,
    goodsList,
    goodsRecord,
    dispatch,
  }) => {
    const [recordVisible, setrecordVisible] = useState(false)
    const webcid = R.pathOr('', ['company', 'webcid'], bprofileUser)
    const fetchData = () => {
      webcid &&
        dispatch({
          type: 'companyTask/fetchMallData',
          payload: {
            webcid,
          },
        })
    }

    useEffect(() => {
      fetchData()
      trackEvent('bprofile_task_center', {
        target_type: 'show',
        card_type: 'goods',
      })
    }, [])

    const handleExchange = (goods_id, goods_name, points) => {
      const { isTalentBankStable } = auth
      const isAdmin = () => R.pathOr(0, ['ucard', 'is_adm'], currentUser) === 1

      trackEvent('bprofile_task_center', {
        target_type: 'click',
        card_type: 'goods',
        card_name: goods_name,
      })

      if (goods_id < 3 && !(isTalentBankStable && isAdmin())) {
        // 电话沟通券，立即沟通券,人才银行v3管理员可兑换
        Modal.warning({
          title:
            '非常抱歉，你不是人才银行v3版本管理员，该奖品不能兑换，详情可咨询负责销售。',
          okText: '知道了',
        })
        return
      }
      if (points > totalPoints) {
        message.warn('剩余积分不足')
        return
      }

      Modal.confirm({
        title: '是否确认兑换该奖品？',
        icon: <QuestionCircleOutlined />,
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: 'companyTask/pointsExchange',
            payload: {
              webcid,
              goods_id,
              points,
            },
          }).then((data) => {
            if (data.result === 'ok') {
              message.success('兑换成功')
            }
          })
        },
        onCancel() {},
      })
    }

    const getGoodsRecord = () => {
      dispatch({
        type: 'companyTask/getGoodsRecord',
        payload: {
          webcid,
        },
      })
      setrecordVisible(true)
    }

    return (
      <div className={styles.pointsMall}>
        <div className={styles.pointsMallHeader}>
          <Text type="title" size={16} style={{ margin: '16px 0' }}>
            兑换商城
          </Text>
          <Button
            onClick={getGoodsRecord}
            type="link"
            style={{ color: '#6E727A', padding: 0 }}
          >
            兑换记录
          </Button>
        </div>
        <div className={styles.goodsWrap}>
          {goodsList.map((goods) => {
            const { goods_id, goods_img, goods_name, points, btn_desc } = goods
            return (
              <div key={goods_id} className={styles.goodsCard}>
                <img alt="empty" src={goods_img} />
                <span className={styles.goodsName}>{goods_name}</span>
                <div className={styles.goodsPrice}>
                  <span>{points}积分</span>
                  <MUIButton
                    type="mbutton_m_fixed_blue450_l2"
                    onClick={() => handleExchange(goods_id, goods_name, points)}
                  >
                    {btn_desc}
                  </MUIButton>
                </div>
              </div>
            )
          })}
        </div>
        <Modal
          visible={recordVisible}
          title="兑换记录"
          onCancel={() => {
            setrecordVisible(false)
          }}
          footer={null}
          bodyStyle={{
            padding: '0 24px 16px',
            maxHeight: '400px',
            overflow: 'scroll',
          }}
        >
          {goodsRecord.map((record) => (
            <div key={record.exchange_time} className={styles.goodsRecord}>
              <span>{record.exchange_time}</span>
              <span>{record.goods_name}</span>
              <span>{record.points_info}</span>
            </div>
          ))}
          {goodsRecord.length === 0 && (
            <Empty
              style={{ padding: 20 }}
              image="https://maimai.cn/ent/images/empty_position.png"
              description="暂无兑换记录"
            />
          )}
        </Modal>
      </div>
    )
  }
)

export default connect((state, dispatch) => ({
  auth: state.global.auth,
  totalPoints: state.companyTask.totalPoints,
  goodsList: state.companyTask.goodsList,
  goodsRecord: state.companyTask.goodsRecord,
  currentUser: state.global.currentUser,
  bprofileUser: state.global.bprofileUser,
  dispatch,
}))(PointsMall)
