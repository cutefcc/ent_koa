import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
// import {getModuleName} from 'utils'
import { Loading } from 'mm-ent-ui'
import { ANALYSIS_TITLE_MAP } from 'constants/talentDiscover'
import AnalysisData from './AnalysisData'
import MappingTags from './MappingTags'
import * as styles from './index.less'

@connect((state) => ({
  loading: state.loading.effects[`talentDiscover/fetchData`],
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
export default class AnslysisChart extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleAnalysisData = () => {
    const { analysis } = this.props
    const analysisData = {}
    Object.keys(ANALYSIS_TITLE_MAP).forEach((item) => {
      analysisData[item] = R.propOr([], item, analysis)
    })
    return analysisData
  }

  renderAnslysisChart = (analysisData) => {
    const {
      talentList,
      isShowDataAnalysis,
      onMappingTagsChanged,
      mappingTags,
    } = this.props

    const analysDataEmpty = Object.keys(analysisData).every((item) =>
      R.isEmpty(analysisData[item])
    )
    if (!analysDataEmpty && !R.isEmpty(talentList) && isShowDataAnalysis) {
      const analysisDatatKeys = Object.keys(analysisData)
      return (
        <div>
          <div className={styles.analysisCon}>
            {analysisDatatKeys.map((item) => {
              if (analysisData[item].length > 0) {
                return (
                  <div
                    key={item}
                    className={`${styles.analysisItemCon} analysisItemCon`}
                  >
                    <AnalysisData
                      key={item}
                      keyForData={item}
                      data={analysisData[item]}
                      mappingTags={mappingTags}
                      onMappingTagsChanged={onMappingTagsChanged}
                    />
                  </div>
                )
              }
              return null
            })}
          </div>
          <div
            style={{ height: '16px', backgroundColor: 'rgb(242, 244, 248)' }}
          />
        </div>
      )
    }
    return null
  }

  renderLoading = () => {
    return (
      <p className="text-center margin-top-32">
        <Loading />
        <span className="color-gray400 margin-left-8">加载中...</span>
      </p>
    )
  }

  render() {
    const analysisData = this.handleAnalysisData()
    const {
      onClearMapping,
      onMappingTagsChanged,
      mappingTags,
      isShowDataAnalysis,
      urlPrefix,
      // loading,
    } = this.props
    const tlv = R.pathOr(
      2,
      ['props', 'currentUser', 'talent_lib_version'],
      this
    )
    return (
      <div className={`${styles.anslysisChart}`}>
        {tlv === 2 && isShowDataAnalysis && (
          <img
            src={`${urlPrefix}/images/memberBg/banner2.png`}
            alt="当前人才银行版本不具有查看该功能的权限"
            style={{ display: 'block', width: '100%' }}
            onClick={() => {
              this.props.dispatch({
                type: 'global/setMemberUpgradeTip',
                payload: {
                  show: true,
                },
              })
            }}
          />
        )}
        <MappingTags
          onMappingTagsChanged={onMappingTagsChanged}
          onClearMapping={onClearMapping}
          mappingTags={mappingTags}
          isShowDataAnalysis={isShowDataAnalysis}
        />
        {this.renderAnslysisChart(analysisData)}
      </div>
    )
  }
}
