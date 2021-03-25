/* eslint-disable max-lines */
import React, { PureComponent } from 'react'
import { Message } from 'mm-ent-ui'
import { injectUnmount } from 'utils'
import * as R from 'ramda'
import moment from 'moment'
import { connect } from 'react-redux'
import { DEFAULT_POSITION_OPTIONS } from 'constants'
import SpreadHeader from './publishPage/SpreadHeader'
import SpreadPeople from './publishPage/SpreadPeople'
import SpreadTarget from './publishPage/SpreadTarget'
import SpreadContent from './publishPage/SpreadContent'
import SpreadTime from './publishPage/SpreadTime'
import SpreadBtn from './publishPage/SpreadBtn'
import ComfirmModal from './publishPage/ComfirmModal'
import PreviewView from './publishPage/PreviewView'
import styles from './employerSpreadProcessing.less'

@connect((state) => ({
  loading: state.loading.effects,
  currentUser: state.global.currentUser,
  bprofileUser: state.global.bprofileUser,
  urlPrefix: state.global.urlPrefix,
  employerSpreadData: state.company.employerSpreadData,
  preData: state.company.preData,
  config: state.global.config,
  profession: state.global.profession,
  dictionary: state.global.dictionary,
  jobs: state.global.jobs,
  employerBalance: state.company.employerBalance,
}))
@injectUnmount
export default class EmployerSpreadProcessing extends PureComponent {
  state = {
    positionSugs: [],
    companySugs: [],
    loadImg: false,
    imgSrc: '',
    isShowComfirmModal: false,
    isShowPreviewView: false,
    dynamicList: [],
    jobs: null,
    preCountLoading: false,
    defaultValue: {},
  }

  componentDidMount() {
    this.fetchProfession()
    // this.handleGetPreData()
    this.getFeedOptions()
    this.getCompanyPosition()
    this.handlerConsumeNumChange(1)
    this.getEmployerDefaultValue()
    this.handleChangeData({
      promote_type: 8,
      jump_url: '',
      professions: ['01'],
      jid: 0,
      consume_num: 1,
      push_type: 1,
      is_fan: 1,
      fid: 0,
      feed: undefined,
      ...this.getTimes(),
    })
  }

  getFormatOption = (options, valueField, labelField) => {
    return options.map((item) => ({
      value: item[valueField],
      label: item[labelField],
    }))
  }

  getCompanyPosition = () => {
    const param = {
      webcid: R.pathOr('', ['company', 'webcid'], this.props.bprofileUser),
      page: 0,
      count: 100,
    }
    this.props
      .dispatch({
        type: 'company/getCompanyJobListService',
        payload: param,
      })
      .then((data) => {
        if (data.result === 'ok') {
          const jobs = R.pathOr([], ['data', 'normal_data'], data)
          const stickJobs = R.pathOr([], ['data', 'stick_data'], data)

          const allJobs = stickJobs.concat(jobs)

          /* eslint-disable */
          allJobs.map((item) => {
            item.jid = item.id
          })
          this.setState({
            jobs: allJobs,
          })
        }
      })
  }

  getPositionOptions = () => {
    const { positionSugs } = this.state
    return R.isEmpty(positionSugs)
      ? DEFAULT_POSITION_OPTIONS
      : this.getFormatOption(positionSugs.slice(0, 10), 'name', 'name')
  }

  getCompanyOptions = () => {
    const { companySugs } = this.state
    return this.getFormatOption(companySugs.slice(0, 10), 'cid', 'name')
  }

