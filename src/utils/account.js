import * as R from 'ramda'

// export const checkIsSeniorMember = user =>
//   [3, 4].includes(R.pathOr(1, ['talent_lib', 'version'], user))

export const checkIsSeniorMember = R.pathEq(['talent_lib', 'version'], 4)

export const checkIsIntermediateMember = R.pathEq(['talent_lib', 'version'], 3)

export const checkIsJuniorMember = R.pathEq(['talent_lib', 'version'], 2)

export const showMosaic = (user) => checkIsJuniorMember(user)

export const checkIsCompanyAdministrator = R.pathEq(['is_company_vip'], 1)
