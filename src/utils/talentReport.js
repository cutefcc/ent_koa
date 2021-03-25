import React from 'react'

const demos = new Set([
  1559312,
  30690850,
  231160,
  1433815,
  479610,
  589299,
  34750574,
  5493195,
  36359559,
  40058421,
  5583337,
  5798611,
  126782978,
  5653226,
  231548070,
  196800079,
  194544492,
  225642315,
  219763009,
  116237811,
  231717465,
  231720833,
  230040579,
  231283157,
  43361050,
  35317102,
  30361731,
])

export const companyKeyList = [
  'all',
  'top',
  'self',
  'team',
  'a_com',
  'b_com',
  'c_com',
  'd_com',
  'e_com',
]

export const cityKeyList = ['北京', '上海', '广州', '深圳', '杭州', '成都']

export const industryKeyList = [
  '互联网',
  '金融',
  '汽车',
  '制造',
  '通信',
  '医疗',
  '地产',
  '其他',
]

export const getCompanyNameByKey = key => {
  switch (key) {
    case 'all':
      return '全行业'
    case 'top':
      return '头部大厂'
    case 'self':
      return '本公司'
    case 'team':
      return '本团队'
    case 'a_com':
      return '对比公司1'
    case 'b_com':
      return '对比公司2'
    case 'c_com':
      return '对比公司3'
    case 'd_com':
      return '对比公司4'
    case 'e_com':
      return '对比公司5'
    default:
      return ''
  }
}

export const getPieColorByIndex = index => {
  switch (index) {
    case 0:
      return `rgba(0, 76, 255, 0.9)`
    case 1:
      return `rgba(0, 76, 255, 0.76)`
    case 2:
      return `rgba(0, 76, 255, 0.62)`
    case 3:
      return `rgba(0, 76, 255, 0.48)`
    case 4:
      return `rgba(0, 76, 255, 0.34)`
    case 5:
      return `rgba(0, 76, 255, 0.2)`
    default:
      return `rgba(0, 76, 255, 0)`
  }
}

export const getBarColorByIndex = index => {
  switch (index) {
    case 0:
      return `rgba(0, 76, 255, 0.9)`
    case 1:
      return `rgba(0, 76, 255, 0.7)`
    case 2:
      return `rgba(0, 76, 255, 0.5)`
    case 3:
      return `rgba(0, 76, 255, 0.3)`
    case 4:
      return `rgba(0, 76, 255, 0.1)`
    case 5:
      return `rgba(0, 76, 255, 0)`
    default:
      return `rgba(0, 76, 255, 0)`
  }
}

export const getHorizontalColorByIndex = index => {
  switch (index) {
    case 0:
      return `rgba(0, 76, 255, 1)`
    case 1:
      return `rgba(0, 76, 255, 0.85)`
    case 2:
      return `rgba(0, 76, 255, 0.7)`
    case 3:
      return `rgba(0, 76, 255, 0.55)`
    case 4:
      return `rgba(0, 76, 255, 0.4)`
    case 5:
      return `rgba(0, 76, 255, 0.25)`
    case 6:
      return `rgba(0, 76, 255, 0.1)`
    default:
      return `rgba(0, 76, 255, 0)`
  }
}

export const getLineColorByIndex = index => {
  switch (index) {
    case 0:
      return `#11C6FF`
    case 1:
      return `#0DA0CC`
    case 2:
      return `#0D4CFD`
    case 3:
      return `#6593FC`
    case 4:
      return `#57CD00`
    case 5:
      return `#89C85B`
    case 6:
      return `rgba(17, 198, 255, 1)`
    case 7:
      return `rgba(17, 198, 255, 0.6)`
    default:
      return `rgba(0, 76, 255, 0)`
  }
}

export const getDataSetColorByIndex = index => {
  switch (index) {
    case 0:
      return '#004CFF'
    case 1:
      return '#11C6FF'
    default:
      return '#fff'
  }
}

export const isDemoUid = uid => {
  if (demos.has(uid)) {
    return true
  }
  return false
}