  getEmployerDefaultValue = () => {
    const param = {
      webcid: R.pathOr('', ['company', 'webcid'], this.props.bprofileUser),
    }
    this.props
      .dispatch({
        type: 'company/fetchEmployerDefaulValue',
        payload: param,
      })
      .then((data) => {
        if (data.result === 'ok' && data.data != '') {
          this.setState({
            defaultValue: data.data,
          })
        } else {
          const dataListOne = {
            webcid: '',
            company_name: '',
            company_logo: '',
            score: 32,
            tag_pic: '',
            content: '',
          }
          this.setState({
            defaultValue: dataListOne,
          })
        }
      })
  }
  getFeedOptions = () => {
    const param = {
      sortby: 0,
      tab_id: 1,
      webcid: R.pathOr('', ['company', 'webcid'], this.props.bprofileUser),
      page: 0,
      count: 50,
      query_from: 0,
    }
    this.props
      .dispatch({
        type: 'company/fetchDynamicList',
        payload: param,
      })
      .then((data) => {
        if (data.result === 'ok') {
          this.setState({
            dynamicList: R.path(['feeds'], data),
          })
        }
      })
  }

  fetchProfession = () =>
    this.props.dispatch({ type: 'global/fetchProfession' })

  fetchPositionSugs = (keyword) => {
    this.props
      .dispatch({
        type: 'global/fetchPositionSugs',
        payload: {
          keyword,
        },
      })
      .then(({ data }) => {
        this.setState({
          positionSugs: data || [],
        })
      })
  }

  fetchCompanySugs = (keyword) => {
    this.props
      .dispatch({
        type: 'global/fetchCompanySugs',
        payload: {
          keyword,
        },
      })
      .then(({ data }) => {
        this.setState({
          companySugs: data || [],
        })
      })
  }

  handlePositionOptionsChange = () => (value) => {
    if (this.positionTimer) {
      clearTimeout(this.positionTimer)
    }
    this.positionTimer = setTimeout(() => this.fetchPositionSugs(value), 500)
  }

  handleCompanyOptionsChange = () => (value) => {
    if (this.companyTimer) {
      clearTimeout(this.companyTimer)
    }
    this.companyTimer = setTimeout(() => this.fetchCompanySugs(value), 500)
  }

  handleChangeData = (obj) => {
    const { employerSpreadData } = this.props
    this.props.dispatch({
      type: 'company/setEmployerSpreadData',
      payload: { ...employerSpreadData, ...obj },
    })
  }

  handleTargetChanged = () => (item) => {
    const otherData = {
      positions: undefined,
      provinces: undefined,
      degrees: undefined,
      worktimes: undefined,
      professions: ['01'],
      content: '',
      img_url: '',
      ...this.getTimes(),
    }

    if (Number(item.key) === 8) {
      this.handleChangeData({
        promote_type: Number(item.key),
        jump_url: '',
        jid: 0,
        push_type: 1,
        is_fan: 1,
        fid: 0,
        feed: undefined,
        ...otherData,
      })
    }
    if (Number(item.key) === 5) {
      this.handleChangeData({
        promote_type: Number(item.key),
        jump_url: '',
        jid: 0,
        push_type: 0,
        is_fan: 0,
        fid: 0,
        feed: undefined,
        ...otherData,
      })
    }
    if (Number(item.key) === 6) {
      this.handleChangeData({
        promote_type: Number(item.key),
        jid: 0,
        push_type: 0,
        is_fan: -1,
        fid: 0,
        feed: undefined,
        ...otherData,
      })
    }
    if (Number(item.key) === 7) {
      this.handleChangeData({
        promote_type: Number(item.key),
        jump_url: '',
        push_type: 0,
        is_fan: -1,
        fid: 0,
        feed: undefined,
        ...otherData,
      })
    }

    // 清除数据
    this.clearRecord()
  }

  clearRecord = () => {
    this.setState({
      loadImg: false,
      imgSrc: '',
    })
    this.props.dispatch({
      type: 'company/setData',
      payload: { preData: {} },
    })
  }

  getTimes() {
    const today = new Date()
    const otherData = {
      invite_time: moment(today).format('YYYY-MM-DD HH:mm:ss'),
      invite_end_time: moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
    }
    return otherData
  }

  handleFieldChange = (field) => (value) => {
    this.handleChangeData({ [field]: value, ...this.getTimes() })
    setTimeout(() => {
      this.handleGetPreCount()
    }, 100)
  }

  handleTextAreaChange = () => (e) => {
    this.handleChangeData({ content: e.target.value })
  }

