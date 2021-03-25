import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { InputNumber, Button } from 'antd'
import { Modal, Message as message } from 'mm-ent-ui'

import * as styles from './index.less'

export interface Props {
  assetLoading: boolean
  recordLoading: boolean
  currentUser: object
}

export interface State {
  balance: number
  code: number
  msg: string
  addfr: number
  uh: number
  direct_oppo: number
  exchange: object
  price: object
  reachNum: number
}

const rightLabelMap = {
  uh: '极速联系',
  direct_oppo: '立即沟通',
  fr: '加好友',
  exposure: '极速曝光',
}

@connect((state) => ({
  assetLoading: state.loading.effects['personalAsset/fetch'],
  recordLoading: state.loading.effects['personalAsset/fetchDealRecord'],
  currentUser: state.global.currentUser,
}))
export default class Personal extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      balance: 0,
      code: 0,
      msg: '',
      // records: [],
      // recordRemain: false,
      // recordPage: 0,
      addfr: 0,
      uh: 0,
      direct_oppo: 0,
      exchange: {
        fr: '',
        uh: '',
        direct_oppo: '',
      },
      price: {},
      reachNum: 0,
    }
  }

  componentDidMount() {
    this.fetchAsset()
    // this.refreshRecord()
  }

  fetchAsset = () => {
    this.props
      .dispatch({
        type: 'personalAsset/fetch',
      })
      .then(({ data }) => {
        this.setState({
          balance: data.balance,
          code: data.code,
          msg: data.msg,
          addfr: data.addfr || 0,
          uh: data.uh || 0,
          direct_oppo: data.direct_oppo || 0,
          exposure: data.exposure || 0,
          price: data.price,
          reachNum: data.reach,
        })
      })
  }

  fetchCurrentUser = () => {
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })
  }

  loadMoreRecord = () => {
    this.setState(
      {
        recordPage: this.state.recordPage + 1,
      },
      () => {
        this.loadRecord().then((/* {data} */) => {
          this.setState({
            // records: [...this.state.records, ...data.records],
            // recordRemain: !!data.remain,
          })
        })
      }
    )
  }

  refreshRecord = () =>
    this.setState(
      {
        recordPage: 0,
      },
      () => {
        this.loadRecord().then((/* {data} */) => {
          this.setState({
            // records: data.records,
            // recordRemain: !!data.remain,
          })
        })
      }
    )

  loadRecord = () =>
    this.props.dispatch({
      type: 'personalAsset/fetchDealRecord',
      payload: {
        page: this.state.recordPage,
      },
    })

  submitExchange = (type, count) => {
    return this.props.dispatch({
      type: 'personalAsset/exchange',
      payload: {
        count,
        exchange_type: type,
      },
    })
  }

  handleExchange = (type) => () => {
    const value = this.state.exchange[type] || 0
    if (!value) {
      message.error('数据不能为空')
      return
    }
    this.submitExchange(type, parseInt(value, 10)).then(() => {
      message.success('兑换权益成功')
      this.setState({
        exchange: {
          ...this.state.exchange,
          [type]: '',
        },
      })
      this.fetchAsset()
      this.fetchCurrentUser()
    })
  }

  handleChangeNum = (type) => (value) => {
    this.setState({
      exchange: {
        ...this.state.exchange,
        [type]: value ? parseInt(value, 10) : '',
      },
    })
  }

  handleRecycle = (item = {}) => () => {
    const { balance, type } = item
    Modal.confirm({
      title: `确认退还${R.propOr('', type, rightLabelMap)}权益: ${balance}次？`,
      content: (
        <div className="margin-top-32">
          <p className="font-size-16 color-stress font-weight-bold text-center">
            退还后会将对应的点数返还到你的企业账号里
          </p>
          <p className="font-size-16 color-stress font-weight-bold text-center">
            你可以用于兑换其他权益
          </p>
        </div>
      ),
      onOk: () => {
        return this.props
          .dispatch({
            type: 'rights/recycle',
            payload: {
              count: balance,
              recycle_type: type,
            },
          })
          .then((res) => {
            if (res.code === 0) {
              message.success('退还成功')
              this.fetchAsset()
              this.fetchCurrentUser()
            } else {
              message.error(res.msg || '退还失败')
            }
          })
      },
      className: styles.confirmRecycleModal,
      maskClosable: true,
    })
  }

  renderExchangeItem = (item) => {
    const { title, balance, type, price } = item
    return (
      <div className={styles.item} key={type}>
        <h5 className={styles.title}>兑换{title}权益</h5>
        <p className={styles.balance}>
          剩余<span className="color-orange">{balance}</span>次
          {balance > 0 && (
            <Button
              className="like-link-button margin-left-8 font-size-14"
              onClick={this.handleRecycle(item)}
            >
              退还权益
            </Button>
          )}
        </p>
        <InputNumber
          placeholder={`兑换${title}权益个数`}
          onChange={this.handleChangeNum(type)}
          width={150}
          value={this.state.exchange[type]}
          type="number"
          className={styles.input}
          min={0}
          size="large"
        />
        <p className={styles.footer}>
          <span
            className="font-size-14 color-dilution"
            style={{ lineHeight: '32px' }}
          >
            {price > 0 && '每个权益将消耗'}
            {price > 0 && (
              <span className="color-orange font-weight-bold">{price}点</span>
            )}
          </span>
          <Button onClick={this.handleExchange(type)} className={styles.button}>
            提交
          </Button>
        </p>
      </div>
    )
  }

  renderExchange = () => {
    const { addfr, uh, direct_oppo, exposure, price } = this.state
    // const canExchange = R.pathOr(
    //   false,
    //   ['currentUser', 'license', 'can_exchange'],
    //   this.props
    // )
    const fieldsConfig = {
      addfr: {
        title: '加好友',
        balance: addfr,
        type: 'fr',
        price: R.propOr(0, 'addfr_price', price),
      },
      uh: {
        title: '极速联系',
        balance: uh,
        type: 'uh',
        price: R.propOr(0, 'uh_price', price),
      },
      direct_oppo: {
        title: '立即沟通',
        balance: direct_oppo,
        type: 'direct_oppo',
        price: R.propOr(0, 'direct_oppo_price', price),
      },
      exposure: {
        title: '极速曝光',
        balance: exposure,
        type: 'exposure',
        price: R.propOr(0, 'exposure_price', price),
      },
    }

    // const showFields = canExchange ? ['addfr', 'uh', 'exposure'] : ['exposure']
    // 部分账号保留极速曝光
    const showExposureCoIds = [639]
    const showExposure = showExposureCoIds.includes(
      R.path(['license', 'b_mbr_co_id'], this.props.currentUser)
    )
      ? ['exposure']
      : []
    const showFields =
      R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6
        ? ['addfr', ...showExposure]
        : ['addfr', 'uh', ...showExposure]
    return showFields.map((field) =>
      this.renderExchangeItem(fieldsConfig[field])
    )
    // return (
    //   <div className={styles.rightExchange}>
    //     {!!canExchange && (
    //       <div className={styles.item}>
    //         <h5 className={styles.title}>兑换加好友权益</h5>
    //         <p className={styles.balance}>
    //           剩余加好友<span className="color-orange">{addfr}</span>次
    //         </p>
    //         <p className={styles.input}>
    //           <InputNumber
    //             placeholder="兑换个数"
    //             onChange={this.handleChangeNum('fr')}
    //             width={150}
    //             className={styles.input}
    //             value={this.state.exchange.fr}
    //             type="number"
    //             min={0}
    //           />
    //         </p>
    //         <p className="footer">
    //           <Button
    //             onClick={this.handleExchange('fr')}
    //             className={styles.button}
    //           >
    //             提交
    //           </Button>
    //         </p>
    //       </div>
    //     )}
    //     {!!canExchange && (
    //       <div className={styles.item}>
    //         <h5 className={styles.title}>兑换极速联系权益</h5>
    //         <p className={styles.balance}>
    //           剩余极速联系<span className="color-orange">{uh}</span>次
    //         </p>
    //         <p className={styles.input}>
    //           <span>
    //             兑换「极速联系」权益
    //             <InputNumber
    //               placeholder="兑换个数"
    //               onChange={this.handleChangeNum('uh')}
    //               width={150}
    //               className={styles.input}
    //               value={this.state.exchange.uh}
    //               type="number"
    //               min={0}
    //             />
    //             个
    //           </span>
    //           <Button
    //             onClick={this.handleExchange('uh')}
    //             className={styles.button}
    //           >
    //             提交
    //           </Button>
    //         </p>
    //         <p />
    //       </div>
    //     )}
    //     <div className={styles.item}>
    //       <span className={styles.rightBalance}>
    //         「极速曝光」余量：{exposure}
    //       </span>
    //       <span className={styles.inputContiner}>
    //         <span>
    //           兑换「极速曝光」权益
    //           <InputNumber
    //             placeholder="兑换个数"
    //             onChange={this.handleChangeNum('exposure')}
    //             width={150}
    //             className={styles.input}
    //             value={this.state.exchange.exposure}
    //             type="number"
    //             min={0}
    //           />
    //           个
    //         </span>
    //         <Button
    //           onClick={this.handleExchange('exposure')}
    //           className={styles.button}
    //         >
    //           提交
    //         </Button>
    //       </span>
    //     </div>
    //   </div>
    // )
  }

  render() {
    const {
      currentUser: { reach },
    } = this.props
    const { balance, code, msg, reachNum /* , records */ } = this.state
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <span className="font-weight-common color-dilution font-size-20">
            资产余额：{' '}
          </span>
          <span className="font-weight-bold color-orange font-size-20">
            {balance}
          </span>
          {code !== 0 && msg ? (
            <span className={styles.tip}>({msg})</span>
          ) : (
            <span className={styles.tip}>可兑换脉脉APP内权益</span>
          )}
          {reach && reach.reach_type === 3 && (
            <span className={styles.reachNum}>
              电话沟通券：剩余{reachNum}个
            </span>
          )}
        </div>
        {/* <DealRecord
          onLoadMore={this.loadMoreRecord}
          hasMore={this.state.recordRemain}
          data={records}
          loading={this.state.recordLoading}
        /> */}
        <div className={styles.content}>{this.renderExchange()}</div>
      </div>
    )
  }
}