export const getReportTips = menuKey => {
  switch (menuKey) {
    case '0-1':
      return (
        <span>
          科技发展与经济变化，长期为人才培养及赋能注入新机遇。
          <br />
          雇主可通过求职者变化趋势及竞争度，掌握城市人才供给，洞悉招聘难度，及时调整人才招募策略，并可提前进行区域人才战略布局。
        </span>
      )
    case '0-2':
      return (
        <span>
          人才流动往往代表则资本流向，也在逐渐塑造中国城市的新格局，并指引着行业的变革方向。
          <br />
          雇主可通过城市人及行业的才流动趋势，实时掌握城市人才争夺战的新版图及重要经济产业的创新机遇。
        </span>
      )
    case '0-3':
      return (
        <span>
          纵观城市发展轨迹，与中高端人才资源紧密先关。
          <br />
          城市人才分布画像的诸多维度，揭示了核心人才质量与城市吸引力，为雇主的全国性布局调整提供有力数据支持。
        </span>
      )
    case '1-1':
      return (
        <span>
          企业人才流动数据揭示了雇主的人才吸引力程度，并能够洞悉核心人才的来源与去向，基于脉脉强大的人脉网络，可为后续定向人才招募或保温机制提供实时参考。
          <br />
          此外，结合对比公司的人才流动数据，能够透视雇主关注领域的人才流向趋势，并赋能雇主战略生态布局调整。
        </span>
      )
    case '1-2':
      return (
        <span>
          人才技能基于脉脉平台智能化大数据分析体系，雇主能够更直观地洞悉企业人才的能力分布。并可基于行业整体或其他雇主情况，及时捕捉变化动向，相应调整业务布局或人才招募方向。
        </span>
      )
    case '1-3':
      return (
        <span>
          与城市人才画像类似，雇主人才画像也代表了其核心人才质量与人才留存情况。
          <br />
          行业综合数据仅为雇主提供平均数据参考，便于后期在特定层面进行微调。
          <br />
          此外，除非有较大的企业战略布局调整，对于同一细分行业的雇主，人才职业分布方向较为类似。
        </span>
      )

    case '1-4':
      return (
        <span>
          对雇主表达求职意向的人才画像，高比例的优质人才意味着更高地招聘效率，同时基于行业及公司对比，也可实时洞察当前招募岗位的竞争与压力情况。
        </span>
      )
    case '1-5':
      return (
        <span>
          人才库的质量也是招聘工作中重要的一环，也代表着企业预期招募的方向，可结合当前对雇主表达求职意向的人才情况，透视偏差度，及时调整工作方向。
        </span>
      )
    case '1-6':
      return (
        <span>
          粉丝是雇主可长期影响并建立深度连接的人群，提升粉丝中目标人才的数量和比例，可更好地赋能雇主人才招聘漏斗转化。
        </span>
      )
    case '1-7':
      return (
        <span>
          通过透视已发布职位的相关数据，可及时知悉岗位招聘压力及难度，并结合对比公司情况，及时调整招聘策略。
        </span>
      )
    case '1-8':
      return (
        <span>
          企业影响力代表在脉脉平台的雇主品牌运营情况，通过影响范围、员工认可及粉丝好感度指数，洞悉现状优势或不足，并可进行相应策略调整。
        </span>
      )
    default:
      return null
  }
}

export const getReportMenuName = menuKey => {
  switch (menuKey) {
    case '0-1':
      return '市场行情'
    case '0-2':
      return '人才流动'
    case '0-3':
      return '人才画像'
    case '1-1':
      return '员工流动'
    case '1-2':
      return '员工技能'
    case '1-3':
      return '员工画像'
    case '1-4':
      return '招聘人才画像'
    case '1-5':
      return '储备人才画像'
    case '1-6':
      return '互动人才画像'
    case '1-7':
      return '职位吸引力'
    case '1-8':
      return '雇主影响力'
    default:
      return ''
  }
}
export const wordCloudMagnification = [
  2500,
  2401,
  2304,
  2209,
  2116,
  2025,
  1936,
  1849,
  1764,
  1681,
  1600,
  1521,
  1444,
  1369,
  1296,
  1225,
  1156,
  1089,
  1024,
  961,
  900,
  841,
  784,
  729,
  676,
  625,
  576,
  529,
  484,
  441,
  400,
  361,
  324,
  289,
  256,
  225,
  196,
  169,
  144,
  121,
  100,
  81,
  64,
  49,
  36,
  25,
  16,
  9,
  4,
  1,
]

export const defaultTalentReportColor = '#eee'

export const defaultTalentReportBackgroundColor = '#F4F5FA'

// 不同版本的人才报告报表权限
export const talentReportAuthority = {
  1: new Set(['1-6', '1-8']),
  2: new Set([
    '0-1',
    '0-2',
    '0-3',
    '1-1',
    '1-2',
    '1-3',
    '1-4',
    '1-5',
    '1-6',
    '1-7',
    '1-8',
  ]),
}

export const defaultMenuKey = '1-3'

export const defaultMinBarOutNum = 2
