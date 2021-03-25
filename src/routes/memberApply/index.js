import React, { PureComponent, Fragment } from 'react'
import { findDOMNode } from 'react-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { message, Card, Radio, Input, Button, Modal, Select, Table } from 'antd'

import * as styles from './index.less'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const SelectOption = Select.Option
const { Search, TextArea } = Input

const memIds = [6, 100, 101, 102, 103, 104, 105, 106, 107]
const memNames = {
  6: '老版额度会员',
  100: '老版叠加包',
  101: '新版点数会员',
  102: '新版叠加包',
  103: '人才邀约',
  104: '企业号',
  105: '职言订阅',
  106: 'API对接',
  107: '雇主品牌',
}

const memCnt = {
  6: 12,
  100: 1,
  101: 12,
  102: 1,
  103: 12,
  104: 12,
  105: 12,
  106: 1,
  107: 1,
}

const statusMap = {
  1: '新申请',
  2: '已开通',
  3: '已入帐',
}

@connect(({ memberApply, loading }) => ({
  memberApply,
  loading: loading.models.memberApply,
}))
@Form.create()
class MemberApply extends PureComponent {
  state = {
    visible: false,
    done: false,
    selectedRows: [],
    data: {},
    pagination: { current: 1, pageSize: 20 },
    keyword: '',
    is_open: '',
    status: '',
    has_mem_id: '',
  }