  handleDynamicChange = (value) => {
    const { dynamicList } = this.state
    const dynamic =
      dynamicList.find((item) => String(item.id) === value) || null
    this.handleChangeData({
      fid: value || 0,
      feed: dynamic,
      ...this.getTimes(),
    })
    setTimeout(() => {
      this.handleGetPreCount()
    }, 100)
  }

  onPushStartTimeChange = (value) => {
    if (value) {
      this.handleChangeData({
        invite_time: value.format('YYYY-MM-DD HH:mm:ss'),
      })
    } else {
      this.handleChangeData({ invite_time: null })
    }
  }

  onPushEndTimeChange = (value) => {
    if (value) {
      this.handleChangeData({
        invite_end_time: value.format('YYYY-MM-DD HH:mm:ss'),
      })
    } else {
      this.handleChangeData({ invite_end_time: null })
    }
  }

  handleCancleImg = () => {
    this.setState({
      loadImg: false,
      imgSrc: '',
    })
    this.handleChangeData({ img_url: '' })
  }

  handleUploadImgChange = () => (node) => {
    const [file] = node.files
    const isJpg = file.type === 'image/jpeg'
    if (!isJpg) {
      Message.error('只允许上传jpg文件!')
      return
    }
    const isLt1M = file.size <= 1024 * 1024
    if (!isLt1M) {
      Message.error('超出大小限制!')
      return
    }
    const src = window.URL.createObjectURL(file)
    const fd = new FormData()

    fd.append('fdata', file)
    fd.append('kos', 1)
    fd.append('ftype', 2)
    fd.append('webuid', this.props.bprofileUser.company.webcid)
    this.props
      .dispatch({
        type: 'company/uploadImg',
        payload: fd,
      })
      .then((res) => {
        // eslint-disable-next-line camelcase
        const { file_path = '' } = res
        this.handleChangeData({ img_url: file_path })
      })
    this.setState({
      loadImg: true,
      imgSrc: src,
    })
  }

  handleJumpUrlChange = () => (e) => {
    this.handleChangeData({ jump_url: e.target.value })
  }

  handlePushTypChange = (e) => {
    const { promote_type: promoteType } = this.props.employerSpreadData
    const pustType = e.target.value
    if (
      (promoteType === 5 || promoteType === 6 || promoteType === 7) &&
      pustType === 1
    ) {
      this.handleChangeData({ push_type: e.target.value, is_fan: 0 })
    } else {
      this.handleChangeData({ push_type: e.target.value, is_fan: 1 })
    }
  }

  setPreData(value = 1) {
    const { is_fan: isFan } = this.props.employerSpreadData
    let perConsume = 1000

    if (isFan === -1 || isFan === 0) {
      perConsume = 500
    }
    this.props.dispatch({
      type: 'company/setPreData',
      payload: {
        ...this.props.preData,
        ...{ search_max: `${value * perConsume}+` },
      },
    })
  }

  handlerConsumeNumChange = (value) => {
    if (!value) value = 1
    // if (value < 1) value = 1
    if (value > 0) {
      this.setPreData(value)
    }
    this.handleChangeData({ consume_num: value })
  }

  handleFanChange = (value) => {
    this.handleChangeData({ is_fan: value, consume_num: 1 })
    setTimeout(() => {
      this.handleGetPreCount()
    }, 100)
  }

