import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Icon } from 'mm-ent-ui'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Select, Checkbox, message, Modal } from 'antd'
import * as styles from './index.less'
const { Option } = Select
const { confirm } = Modal

export interface Props {
  id: string
  optType: string
  label: string
  reg: object
  needEmptyEjid: boolean
  regMsg: object
  defaultValue: string
  formType: string
  params: object
}

@connect((state) => ({
  jobs: state.global.jobs,
}))
export default class Company extends React.Component<Props> {
  state = {
    options: [],
    hunter_job: false,
  }

  componentDidMount() {
    this.getHunberJobStatus(this.props.params.company)
  }

  curSugTs = 0

  getSug = (v) => {
    let startTs = new Date() * 1

    return this.props
      .dispatch({
        type: 'positions/fetchSug',
        payload: { type: 8, chars: v },
      })
      .then((res) => {
        if (this.curSugTs <= startTs) {
          this.curSugTs = startTs
          if (res.result == 'ok' && res.data && res.data.length > 0) {
            this.setState({
              options: res.data,
            })
          }
        }
      })
  }

  // 获取是否是猎头职位
  getHunberJobStatus = (company) => {
    if (!company || !this.props.params.is_hunter) return
    return this.props
      .dispatch({
        type: 'positions/fetchIsHunterJob',
        payload: { company },
      })
      .then((res) => {
        this.setState({ hunter_job: res.hunter_job })
        if (!res.hunter_job) {
          this.props.onChange({ is_public: 1 })
        }
      })
  }

  applyToBeHunter = () => {
    confirm({
      title: '申请成为猎头',
      content:
        '猎头身份可以填写非当前就职公司名称。\n请如实申请，以免影响职位审核和招聘效果。',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        this.props
          .dispatch({
            type: 'positions/hunterApply',
            payload: {
              set_not_hunter: 0,
            },
          })
          .then((res) => {
            if (res.result == 'ok') {
              message.success('申请成功')
              this.props.onChange({ is_hunter: true })
              this.getHunberJobStatus(this.props.params.company)
            } else {
              message.error('操作失败，请再次尝试')
            }
          })
          .catch(() => {
            message.error('操作失败，请再次尝试')
          })
      },
    })
  }

  handleSearch = (v) => {
    if (v) {
      this.getSug(v)
    } else {
      this.setState({ options: [] })
    }
  }

  onChange = (v) => {
    this.props.onChange({ company: v })
    this.getHunberJobStatus(v)
  }

  onPublicChange = async (e) => {
    if (!e.target.checked) {
      await this.getHunberJobStatus(this.props.params.company)
      if (!this.state.hunter_job) {
        message.info('公司名称与你当前所在公司一致，公司名称将被默认公开')
        return
      }
    }
    this.props.onChange({ is_public: e.target.checked ? 1 : 0 })
  }

  renderOption(sug, index) {
    let { id, data, thumbnail } = sug
    return (
      <Option
        className={styles.companySug}
        key={index}
        value={data}
        label={data}
      >
        <img style={{ width: 24, height: 24 }} src={thumbnail} />
        {data}
      </Option>
    )
  }

  validateNotEmoji = (rule, value, callback) => {
    const { reg } = this.props
    if (reg.test(value)) {
      callback('请勿输入emoji表情')
    } else {
      callback()
    }
  }

  render() {
    const {
      id,
      optType,
      label,
      reg,
      needEmptyEjid,
      regMsg,
      defaultValue,
      formType,
      params: { is_hunter, is_public },
    } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div
        className={styles.companyWrap}
        style={{ height: is_hunter ? 104 : 65 }}
      >
        <Form.Item label={label}>
          {getFieldDecorator(id, {
            initialValue: defaultValue,
            rules: [
              { required: true, message: `请输入${label}` },
              {
                validator: this.validateNotEmoji,
              },
            ],
          })(
            <Select
              showSearch
              disabled={!is_hunter || formType == 'edit'}
              optionLabelProp="label"
              placeholder={optType}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearch}
              onChange={this.onChange}
              notFoundContent={null}
            >
              {this.state.options.map(this.renderOption)}
            </Select>
          )}
        </Form.Item>
        {!is_hunter ? (
          <div className={styles.hunter}>
            公司名称与当前就职公司保持一致，猎头请点击
            <span className={styles.applyHunter} onClick={this.applyToBeHunter}>
              我是猎头
            </span>
          </div>
        ) : null}
        {is_hunter ? (
          <div className={styles.publicCompany}>
            <Checkbox checked={!!is_public} onChange={this.onPublicChange}>
              允许公开公司名
            </Checkbox>
            <p>
              请如实填写招聘公司名称，以免影响职位审核；
              <br />
              如果关闭此功能，公司名称将对外展示为“某公司”。
            </p>
          </div>
        ) : null}
      </div>
    )
  }
}
