import * as R from 'ramda'

export const flatternCities = (data = []) => {
  const directControlCities = ['北京', '天津', '上海', '重庆']
  return data.reduce((prev, curr) => {
    const { province, cities } = curr
    const formatCities = directControlCities.includes(province)
      ? [`${province}-${province}`]
      : cities
          .filter(({ city }) => !['其他', '其它'].includes(city))
          .map(({ city }) => `${province}-${city}`)
    return [...prev, ...formatCities]
  }, [])
}

export const flatternMajor = () => {}

// 格式化 学校数据 to popover显示的格式
export const fomatEduToPopoverData = (edu) => {
  return edu.map((item) => {
    return {
      leftLogo: R.propOr(
        'http://i9.taou.com/maimai/c/interlogo/default.png',
        'school_url',
        item
      ),
      title: R.propOr('', 'school', item),
      subTitle: R.without(
        [''],
        [
          R.propOr('', 'v', item),
          R.propOr('', 'sdegree', item),
          R.propOr('', 'department', item),
        ]
      ).join('，'),
      desc: R.propOr('', 'description', item),
    }
  })
}

// 格式化 就职公司数据 to popover显示的格式
export const fomatJobsToPopoverData = (exp) => {
  return exp.map((item) => {
    const {
      company_info: companyInfo = {
        clogo: 'http://i9.taou.com/maimai/c/interlogo/default.png',
        name: '',
        cid: 1,
      },
    } = item
    return {
      leftLogo: R.propOr(
        'http://i9.taou.com/maimai/c/interlogo/default.png',
        'clogo',
        companyInfo
      ),
      title: R.propOr('', 'company', item),
      subTitle: R.without(
        [''],
        [R.propOr('', 'v', item), R.propOr('', 'position', item)]
      ).join('，'),
      desc: R.propOr('', 'description', item),
    }
  })
}

export const getIsFirstShowStrongIntentions = () =>
  window.localStorage.getItem('isFirstShowStrongIntentions')

export const setIsFirstShowStrongIntentions = () => {
  window.localStorage.setItem('isFirstShowStrongIntentions', true)
}

export const removeIsFirstShowStrongIntentions = () => {
  window.localStorage.removeItem('isFirstShowStrongIntentions')
}

export const parseCurrentTabParam = (data) => {
  const key = R.pathOr('', ['key'], data)
  const value = R.pathOr('', ['title'], data)

  return {
    key,
    value,
  }
}