  columns = [
    {
      title: '申请人',
      dataIndex: 'apply_uid',
    },
    {
      title: '开通公司',
      dataIndex: 'company',
      width: '10%',
    },
    {
      title: '开通类型',
      dataIndex: 'mem_id',
      width: '10%',
      render: (val, record) => (
        <Select
          onChange={(value) => this.handleMemIdChange(value, record)}
          placeholder="请选择"
          defaultValue={val}
          style={{ width: '200px' }}
        >
          <Option value={0}>请选择类型（自动保存）</Option>
          {memIds.map((i) => (
            <Option value={i}>
              [{memCnt[i]}个月]{memNames[i]}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '公司管理员',
      dataIndex: 'corp_uid',
      width: '10%',
      render: (val, record) => (
        <div>
          <p>{val}</p>
          <p>
            {record['corp_user']['realname']}-{record['corp_user']['company']}-
            {record['corp_user']['position']}
          </p>
        </div>
      ),
    },
    {
      title: '金额',
      dataIndex: 'cost',
      width: '5%',
    },
    {
      title: '开通内容',
      dataIndex: 'content',
      width: '10%',
      // render: (val, record) => (
      //     <div>
      //         <TextArea rows={6} value={val} onBlur={(val) => this.saveContent(val, record.id)} />
      //     </div>
      // ),
    },
    {
      title: '开通明细/结果',
      dataIndex: 'member_open',
      render: (val, record) =>
        record.member_open && (
          <div>
            <p>{record.member_open}</p>
            <p>{record.member_open_Result}</p>
          </div>
        ),
    },
    {
      title: '权益包明细/结果',
      dataIndex: 'equity_package_open',
      render: (val, record) =>
        record.equity_package_open && (
          <div>
            <p>{record.equity_package_open}</p>
            <p>{record.equity_package_open_Result}</p>
          </div>
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val, record) => (
        <div>
          <p>开通状态：{record['is_open'] == 1 ? '已开通' : '待开通'}</p>
          <p>到账状态：{statusMap[val] || '未知'}</p>
          <p>申请时间：{record.apply_crtime}</p>
          <p>开通时间：{record.open_crtime}</p>
          <p>入账时间：{record.money_crtime}</p>
        </div>
      ),
    },
    {
      title: '操作',
      width: '5%',
      render: (id, record) => (
        <Fragment>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
        </Fragment>
      ),
    },
  ]

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  }

  componentWillMount() {
    this.refreshData()
  }

  refreshData() {
    const { dispatch } = this.props
    const { pagination } = this.state
    this.setState({ loading: true })
    let payload = { page: pagination.current - 1 }
    if (this.state.keyword !== '') {
      payload.company = this.state.keyword
      payload.member_open = this.state.keyword
    }
    if (this.state.is_open !== '') {
      payload.is_open = this.state.is_open
    }
    if (this.state.status !== '') {
      payload.status = this.state.status
    }
    if (this.state.has_mem_id !== '') {
      payload.has_mem_id = this.state.has_mem_id
    }
    dispatch({
      type: 'memberApply/getMemberApply',
      payload: payload,
    }).then((data) => {
      pagination.total = data.total || 0
      this.setState({ data, loading: false, pagination })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState(
      {
        pagination: pager,
      },
      () => {
        this.refreshData()
      }
    )
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    })
  }

  showEditModal = (item) => {
    this.setState({
      visible: true,
      current: item,
    })
  }

  handleSearch = (keyword) => {
    this.setState(
      {
        keyword,
        pagination: { current: 1, pageSize: 20 },
      },
      () => {
        this.refreshData()
      }
    )
  }

  handleMemIdStatusChange = (e) => {
    const status = e.target.value
    this.setState(
      {
        has_mem_id: status,
        pagination: { current: 1, pageSize: 20 },
      },
      () => {
        this.refreshData()
      }
    )
  }

  handleStatusChange = (e) => {
    const status = e.target.value
    this.setState(
      {
        status,
        pagination: { current: 1, pageSize: 20 },
      },
      () => {
        this.refreshData()
      }
    )
  }

  saveContent = (val, id) => {
    const value = val.target.value
    this.props
      .dispatch({
        type: 'memberApply/updateMemberApply',
        payload: { apply_id: id, content: value },
      })
      .then((res) => {
        message.success('修改成功')
      })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form } = this.props
    const { current, data } = this.state
    const id = current ? current.id : ''
    if (id) {
      form.validateFields((err, fieldsValue) => {
        if (err) return
        this.setState({
          done: true,
        })
        dispatch({
          type: 'memberApply/updateMemberApply',
          payload: {
            apply_id: id,
            ...fieldsValue,
            cnt: memCnt[fieldsValue['mem_id']],
          },
        }).then((res) => {
          this.refreshData()
          this.setState({ visible: false })
          message.success('修改成功')
        })
      })
      return true
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return
      this.setState({
        done: true,
      })
      dispatch({
        type: 'memberApply/addMemberApply',
        payload: { ...fieldsValue, cnt: memCnt[fieldsValue['mem_id']] },
      }).then((res) => {
        this.refreshData()
        this.setState({ visible: false })
        message.success('添加成功')
      })
    })
  }

  handleMemIdChange = (value, current) => {
    const { dispatch } = this.props
    const id = current ? current.id : ''
    const mem_id = value
    dispatch({
      type: 'memberApply/updateMemberApply',
      payload: { apply_id: id, mem_id: mem_id, cnt: memCnt[mem_id] },
    }).then((res) => {
      this.refreshData()
      message.success('修改成功')
    })
  }

  handleDone = () => {
    this.setState({
      done: false,
      visible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props
    const { visible, done, loading, current = {}, data } = this.state

    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem)
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该任务吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        })
      }
    }

    const modalFooter = {
      okText: '保存',
      onOk: this.handleSubmit,
      cancelText: '取消',
      onCancel: this.handleCancel,
    }

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="" onChange={this.handleStatusChange}>
          <RadioButton value="">全部</RadioButton>
          <RadioButton value={1}>新申请</RadioButton>
          <RadioButton value={2}>已开通</RadioButton>
          <RadioButton value={3}>已入账</RadioButton>
        </RadioGroup>
        {/* <RadioGroup style={{marginLeft: '10px'}} defaultValue="" onChange={this.handleMemIdStatusChange}>
                    <RadioButton value="">全部</RadioButton>
                    <RadioButton value={0}>未分配类型</RadioButton>
                    <RadioButton value={1}>已分配类型</RadioButton>
                </RadioGroup> */}
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入公司名称或者开通手机号"
          onSearch={this.handleSearch}
        />
      </div>
    )

    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="开通类型" {...this.formLayout}>
            {getFieldDecorator('mem_id', {
              rules: [{ required: true, message: '请选择开通类型' }],
              initialValue: current.mem_id,
            })(
              <Select placeholder="请选择">
                <Option value={0}>请选择类型</Option>
                {memIds.map((i) => (
                  <Option value={i}>
                    [{memCnt[i]}个月]{memNames[i]}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="开通企业" {...this.formLayout}>
            {getFieldDecorator('company', {
              rules: [{ required: true, message: '请填写开通企业名称' }],
              initialValue: current.company,
            })(<Input placeholder="" />)}
          </FormItem>
          <FormItem label="企业接口人UID" {...this.formLayout}>
            {getFieldDecorator('corp_uid', {
              rules: [{ required: true, message: '请填写企业接口人uid' }],
              initialValue: current.corp_uid,
            })(<Input placeholder="" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="开通说明">
            {getFieldDecorator('content', {
              rules: [{ message: '请输入说明', min: 5 }],
              initialValue: current.content,
            })(<TextArea rows={4} placeholder="请输入对业务的简要描述" />)}
          </FormItem>
          {/* {!current.id && <FormItem {...this.formLayout} label="开通明细">
                        {getFieldDecorator('member_open', {
                            rules: [{ message: '请输入开通明细', min: 5 }],
                            initialValue: current.subDescription,
                        })(
                            <div>
                                <TextArea rows={4} placeholder="" />
                                <span>格式： 手机号+空格+6+空格+1</span>
                            </div>
                        )}
                    </FormItem>} */}
          {/* {!current.id && <FormItem {...this.formLayout} label="额外权益包开通明细">
                        {getFieldDecorator('equity_package_open', {
                            rules: [{ message: '请输入权益包开通明细', min: 5 }],
                            initialValue: current.equity_package_open,
                        })(
                            <div>
                                <TextArea rows={4} placeholder="" />
                                <span>格式： 手机号+空格+份数</span>
                                <p>单份权益：加好友名额(1000个)+极速联系券(128个)+职位极速曝光(20次)+索要简历邀请(600次)+可绑定人数(1个)</p>
                            </div>
                        )}
                    </FormItem>} */}
          <FormItem label="订单金额" {...this.formLayout}>
            {getFieldDecorator('cost', {
              rules: [{ required: true, message: '请填写订单金额' }],
              initialValue: current.cost,
            })(<Input placeholder="" />)}
          </FormItem>
          {/* {!current.id && <FormItem label="状态" {...this.formLayout}>
                        {getFieldDecorator('status', {
                            rules: [{ required: true, message: '请选择状态' }],
                            initialValue: current.status,
                        })(
                            <Select placeholder="请选择">
                                <SelectOption value={1}>新申请</SelectOption>
                                <SelectOption value={2}>已开通</SelectOption>
                                <SelectOption value={3}>已入账</SelectOption>
                            </Select>
                        )}
                    </FormItem>} */}
        </Form>
      )
    }
    return (
      <div className={styles.standardList}>
        <Card
          className={styles.listCard}
          bordered={false}
          title="企业会员开通记录"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
          extra={extraContent}
        >
          {/* <Button
                        type="dashed"
                        style={{ width: '100%', marginBottom: 8 }}
                        icon="plus"
                        onClick={this.showModal}
                        ref={component => {
                            this.addBtn = findDOMNode(component);
                        }}>
                        添加
                    </Button> */}
          <Table
            size="default"
            rowKey={'id'}
            loading={loading}
            dataSource={data && data.list}
            columns={this.columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
        </Card>
        <Modal
          title={done ? null : `${current.id ? '编辑会员' : '添加会员'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </div>
    )
  }
}

export default MemberApply
