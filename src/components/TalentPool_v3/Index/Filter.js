import React from 'react'
import { connect } from 'react-redux'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Checkbox, Popover, Row, Col, Select, message, Cascader } from 'antd'
import { ModalFooter, Loading } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import PositionsSelection from 'components/Common/PositionSelection'
import { showMosaic } from 'utils/account'
import { MUNICIPALITY, DEGREE_OPTIONS } from 'constants'
import * as R from 'ramda'
import UpgradeMemberTip from './Dashboard/UpgradeMemberTip'
import styles from './filter.less'

@connect((state) => ({
  navigatorLoading: state.loading.effects['talentPool/fetchNavigator'],
  currentUser: state.global.currentUser,
  navigator: state.talentPool.navigator,
  config: state.global.config,
  dictionary: state.global.dictionary,
}))
@Form.create()
export default class Filter extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
  }

  state = {}

  componentDidMount() {
    if (!this.props.navigator.length) {
      this.fetchData()
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.show && newProps.show !== this.props.show) {
      newProps.form.setFieldsValue({
        talent_sources: newProps.value.talent_sources,
        positions: newProps.value.positions,
        city: newProps.value.city,
        work_times: newProps.value.work_times,
        degree: newProps.value.degree,
      })
    }
  }

  getOptions = (values) => {
    return values.map((item) => (
      <Select.Option
        value={item.value === 0 ? item.value : item.value || item.name}
        key={item.value || item.name}
      >
        {item.label || item.name}
      </Select.Option>
    ))
  }

  getCityOptions = () => {
    const { loc = [] } = this.props.dictionary

    const getCityOption = () => ({ city }) => ({
      value: city,
      label: city,
    })

    return [
      ...loc.map(({ province, cities = [] }) => ({
        value: province,
        label: province,
        children: MUNICIPALITY.includes(province)
          ? [
              {
                value: province,
                label: province,
              },
            ]
          : [
              {
                value: '全部',
                label: '全部',
              },
              ...cities.map(getCityOption(province)),
            ],
      })),
    ]
  }

  handleSubmit = (e) => {
    const { currentUser } = this.props
    const needFetch = !showMosaic(currentUser)
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onChange(values, needFetch)
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSetDomWrapper = (contentWrapper) => {
    this.setState({
      contentWrapper,
    })
  }

  handleGroupsClick = () => {
    const { currentUser } = this.props
    const justShowFifty = showMosaic(currentUser)

    if (justShowFifty) {
      message.warning('需要开通高级会员，才可使用筛选功能~')
    }
  }

  fetchData = () => {
    this.props.dispatch({
      type: 'talentPool/fetchNavigator',
      payload: {
        navigator_type: 2,
      },
    })
  }

  handleInputReadOnly = (name) => {
    document
      .getElementsByClassName(name)[0]
      .getElementsByClassName('ant-select-search__field')[0]
      .setAttribute('readOnly', 'readOnly')
  }

  renderPisitionSlection = () => {
    const { form, currentUser } = this.props
    const { getFieldDecorator } = form
    const justShowFifty = showMosaic(currentUser)

    return (
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item label="职位技能:" className={styles.position}>
            {getFieldDecorator('positions', {
              defaultValue: this.props.value.positions,
            })(
              <PositionsSelection
                wrapperDom={this.state.contentWrapper}
                disabled={justShowFifty}
              />
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="地区:" className={styles.position}>
            {getFieldDecorator('city', {
              defaultValue: this.props.value.city,
            })(
              <Cascader
                placeholder="请选择城市地区"
                options={this.getCityOptions()}
                className={styles.select}
                expandTrigger="hover"
                getPopupContainer={() =>
                  this.state.contentWrapper || document.body
                }
                disabled={justShowFifty}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
    )
  }

  renderWorkSelection = () => {
    const { form, currentUser } = this.props
    const { getFieldDecorator } = form
    const justShowFifty = showMosaic(currentUser)

    return (
      <Form.Item label="工作年限:" className={styles.position}>
        {getFieldDecorator('work_times', {
          defaultValue: this.props.value.work_times,
        })(
          <Select
            placeholder="请选择工作年限"
            className="worktimes"
            getPopupContainer={() => this.state.contentWrapper || document.body}
            notFoundContent=""
            allowClear
            mode="multiple"
            disabled={justShowFifty}
            showArrow
            onFocus={() => this.handleInputReadOnly('worktimes')}
            ref={(node) => {
              this.worktimes = node
            }}
          >
            {this.getOptions(
              R.propOr([], 'talent_lib_worktimes', this.props.config).map(
                (v) => ({
                  ...v,
                  value: `${v.value}`,
                })
              )
            )}
          </Select>
        )}
      </Form.Item>
    )
  }

  renderEducationSelection = () => {
    const { form, currentUser } = this.props
    const { getFieldDecorator } = form
    const justShowFifty = showMosaic(currentUser)

    return (
      <Form.Item label="学历:" className={styles.position}>
        {getFieldDecorator('degree', {
          defaultValue: this.props.value.degree,
        })(
          <Select
            placeholder="请选择学历"
            className="degree"
            getPopupContainer={() => this.state.contentWrapper || document.body}
            notFoundContent=""
            allowClear
            mode="multiple"
            disabled={justShowFifty}
            showArrow
            onFocus={() => this.handleInputReadOnly('degree')}
          >
            {this.getOptions(DEGREE_OPTIONS)}
          </Select>
        )}
      </Form.Item>
    )
  }

  renderWorkEduSlection = () => {
    return (
      <Row gutter={20}>
        <Col span={12}>{this.renderWorkSelection()}</Col>
        <Col span={12}>{this.renderEducationSelection()}</Col>
      </Row>
    )
  }

  renderGroupsSelection = () => {
    const { form, currentUser } = this.props
    const { getFieldDecorator } = form
    const justShowFifty = showMosaic(currentUser)

    const Groups = (props) => {
      return this.renderGroups(props, justShowFifty)
    }
    return (
      <Form.Item label="按分组:">
        {getFieldDecorator('talent_sources', {
          defaultValue: this.props.value.talent_sources,
        })(<Groups />)}
      </Form.Item>
    )
  }

  renderGroups = (props, disabled = false) => {
    if (this.props.navigatorLoading) {
      return <Loading />
    }
    const { navigator } = this.props
    const navShow = R.sortBy(
      R.prop('sequence'),
      navigator.filter((i) => !!i.sequence)
    )
    const onChange = (values) => {
      props.onChange(values)
    }

    const renderOptions = (options) => {
      return options.map((op) => (
        <Checkbox
          value={op.post_param}
          key={op.title}
          className="flex"
          disabled={op.action_code === 1 || disabled}
        >
          <Popover content={op.title} className="ellipsis">
            {op.title}
          </Popover>
          ({op.action_code === 1 ? '待开通' : op.total})
        </Checkbox>
      ))
    }
    const renderFacet = (facet) => {
      return (
        <div className={styles.facet} key={facet.title}>
          <h5 className="font-size-14 font-weight-stress font-weight-bold">
            {facet.title}
          </h5>
          {renderOptions(facet.options)}
        </div>
      )
    }
    const renderColumns = () => {
      const columnNum = 4
      const res = []
      for (let index = 1; index <= columnNum; index++) {
        const i = index === columnNum ? 0 : index
        res.push(
          <div className={styles.column} key={i}>
            {navShow.filter((nav) => nav.sequence % 4 === i).map(renderFacet)}
          </div>
        )
      }
      return res
    }
    return (
      <Checkbox.Group onChange={onChange} value={props.value}>
        <div className={styles.groups} onClick={this.handleGroupsClick}>
          {renderColumns()}
        </div>
      </Checkbox.Group>
    )
  }

  render() {
    const { currentUser } = this.props
    const justShowFifty = showMosaic(currentUser)

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
        style: {
          width: 70,
        },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }

    return (
      <Form
        onSubmit={this.handleSubmit}
        className={styles.main}
        labelAlign="right"
        {...formItemLayout}
      >
        <div className={styles.content} ref={this.handleSetDomWrapper}>
          {justShowFifty && (
            <UpgradeMemberTip hasAngle={false} className="margin-bottom-24" />
          )}
          {this.renderPisitionSlection()}
          {this.renderWorkEduSlection()}
          {this.renderGroupsSelection()}
        </div>
        <ModalFooter
          okText="确定"
          cancelText="重置"
          onOk={this.handleSubmit}
          onCancel={this.handleReset}
          className={styles.footer}
          okButtonProps={{
            roundCorner: true,
          }}
          cancelButtonProps={{
            roundCorner: true,
            disabled: justShowFifty,
          }}
        />
      </Form>
    )
  }
}
