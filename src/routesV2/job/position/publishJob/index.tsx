import * as React from 'react'
import { connect } from 'react-redux'
import { trackEvent } from 'utils'
import { Icon, Button } from 'mm-ent-ui'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { message, ConfigProvider, Modal } from 'antd'
import {
  Card1Options,
  Card2Options,
  FormFields,
  OriginalParams,
} from 'constants/publishJob'
import Company from 'componentsV2/Position/PublishJob/Company'
import Position from 'componentsV2/Position/PublishJob/Position'
import CommonInput from 'componentsV2/Position/PublishJob/CommonInput'
import CommonSelect from 'componentsV2/Position/PublishJob/CommonSelect'
import Profession from 'componentsV2/Position/PublishJob/Profession'
import WorkTimeDegree from 'componentsV2/Position/PublishJob/WorkTimeDegree'
import Salary from 'componentsV2/Position/PublishJob/Salary'
import Address from 'componentsV2/Position/PublishJob/Address'
import Description from 'componentsV2/Position/PublishJob/Description'
import PreCheckErr from 'componentsV2/Position/PublishJob/PreCheckErr'
import BuyVipModal from 'componentsV2/Position/PublishJob/BuyVipModal'
import BuyVipModalV2 from 'componentsV2/Position/PublishJob/BuyVipModalV2'
import * as styles from './index.less'
import { hotPicPing, removeHotPicPing } from 'utils/HotPicPing'
import * as R from 'ramda'

export interface Props {
  currentGroup: object
  data: object
  onChangeCurrentGroup: Function
  onHandleShowEdit: Function
  style: object
  ejid: string
}
@connect((state) => ({
  majorList: state.positions.majorList,
  majorLv2List: state.positions.majorLv2List,
  constData: state.positions.constData,
  auth: state.global.auth,
  currentUser: state.global.currentUser,
}))
@Form.create()
export default class PublishJob extends React.Component<Props> {
  constructor(props) {
    super(props)
    const { ejid } = props.match.params

    this.state = {
      ejid,
      params: Object.assign({}, OriginalParams),
      formType: ejid ? 'edit' : 'publish',
      title: ejid ? '编辑职位' : '发布职位',
      status: 0, // 1是开启的职位，2是已关闭职位
      is_hunter: false,
      verifyStatus: -1, // 当前招聘者身份是否通过
      isSureAddJob: -1, // 当前招聘者是否可以发职位 包含审核通过审核中
      card1Options: Card1Options.map((id) => ({
        ...FormFields[id],
        id,
      })),
      card2Options: Card2Options.map((id) => ({
        ...FormFields[id],
        id,
      })),
      memberType: 0,
      preChecked: false,
      preCheckErr: {},
      showModal: false,
      modalVisible: false,
      ejidFinished: null,
      payBannersData: {},
    }
  }

  componentDidMount() {
    hotPicPing()
    this.getPayBannersData()
  }
  componentWillUnmount() {
    removeHotPicPing()
  }

  componentWillMount() {
    // 检查用户是否有权限发布职位
    this.getPreCheck()

    this.props
      .dispatch({
        type: 'positions/fetchConstData',
        payload: {
          fields:
            'salary,work_times,job_degrees,job_levels,job_levels_v2,location',
        },
      })
      .then((res) => {
        this.getPreInfo()
      })
  }

  getPreCheck = () => {
    const { formType, ejid } = this.state
    const type =
      formType == 'edit' ? 'positions/preUpdate' : 'positions/prePublish'
    this.props
      .dispatch({
        type,
        payload: { ejid },
      })
      .then((res) => {
        let {
          result,
          error_code,
          error_msg,
          add_job_limit,
          update_job_limit,
        } = res
        if (result == 'ok') {
          if (add_job_limit == 1 || update_job_limit == 1) {
            this.setState({
              preCheckErr: {
                error_code,
                error_msg,
              },
            })
          } else {
            this.setState({
              memberType: res.member_type,
              preChecked: true,
            })
          }
        }
      })
  }