  handleCheckData = () => {
    const {
      content = '',
      promote_type: promoteType,
      jump_url: jumpUrl,
      invite_end_time: inviteEndTime,
      invite_time: inviteTime,
      consume_num: consumeNum,
      fid = 0,
      jid = 0,
      professions = [],
    } = this.props.employerSpreadData

    if (this.props.erroremployerBalance < 1) {
      this.props.dispatch({
        type: 'entInvite/keepBusiness',
        payload: {
          fr: 'employer_promote',
          uid: window.uid,
        },
      })
      Message.warn('您当前剩余0个曝光币，无法推广！请联系官方销售顾问购买')
      return true
    }

    if (
      (promoteType === 5 || promoteType === 6 || promoteType === 7) &&
      !R.trim(content)
    ) {
      Message.warn('推送内容不能为空')
      return true
    }

    if (promoteType === 7 && jid === 0) {
      Message.warn('职位选择不能为空')
      return true
    }

    if (professions.length === 0) {
      Message.warn('所属行业不能为空')
      return true
    }

    // 消耗券数
    if (consumeNum < 1) {
      Message.warn('期望曝光必须大于1个')
      return true
    }

    if (promoteType === 8 && fid === 0) {
      Message.warn('推广动态不能为空')
      return true
    }

    if (promoteType === 6 && !jumpUrl) {
      Message.warn('活动链接不能为空')
      return true
    }

    // 推广时间
    if (!inviteTime) {
      Message.warn('推广开始时间不能为空')
      return true
    }

    // 推广结束时间
    if (!inviteEndTime) {
      Message.warn('推广结束时间不能为空')
      return true
    }

    if (new Date(inviteEndTime).getTime() < new Date(inviteTime).getTime()) {
      Message.warn('推广结束时间必须大于开始时间')
      return true
    }
    return false
  }

  handleGetPreCount = () => {
    this.setState({ preCountLoading: true })
    const { employerSpreadData } = this.props
    const { loc = [] } = R.propOr([], 'dictionary', this.props)

    const { provinces = [] } = employerSpreadData
    let provincesArr = []
    const citiesArr = []
    // 处理城市字段
    if (Array.isArray(provinces) && provinces.length !== 0) {
      provincesArr = provinces.filter((item) => {
        let flag = false
        flag = loc.some((i) => {
          return i.province === item
        })
        return flag
      })
      provinces.forEach((item) => {
        if (!provincesArr.includes(item)) {
          citiesArr.push(item)
        }
      })
    }
    const {
      positions = [],
      worktimes = [],
      degrees = [],
      professions = [],
      consume_num: consumeNum = 1,
      is_fan: isFan,
      companys = [],
    } = employerSpreadData
    const search = {
      positions: positions.join(','),
      provinces: provincesArr.join(','),
      cities: citiesArr.join(','),
      worktimes: worktimes.join(','),
      degrees: degrees.join(','),
      professions: professions.join(','),
      is_fan: isFan,
      cids: R.uniq(companys.map((v) => v.data)).join(','),
    }
    const obj = {
      webcid: R.pathOr('', ['company', 'webcid'], this.props.bprofileUser),
      search,
      pre_num: consumeNum * (isFan === 1 ? 1 : 2),
    }
    this.props
      .dispatch({
        type: 'company/employerPreCount',
        payload: obj,
      })
      .then((data) => {
        this.setState({ preCountLoading: false })
        const { tip = '', exposure_max } = data
        if (tip) {
          Message.error(tip)
          return
        } else {
          this.props.dispatch({
            type: 'company/setPreData',
            payload: { ...this.props.preData, ...data },
          })
          this.setPreData()
          if (exposure_max < 1) {
            Message.error('圈定人数为0，请更换筛选条件')
          }
        }
      })
  }

  handleGetPreData = (isShowPreviewView) => {
    const { employerSpreadData } = this.props
    const { loc = [] } = R.propOr([], 'dictionary', this.props)

    const { provinces = [] } = employerSpreadData
    let provincesArr = []
    const citiesArr = []
    // 处理城市字段
    if (Array.isArray(provinces) && provinces.length !== 0) {
      provincesArr = provinces.filter((item) => {
        let flag = false
        flag = loc.some((i) => {
          return i.province === item
        })
        return flag
      })
      provinces.forEach((item) => {
        if (!provincesArr.includes(item)) {
          citiesArr.push(item)
        }
      })
    }
    const {
      positions = [],
      worktimes = [],
      degrees = [],
      professions = [],
      consume_num: consumeNum = 1,
      is_fan: isFan,
      companys = [],
    } = employerSpreadData
    const search = {
      positions: positions.join(','),
      provinces: provincesArr.join(','),
      cities: citiesArr.join(','),
      worktimes: worktimes.join(','),
      degrees: degrees.join(','),
      professions: professions.join(','),
      is_fan: isFan,
      cids: R.uniq(companys.map((v) => v.data)).join(','),
    }
    const obj = {
      webcid: R.pathOr('', ['company', 'webcid'], this.props.bprofileUser),
      search,
      pre_num: consumeNum * (isFan === 1 ? 1 : 2),
    }

    this.props
      .dispatch({
        type: 'company/employerPre',
        payload: obj,
      })
      .then(({ data = {} }) => {
        // eslint-disable-next-line no-console
        const { tip = '' } = data
        if (tip) {
          Message.error(tip)
          return
        } else {
          this.props.dispatch({
            type: 'company/setPreData',
            payload: { ...data },
          })
          this.setState({
            isShowComfirmModal: !isShowPreviewView,
          })
          this.setState({
            isShowPreviewView,
          })
        }
      })
  }

