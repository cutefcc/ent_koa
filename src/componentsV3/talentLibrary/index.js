import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import ReactEchartsCore from 'echarts-for-react/lib/core'

// then import echarts modules those you have used manually.
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import styles from './index.less'

function TalentLibrary({ trendsData, dispatch, urlPrefix }) {
  const fetchTrendsData = () => {
    dispatch({
      type: 'homeSubscribe/fetchTrendsData',
      payload: {},
    })
  }
  const onEvents = {
    click: (params) => {
      const { seriesId } = params
      // todo 跳转逻辑，等二级页面定了再说
      // alert(seriesId);
    },
  }

  useEffect(() => {
    fetchTrendsData()
  }, [])

  const date = []
  const employer_brand_new_cnt = [] // 雇主品牌
  const contact_management_new_cnt = [] // 沟通管理
  const user_group_new_cnt = [] // 个人储备
  const company_group_new_cnt = [] // 企业储备

  trendsData.forEach((item) => {
    employer_brand_new_cnt.push(item.employer_brand_new_cnt)
    contact_management_new_cnt.push(item.contact_management_new_cnt)
    user_group_new_cnt.push(item.user_group_new_cnt)
    company_group_new_cnt.push(item.company_group_new_cnt)
    date.push(item.date.substr(5).replace('-', '/'))
  })

  const toLocalDate = (str) => {
    const dateStr = str
      .split('/')
      .map((item) => {
        item = parseInt(item, 10)
        return item
      })
      .join('月')

    return dateStr + '日'
  }

  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        show: true,
        padding: 0,
        formatter: (params) => {
          const html = []
          params.forEach((item) => {
            html.push(
              `<li class="${item.seriesId}">${item.seriesName}：新增${item.value}人</li>`
            )
          })
          return `<div class="tooltip-div"><h6>${toLocalDate(
            params[0].name
          )}</h6><ul>${html.join('')}</ul></div>`
        },
      },
      legend: {
        itemWidth: 14,
        itemHeight: 14,
        padding: 0,
        itemGap: 10,
        textStyle: {
          padding: 0,
        },
        data: [
          {
            name: '企业储备',
            icon:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAChklEQVRIS8XWTYvTQBjA8X9mkjTd4qHoIkpXFhEPxYMge/Y7COrFg5/Co1aPfgoPXlTwO3heBA/Sg4gs7qLIKj1It21eZmSeJH3Jpu4e3FgIGZrJ/PLMM28eJ/2s9U6qsvLc8+zf6tc3ViIDFs+HS+W6FvssoEFRrsGPgw4roRI5xON6AY4qcLdo/BOWzaJc4g6uoKtgFevj8R2PfRQX8RgX2LS4RwXQwfIDyxaGS1iGWNagC7CKdVG4aDooQinn97gSYYglxtDFyH0sZcsIU4fmYB3WQrGHJkIBWi4fxRRFNI/UEmFIMUAm1xTDNhkzTB26CrqcucgcNkOTopnik+CT4QuqUWQFqLFkBeZqB6REpFK7VUGLfObgE6twmMvZUKLw2UTzmwCfgBkBmgBToEqiBlNgipSMhBYJKQnnSDgkE7yPmef0qWe8eXeW0cVoxsIEWFyGQve9IYTXLnM/9LmjFVedlxm+xClvP3/jVQzuzRmeZDkmIaFDKm+X+RxgF+A7FG00W2hGBJBDLosXOvR653muFTt1UzAz7B784tHPMQeSRQe7D+iSsE/GhIzbGObgPZTkroxuCQuh3b/Ci3VY+QEOHX7lYYw0v0CXo3xN0aUlOMInlFyFzGQstvs9HrRDHp9meZvEPBse8BLLhJaM51g6t0sq3boClkPfRZfSwpcBv3FzmzdaceM0YGb4+GGPuyiOSGXo5V1bTpljoKsSyciMmNAmYOPWNrvAxmlA4Oj9HjskHNFmIuiUREarQ/8/mHdrQ12ar50NDppGp4Xb/xqd+A5sbGlrfPFe3g8b254a34DX7fpndsQo161GD1HrUPf/mR0Tl1FXbuQgXN0W/vFR/w/83Cwvr9ImMwAAAABJRU5ErkJggg==',
          },
          {
            name: '个人储备',
            icon:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAADY0lEQVRIS83WvW4bRxAH8P/M7n2SNE0IpBq7uSKFlE5wHT1DACZNijxFyohKmadIkSYmkGdQasNdpCIFG7uRCIGmKd7n7k5wd6Khr8QqIiKsjrjd+93M7u0M4TM/EaHPjbl5n4jk38Y/+LANMplM2vuTCc6m0/Z6fOdx0/b/3ngs9bh2+KRBH8LvgTW2gc7296kG5idDWvX+IuAAWTi7NSfKEwHeorf6QoaHc8EU2Ds9bcAavovemvwJqyPClFqoR8uLCzbROZmgQ3gJuPOomce7meAdoIu16GxX+qOR661WDbyHNuK76CfwLjZ7u+AsHFDaGXJ5ecXPw4zLq5Kd9gmD67QuADal+F3ffcgj5+90XbyeuyhfSHIwcA+hDXgfS3jZv+B0aVUN5RFUmUE5L2KbVxxz3sxLXSgq9BxXmfMj2DCDreG4r2x/OXLJweweegs8m+xTHdmy/7LBel2nslLpMkp1sFTaeFBOWQarNjPOClvldAVb9K3xs9hEvjWrK7Yt+s41kU5OZZPaZuLR0RHXG2Q+HNLFcM4f8kjX2NoUnieBVzrj6cB61rF2Bsqx42YN6wsNq9gZU6jKZ11VVFQdHVQ1+jzMzGg+dMP5XOqNdHx87GiTzja6hC93Vipez/WViz1F1i8gPlMZGMBn8LeO8LVAkmbbg2Ys+N3B/aaB0olfBKDSiiq7nFZpZ2h2Lnu2Se0mygYE6I+TE36fZSodWRUOMi918FWqAlI2hHgvDFU/C+jVQx81Qd5o8X4AVe/FqtzGtogZZb6IqvhC2RdRZL86PHQTQJoIv5lOeZYs+HLlq3jY0R8BX+UqQNeGhUEE4Jd/wjYvUKMAvg80Mlyp3Ia2eAaU6XxtdnqlTWYD93o8blPaggmflzMdcumlg75PeRmSJ5Fz+M5CfnzM8aZAPzHjV6kok9DP48WyzJ1f7fqJSWazGyCmfHoK9bEP5Z/DX3s6YGVCchw7hamIfPkYkIj+ZIuxsEud1XmnMkW5i/LZEnZ/H/Y1NhFeg/XurNdPUhNmhiJ4KhaiNxDEjwFBSEnkFSqbRloyinVer2O9W/8f4PZSuvVNs+3PYusffl1wt3a0bf3wvlkPt1aetl6AH676T9hibI6trTZR91AAT94m3kSv+8qnb4TvVoX/utX/GydS8DKYhWyrAAAAAElFTkSuQmCC',
          },
          {
            name: '雇主品牌',
            icon:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAC00lEQVRIS83WvXLcVBTA8f/91H5gJzvBwDBJQQoKTJs678BMoKHgKSjJhpKnoKCBzPAO1G4xBUUokmEAk1lis9rV/WQkrdbseu24wBq2kTS60m/PPbr3HMFrfjln8box/74vhMhXjd/5sjUynZ7fP/zpavj4g3NoOm3Od+EXXtJgHdQhxyeCd8/asZPF5jOzYQv9upc5PGjPO3w6zdvoxsMXsIMTwc9nguqVZC8IxqEdP0srXLbAXGfOdKa4lXh/L3NykC9D1+AFbPZMNtHMS8mbTrLwEhcldiunTmSsSgxN4k+bGI8SddST+2kX2oA7sXuvJM9LxcRLCIrTqBhlScgSvUKDyGiRKEViX0XQkZlJ3BtFnt9Ku9BNsM5ZHVmNxVKRnOJvrzFRUyWNyIpYg7QzE8gokcgiUsiAV4E3TEDaiNpCV/lswcePJTVW5+zkD8nsL807TlE5Q4iGlAzJGlRu0ZRlA8oVFkVAOo+UHq08hfX8ZiOT24GDt1KXU/HkSRLr6eyisy8V47nGO4MIFpEswRTNkfQJpI+A+6u19gzk9yC/JUuH9lVzzNphrGc+Drg7cT21dZTn+ftBcueF4r1SsVgY8BYXC7IZoN1dIl8BDy5Z1EcoPifYFwi/xKoKjGM49Pwyiry8G+FhYg0+/Vg2ueuiO60sRWgxGYcQvr4C6/7DEejPSGrRoJWu2C/cRpSPvltNaQdOfte40iC9JYUBwgzJ4VNIX1xve5NfIvQ3ZL9A6iXJOOzIM3s7NNO6AXKs4FTB3LL0BTkMMGZE8k+BD68H8iPSPML7EqGXDEwFYwf7EQ7jRbD+OicLQ3ADqjjE6BGEI2B0TbAE/QAfSgq1QNsls6Fvvtb/B9jrlDZ7Z58fTa/Loql/fS78Guxra+t9896oh72Vp+0+pquJN1WAL636N9VidNtWr03UpWjT9t1Qm7iB1hd9NMLbVeG/bvX/AQANBDKeIJzXAAAAAElFTkSuQmCCle',
          },
          {
            name: '沟通管理',
            icon:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACgUlEQVRIS73WPW/TQBgH8P9z58Zp81JaFYkAYkVy2DqzdWfqhoSYmPkG+QbMTAiJrRN7NmY2bIkVAUGiSmnStHF6dw+6c9zGiZM4Q23JypDL/fJ/7pWw5mFmWtdm9nsi4lXtczvbFFkG5OELYC7W6RRL2ekspJtHMx0tYCkURYRjAGGQD7cjxgmAIEjAOXgWvekgF3PQMRCGhF6P0Dqbtg+mVYySz94eo9VitNuMk5MEXoK6DnKxdkQukYNahH6fsD8kDEYEPJ6CP4FmjdFvMPb3Gb3eFI4YYT66CNoyptjDHuGbL+D9ERjtEZpXhMsGndbH7ncHF1XGzpAx2GbUzhjqgcGz2OC3TbuI2tJmQYvZMgYB4QbzBOSpgNgSIE8gnpB77eNX2L2sDMy1gT4wUOoWjSKeLa8DM+V06dqEblfAt8ksEEvIcwHF0gh+ZRgvifhpMhT0XRA+CUMf4ZGG3jXwfe3QODY4OjIIw8x43oKz6QCBQSQhqwKxkRMpHkml3jPz87w1R0RftOe9qWjzC77Q0GODZqABGMynvEmYjl13L0lnk91TEsOxpyV/Xoalf8CiUtMLNKoK/zztkrqUZ2Z2AmUT2mSIBFATGGkJue2Zi+FrA35XZHsToLei3vgAfaVQkxoYGSAwLul0meSDA0jE9yUql56axF0QHxYBwfTVq/hHmOwo+H81mtAFQDt+A4mtc8+VU5gfDNSLgARcSCOeuLJe7yo0m8k4rk5YOhgJlFvSMieN3dJKXRbptlbKwk/Osbvf2jLHUxmb98J5WOrxlK7uWfQuDuClp/5dXTHSYKVeopai6ewtspluek1ciRYB59oUugjP97vpLXzdVf8/oeqOI6d+t+QAAAAASUVORK5CYII=',
          },
        ],
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {
            show: false,
          },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            type: 'dashed',
            color: '#999',
          },
          fontSize: 12,
          color: '#999',
        },
        axisLabel: {
          interval: 0,
          padding: 0,
          showMinLabel: true,
          padding: 0,
        },
        axisTick: {
          show: false,
        },
        data: date,
      },
      yAxis: {
        type: 'value',
        splitNumber: 4,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          type: 'line',
          name: '企业储备',
          id: 'company_group_new_cnt',
          smooth: true,
          lineStyle: {
            color: '#3375FF',
          },
          itemStyle: {
            opacity: 0,
          },
          data: company_group_new_cnt,
          toolbox: {
            formatter: () => {
              return '<div>xxxbbbb</div>'
            },
          },
        },
        {
          name: '个人储备',
          type: 'line',
          id: 'user_group_new_cnt',
          smooth: true,
          lineStyle: {
            color: '#17d4ab',
          },
          data: user_group_new_cnt,
        },
        {
          name: '雇主品牌',
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#ffa408',
          },
          id: 'employer_brand_new_cnt',
          data: employer_brand_new_cnt,
          toolbox: {
            formatter: () => {
              return '<div>xxxbbbb</div>'
            },
          },
        },
        {
          name: '沟通管理',
          type: 'line',
          id: 'contact_management_new_cnt',
          smooth: true,
          lineStyle: {
            color: '#ff4d3c',
          },
          data: contact_management_new_cnt,
        },
      ],
    }
  }

  const onChartReadyCallback = () => {}

  const goDetail = () => {
    window.open(`/ent/v3/index/groups?currentTab=talent`)
  }

  return (
    <div>
      <div className={styles.talentHeader} onClick={goDetail}>
        <h6 className={styles.talentTitle}>人才库</h6>
        <img
          src={`${urlPrefix}/images/v3/talent/talent_next.png`}
          className={styles.talentNext}
          height={11}
          width={6}
        />
      </div>
      <ReactEchartsCore
        echarts={echarts}
        style={{ width: '100%', height: 200 }}
        option={getOption()}
        onEvents={onEvents}
        notMerge={true}
        lazyUpdate={true}
        theme={'theme_name'}
        onChartReady={onChartReadyCallback}
      />
    </div>
  )
}

export default connect((state, dispatch) => ({
  trendsData: state.homeSubscribe.trendsData,
  dispatch,
  urlPrefix: state.global.urlPrefix,
}))(TalentLibrary)