  getPreInfo = () => {
    this.props
      .dispatch({
        type: 'positions/fetchFormInfo',
        payload: {
          ejid: this.state.ejid,
        },
      })
      .then((res) => {
        if (res.result == 'ok') {
          let {
            job = {},
            job_mapping = {},
            user = {},
            verifyStatus = -1,
            isSureAddJob = -1,
          } = res
          let {
              salary_min,
              salary_max,
              salary_share,
              status,
              profession_new,
              city,
              province,
              address,
              company,
              email,
              work_time,
              degree,
              position,
            } = job,
            {
              profession_id,
              profession_name,
              major_id,
              major_name,
              major_code_lv2,
              major_name_lv2,
            } = job_mapping,
            { is_hunter } = user
          const jobInfo = {
            ...job,
            major_name_lv2,
            is_hunter,
            profession_path_new: profession_id,
          }
          /**
           * 编辑发布职位
           * 有历史数据city为空的情况。
           * 前端自动补上全部
           * 省份和城市一样的情况  城市自动改为全部
           * **/
          if (city === province || (!city && province)) {
            jobInfo.city = '全部'
          } else {
            jobInfo.city = city ? city : ''
          }
          if (profession_id) {
            // 获取行业方向
            this.props.dispatch({
              type: 'positions/fetchMajor',
              payload: {
                pfs: profession_id,
              },
            })
          }
          this.setState(
            {
              params: Object.assign({}, OriginalParams, jobInfo),
              status,
              verifyStatus,
              isSureAddJob,
            },
            () => {
              const professionArr = profession_id
                ? profession_id.split(',')
                : null
              this.props.form.setFieldsValue({
                company,
                position,
                profession_new: professionArr,
                major_new: major_name,
                major_new_lv2: major_name_lv2,
                address: {
                  address,
                  provinceCity: [province, jobInfo.city],
                },
                work_time_degree: {
                  work_time,
                  degree,
                },
                salary: {
                  salary_min,
                  salary_max,
                  salary_share,
                },
              })

              let type = this.state.ejid ? 'edit' : 'publish'
              // if (status != 1) type = 'reopen'
              trackEvent('jobs_pc_talent_position_publish_show', {
                type,
              })
            }
          )
        }
      })
  }

  censorJobQuery = async () => {
    return this.props
      .dispatch({
        type: 'positions/censorJob',
        payload: { infos: JSON.stringify(this.state.params) },
      })
      .then((res) => {
        if (res.error_msg) {
          message.error(res.error_msg)
          return { status: 0 }
        } else {
          return { status: 1 }
        }
      })
      .catch(() => {
        message.error('网络有点问题，请重试')
        return { status: 0 }
      })
  }