  handlePublishClick = () => () => {
    // 数据校验
    if (this.handleCheckData()) {
      return
    }
    this.handleGetPreData()
  }

  handlePreviewClick = () => () => {
    if (this.handleCheckData()) {
      return
    }
    this.handleGetPreData(true)
  }

  handleHiddenPreview = () => {
    this.setState({
      isShowPreviewView: false,
    })
  }

  handleOk = () => () => {
    this.setState({
      isShowComfirmModal: false,
    })
    const { onScheduleChanged } = this.props
    const { employerSpreadData } = this.props
    const {
      jump_url: jumpUrl = '',
      push_type: pushType,
      promote_type,
      positions,
      worktimes,
      degrees,
      professions,
      provinces,
      content,
      jid,
      is_fan: isFan,
      companys = [],
      fid = 0,
      invite_time: inviteTime,
      invite_end_time: inviteEndTime,
      consume_num: consumeNum = 1,
    } = employerSpreadData
    let { img_url: imgUrl } = employerSpreadData
    imgUrl = imgUrl || ''

    const { loc = [] } = R.propOr([], 'dictionary', this.props)
    let provincesArr = []
    const citiesArr = []
    // 处理城市字段
    if (Array.isArray(provinces) && provinces.length !== 0) {
      provincesArr = provinces.filter((item) => {
        let flag = false
        flag = loc.some((i) => {
          return i.province === item
        })
        return flag
      })
      provinces.forEach((item) => {
        if (!provincesArr.includes(item)) {
          citiesArr.push(item)
        }
      })
    }

    const search = {
      positions: positions ? positions.join(',') : '',
      provinces: provincesArr.join(','),
      cities: citiesArr.join(','),
      worktimes: worktimes ? worktimes.join(',') : '',
      degrees: degrees ? degrees.join(',') : '',
      professions: professions ? professions.join(',') : '',
      is_fan: isFan,
      cids: R.uniq(companys.map((v) => v.data)).join(','),
    }
    const promoteContent = {
      fid,
      content,
      img_url: imgUrl,
      jid,
      jump_url: jumpUrl,
    }
    const query = {
      webcid: R.pathOr('', ['company', 'webcid'], this.props.bprofileUser),
      promote_type,
      push_type: pushType,
      pre_exposure: consumeNum,
      pre_num: consumeNum * (isFan === 1 ? 1 : 2),
      invite_time: inviteTime,
      invite_end_time: inviteEndTime,
      search,
      promote_content: promoteContent,
    }

    this.props
      .dispatch({
        type: 'company/employerAdd',
        payload: query,
      })
      .then(({ data = {} }) => {
        const { tip = '' } = data
        if (tip) {
          Message.error(tip)
          return
        }
        onScheduleChanged('end')
      })
  }

  handleCancel = () => () => {
    this.setState({
      isShowComfirmModal: false,
    })
  }

  renderSpreadHeader = () => {
    return <SpreadHeader />
  }

  renderSpreadTarget = () => {
    return (
      <SpreadTarget
        employerSpreadData={this.props.employerSpreadData}
        handleTargetChanged={this.handleTargetChanged()}
      />
    )
  }

