import React from 'react'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Layout, Affix, Button, message } from 'antd'
import { Typography, Modal } from 'mm-ent-ui'
import { connect } from 'react-redux'
import Auth from 'componentsV2/Common/Auth'
// import Route from './../common/Route'
import UserForm from './UserForm/index'
import MyHeader from './Header'
import MySider from './Sider_v2'
import styles from './index.less'

const { Header, Content, Sider } = Layout

@connect((state) => ({
  memberOpenTip: state.global.memberOpenTip,
  memberUpgradeTip: state.global.memberUpgradeTip,
  urlPrefix: state.global.urlPrefix,
}))
@Form.create()
@Auth
export default class MyLayout extends React.Component {
  state = {
    err: null,
  }
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'global/fetchCurrentUser',
    // })
    // this.props.dispatch({
    //   type: 'global/fetchDictionary',
    //   payload: {},
    // })
  }

  handleHideOpenMemberTip = () => {
    this.props.dispatch({
      type: 'global/setMemberOpenTip',
      payload: {
        show: false,
        msg: '',
        cancelTxt: '',
        confirmTxt: '',
      },
    })
  }

  handleHideUpgradeMemberTip = () => {
    this.props.dispatch({
      type: 'global/setMemberUpgradeTip',
      payload: {
        show: false,
        msg: '',
        cancelTxt: '',
        confirmTxt: '',
      },
    })
  }

  handleRedirectToRegister = () => {
    window.open('https://maimai.cn/job_corp_apply#contact')
  }

  handleAddOpportunityCustom = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        this.setState({
          err,
        })
        return
      }
      this.setState({
        err: null,
      })
      this.props
        .dispatch({
          type: 'global/addOpportunityCustom',
          payload: values,
        })
        .then(() => {
          message.success('信息提交成功，销售顾问将会为您提供1v1服务！')
          this.handleHideUpgradeMemberTip()
        })
    })
  }

  renderOpenMemverModal = () => {
    const { memberOpenTip } = this.props
    return (
      <Modal
        title=""
        className={styles.openMemberTip}
        width={400}
        footer={
          <div className={styles.footer}>
            <Button
              onClick={this.handleHideOpenMemberTip}
              className={styles.giveupButton}
            >
              {memberOpenTip.cancelTxt || '取消'}
            </Button>
            <Button
              className={styles.applyButton}
              onClick={this.handleRedirectToRegister}
            >
              {memberOpenTip.confirmTxt || '确定'}
            </Button>
          </div>
        }
        onCancel={this.handleHideOpenMemberTip}
        visible
        destroyOnClose
      >
        <p className="font-size-20 text-center">
          {memberOpenTip.msg || '开通招聘企业版 解锁更多功能'}
        </p>
      </Modal>
    )
  }

  renderUpgradeMemberModal = () => {
    const { memberUpgradeTip, urlPrefix = '' } = this.props
    const items = [
      {
        id: 1,
        title: '基础服务包',
        items: ['4项基本权益'],
        background: `${urlPrefix}/images/memberBg/basic_2.png`,
      },
      {
        id: 1,
        title: '中级服务包',
        items: ['6个账号', '1家同步对标企业人才'],
        background: `${urlPrefix}/images/memberBg/medium_2.png`,
      },
      {
        id: 1,
        title: '高级服务包',
        items: [
          '12个账号',
          '3家同步对标企业人才',
          '人才数据分析',
          '人才标记同步所有授权员工人脉',
        ],
        background: `${urlPrefix}/images/memberBg/premium_2.png`,
      },
    ]
    const renderItem = (item) => {
      return (
        <div
          className={styles.item}
          style={{
            background: `url(${item.background})`,
            backgroundSize: 'contain',
          }}
        >
          <h4>{item.title}</h4>
          <ul>
            {item.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )
    }

    return (
      <Modal
        title="升级企业会员"
        className={styles.upgradeMemberTip}
        width={819}
        onCancel={this.handleHideUpgradeMemberTip}
        okText={memberUpgradeTip.okText || '确定'}
        cancelText={memberUpgradeTip.cancelText || '取消'}
        onOk={this.handleAddOpportunityCustom}
        visible
        destroyOnClose
      >
        <div>
          <p className={styles.tip}>筛选结果数据可视化，总览候选人数据</p>
          <div className={styles.content}>{items.map(renderItem)}</div>
          <Typography type="stress" strong>
            填写以下信息，1v1专属顾问竭诚为您服务
          </Typography>
          <UserForm form={this.props.form} err={this.state.err} />
        </div>
      </Modal>
    )
  }

  render() {
    const { memberOpenTip, memberUpgradeTip } = this.props
    return (
      <Layout className={styles.layout}>
        <Sider
          trigger={null}
          collapsible
          // collapsed={this.state.collapsed}
          className={styles.sider}
          // width={232}
          width={160}
          style={{ zIndex: 999 }}
        >
          <MySider />
        </Sider>
        <Layout className={styles.contentLayout}>
          <Affix offsetTop={0}>
            <Header className={styles.header}>
              <MyHeader />
            </Header>
          </Affix>
          <Content className={styles.content}>
            {/* <Route /> */}
            {this.props.children}
            {memberOpenTip.show && this.renderOpenMemverModal()}
            {memberUpgradeTip.show && this.renderUpgradeMemberModal()}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