  isMeetLimit = (jid) => {
    return this.props
      .dispatch({
        type: 'positions/meetLimit',
        payload: { jid },
      })
      .then((res) => {
        return res.data && res.data.total
      })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { params } = this.state
        if (params.description.length < 20) {
          message.info('职位描述最少20个字符')
          return
        }

        if (params.position.length > 30) {
          message.info('职位名称最多30个字符')
          return
        }
        // 后端校验(数美审核敏感词)
        let censor = await this.censorJobQuery()
        if (censor.status !== 1) return
        // 打点
        trackEvent('jobs_pc_talent_position_publish_submit', {
          type: this.state.formType,
        })
        // 提交操作
        let submitRequest =
          this.state.formType == 'edit'
            ? 'positions/updateJob'
            : 'positions/addJob'
        this.props
          .dispatch({
            type: submitRequest,
            payload: {
              infos: JSON.stringify(this.state.params),
              ejid: this.state.ejid,
            },
          })
          .then(async (res) => {
            if (res.ejid) {
              this.setState({
                ejidFinished: res.ejid,
              })
              // 打点
              trackEvent('jobs_pc_talent_position_publish_success', {
                type: this.state.formType,
                jid: res.jid,
              })
              // 可召回人数是否>=100，非招聘个人会员且非企业会员
              const {
                auth,
                currentUser: { mem = {} },
              } = this.props
              // 会员用户开启智能邀约弹窗，非会员用户默认关闭
              if (auth.isPersonalUser || mem.mem_st === 2) {
                this.handleInvitation(0, false)
                const meetLimit = await this.isMeetLimit(res.jid)
                if (meetLimit >= 50) {
                  this.setState({
                    showModal: true,
                  })
                  return
                } else {
                  message.success('发布成功')
                  this.props.history.push('/ent/v2/job/positions')
                }
              } else {
                if (this.state.formType == 'publish') {
                  this.setState({
                    modalVisible: true,
                  })
                  // 弹窗曝光打点
                  trackEvent('jobs_pc_group_invitation', {
                    target_type: 'show',
                    ejid: res.ejid,
                  })
                } else {
                  message.success('发布成功')
                  this.props.history.push('/ent/v2/job/positions')
                }
              }
            } else {
              message.error(res.error_msg)
            }
          })
      }
    })
  }
  // 智能邀约
  handleInvitation = (state, vipState) => {
    this.props
      .dispatch({
        type: 'positions/updateJobAuthStatus',
        payload: {
          ejid: this.state.ejid ? this.state.ejid : this.state.ejidFinished,
          auth_status: state,
        },
      })
      .then((res) => {
        if (res.result === 'ok') {
          // 有效开启和关闭授权打点
          trackEvent('jobs_pc_invite_operate', {
            click_type: state ? 'true' : 'false',
            ejid: this.state.ejid ? this.state.ejid : this.state.ejidFinished,
          })
        }
      })
    if (vipState) this.props.history.push('/ent/v2/job/positions')
    if (vipState && !state) {
      message.success('你已关闭该职位的智能邀约服务')
    }
    // 开启授权和关闭授权打点
    trackEvent('jobs_pc_group_invitation', {
      target_type: 'click',
      click_type: state ? 'true' : 'false',
      ejid: this.state.ejid ? this.state.ejid : this.state.ejidFinished,
    })
  }
  getPayBannersData = (state, vipState) => {
    this.props
      .dispatch({
        type: 'positions/getPayBanners',
        payload: {
          ejid: this.state.ejid ? this.state.ejid : this.state.ejidFinished,
          auth_status: state,
          fr: 'recruiter_ai_exposure_pc_v2',
        },
      })
      .then((res) => {
        if (res.result === 'ok') {
          // 有效开启和关闭授权打点
          this.setState({
            payBannersData: res,
          })
        }
      })
  }
  onModalCancel = () => {
    this.setState({
      showModal: false,
    })
    this.props.history.push('/ent/v2/job/positions')
  }
  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
    })
    // 弹窗关闭打点
    trackEvent('jobs_pc_invite_operate', {
      click_type: 'closeMask',
      ejid: this.state.ejid ? this.state.ejid : this.state.ejidFinished,
    })
    this.props.history.push('/ent/v2/job/positions')
  }
  changeParams = (data) => {
    this.setState({
      params: Object.assign({}, this.state.params, data),
    })
    if (data.profession_new !== undefined) {
      // 获取行业方向
      this.props.dispatch({
        type: 'positions/fetchMajor',
        payload: {
          pfs: data.profession_new,
        },
      })
      // 没有人才方向时清空选项options
      if (!data.major_new_lv2) {
        this.props.dispatch({
          type: 'positions/setData',
          payload: {
            majorLv2List: [],
          },
        })
      }
    }
    if (data.major_new_lv2) {
      this.setState({
        params: Object.assign({}, this.state.params, {
          major_new: data.major_new_lv2,
        }),
      })
    }
    if (data.major_new !== undefined) {
      // 获取人才方向
      this.props
        .dispatch({
          type: 'positions/fetchMajorNewLv2',
          payload: {
            major_code: data.major_new,
          },
        })
        .then(() => {
          this.props.form.setFieldsValue({
            major_new_lv2: data.major_name_lv2 || undefined,
          })
        })
    }
  }

  renderFormItem = (item) => {
    let { id, component } = item
    const { params = {}, formType } = this.state
    const Component =
      {
        company: Company,
        position: Position,
        profession_new: Profession,
        select: CommonSelect,
        input: CommonInput,
        work_time_degree: WorkTimeDegree,
        salary: Salary,
        address: Address,
        description: Description,
      }[component || id] || CommonInput

    const options = {
      major_new: this.props.majorList,
      major_new_lv2: this.props.majorLv2List || [],
    }
    if (
      id === 'major_new_lv2' &&
      !options[id].length &&
      !this.state.params.major_name_lv2
    ) {
      return null
    }
    return (
      <div className={styles.formItem}>
        <Component
          {...item}
          options={options[id]}
          defaultValue={params[id]}
          form={this.props.form}
          onChange={this.changeParams}
          params={params}
          formType={formType}
        />
      </div>
    )
  }

  render() {
    const { constData } = this.props
    const {
      card1Options,
      card2Options,
      preChecked,
      preCheckErr,
      showModal,
      modalVisible,
      payBannersData,
    } = this.state
    const formItemLayout = {
      labelCol: {
        // span: 4,
        style: {
          width: 85,
        },
      },
      wrapperCol: {
        span: 20,
      },
    }
    const isV2 = window.location.href.indexOf('v2') !== -1

    return (
      <ConfigProvider
        getPopupContainer={(node) => {
          if (node) {
            return node.parentNode
          }
          return document.body
        }}
      >
        <div
          key="publishJob"
          className={
            isV2
              ? `${styles.publishJobPage}`
              : `${styles.publishJobPage} ${styles.main}`
          }
        >
          {preChecked ? (
            <Form
              onSubmit={this.handleSubmit}
              className={styles.form}
              labelAlign="right"
              {...formItemLayout}
            >
              {/* Part 1 */}
              <div className={styles.part1}>
                <div className={`${styles.partTitle}`}>
                  <img
                    className={styles.partTitleImg}
                    src="https://i9.taou.com/maimai/p/23302/9119_53_21wRRjYyyBI4bmdL"
                  />
                  <span>职位基本信息</span>
                </div>
                {card1Options.map((item) => this.renderFormItem(item))}
              </div>
              {/* Part 2 */}
              <div>
                <div className={`${styles.partTitle}`}>
                  <img
                    className={styles.partTitleImg}
                    src="https://i9.taou.com/maimai/p/23302/9120_53_31sjyqKzx0zAA3rN"
                  />
                  <span>职位要求</span>
                </div>
                {constData.work_times &&
                  card2Options.map((item) => this.renderFormItem(item))}
              </div>
              <div className={styles.bottom}>
                <Button
                  type="button_m_fixed_blue450"
                  onClick={this.handleSubmit}
                >
                  发布
                </Button>
              </div>
            </Form>
          ) : (
            <PreCheckErr data={preCheckErr} />
          )}
          {showModal ? (
            <BuyVipModalV2
              onCancel={this.onModalCancel}
              payBannersData={payBannersData}
              fr="recruiter_ai_exposure_pc_v2"
            />
          ) : null}
        </div>
        <Modal
          className={styles.publishSuccess}
          visible={modalVisible}
          onCancel={this.handleModalCancel}
          footer={null}
          centered={true}
          width={400}
        >
          <div className={styles.iconStyle}>
            <img src="https://i9.taou.com/maimai/p/24250/2593_53_610YNeiqHtRCRNBZ" />
          </div>
          <div className={styles.modalFont}>
            <span className={styles.topFont}>
              发布成功！已为你开启会员专属智能邀约
            </span>
            <span className={styles.bottomFont}>
              系统将自动邀约有意向的候选人，招聘效果提5-10倍
            </span>
          </div>
          <div className={styles.modalFoot}>
            <Button
              className={styles.buttonNot}
              onClick={() => this.handleInvitation(0, true)}
            >
              暂不需要
            </Button>
            <Button
              className={styles.buttonOk}
              type="primary"
              onClick={() => this.handleInvitation(1, true)}
            >
              我知道了
            </Button>
          </div>
        </Modal>
      </ConfigProvider>
    )
  }
}