  renderSpreadPeople = () => {
    return (
      <SpreadPeople
        employerBalance={this.props.employerBalance}
        positionOptions={this.getPositionOptions()}
        companyOptions={this.getCompanyOptions()}
        worktimeData={R.propOr([], 'worktime', this.props.config)}
        professionData={R.propOr([], 'profession', this.props)}
        degreeData={R.propOr([], 'degree', this.props.config)}
        dictionaryData={R.propOr([], 'dictionary', this.props)}
        employerSpreadData={this.props.employerSpreadData}
        preData={this.props.preData}
        handleCitysChange={this.handleFieldChange('provinces')}
        handlePositionSkillChange={this.handleFieldChange('positions')}
        handleCompanyChange={this.handleFieldChange('companys')}
        handlePositionOptionsChange={this.handlePositionOptionsChange()}
        handleCompanyOptionsChange={this.handleCompanyOptionsChange()}
        handleDegreeChange={this.handleFieldChange('degrees')}
        handleworktimeChange={this.handleFieldChange('worktimes')}
        handleProfessionChange={this.handleFieldChange('professions')}
        handlerConsumeNumChange={this.handlerConsumeNumChange}
        handleFanChange={this.handleFanChange}
        preCountLoading={this.state.preCountLoading}
      />
    )
  }

  renderSpreadContent = () => {
    const { dynamicList } = this.state
    return (
      <SpreadContent
        handleTextAreaChange={this.handleTextAreaChange()}
        handleUploadImgChange={this.handleUploadImgChange()}
        handleJumpUrlChange={this.handleJumpUrlChange()}
        handleCancleImg={this.handleCancleImg}
        handlePushTypChange={this.handlePushTypChange}
        handleDynamicChange={this.handleDynamicChange}
        contentValue={this.props.employerSpreadData.content}
        dynamicList={dynamicList}
        loadImg={this.state.loadImg}
        imgSrc={this.state.imgSrc}
        jobs={this.state.jobs}
        handleJidChange={this.handleFieldChange('jid')}
        jid={this.props.employerSpreadData.jid}
        defaultValue={this.state.defaultValue}
        employerSpreadData={this.props.employerSpreadData}
      />
    )
  }

  renderSpreadTime = () => {
    return (
      <SpreadTime
        employerSpreadData={this.props.employerSpreadData}
        onPushStartTimeChange={this.onPushStartTimeChange}
        onPushEndTimeChange={this.onPushEndTimeChange}
      />
    )
  }

  renderSpreadBtn = () => {
    return (
      <SpreadBtn
        handlePublishClick={this.handlePublishClick()}
        handlePreviewClick={this.handlePreviewClick()}
        preData={this.props.preData}
        preCountLoading={this.state.preCountLoading}
      />
    )
  }

  renderComfirmModal = () => {
    const { isShowComfirmModal } = this.state
    return (
      <ComfirmModal
        sourceJobs={this.state.jobs}
        visible={isShowComfirmModal}
        employerBalance={this.props.employerBalance}
        onOk={this.handleOk()}
        onCancel={this.handleCancel()}
        employerSpreadData={this.props.employerSpreadData}
        preData={this.props.preData}
        imgSrc={this.state.imgSrc}
      />
    )
  }

  renderPreviewView = () => {
    const { isShowPreviewView } = this.state
    if (!isShowPreviewView) return null
    return (
      <PreviewView
        sourceJobs={this.state.jobs}
        loadImg={this.state.loadImg}
        imgSrc={this.state.imgSrc}
      />
    )
  }

  renderPreviewMask = () => {
    const { isShowPreviewView } = this.state
    if (!isShowPreviewView) return null
    return (
      <div
        className={styles.employerSpreadProcessingPreviewMask}
        onClick={this.handleHiddenPreview}
      />
    )
  }

  render() {
    return (
      <div className={styles.employerSpreadProcessingCon}>
        {this.renderSpreadHeader()}
        {this.renderSpreadTarget()}
        {this.renderSpreadContent()}
        {this.renderSpreadPeople()}
        {this.renderSpreadTime()}
        {this.renderSpreadBtn()}
        {this.renderComfirmModal()}
        {this.renderPreviewView()}
        {this.renderPreviewMask()}
      </div>
    )
  }
}
