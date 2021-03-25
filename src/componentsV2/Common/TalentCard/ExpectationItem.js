import React, { memo } from 'react'
import * as R from 'ramda'
import styles from './ExpectationItem.less'

export default memo(({ data }) => {
  const resumeBadges = R.propOr([], 'resume_badges', data)
  const jobPreference = R.propOr([], 'job_preference', data)
  const cities = R.propOr('', 'province_cities', jobPreference)
  const positions = R.propOr('', 'positions', jobPreference)
  const industry = R.propOr('', 'profession_majors', jobPreference)
  const salary = R.propOr('', 'salary', jobPreference)

  // 是否显示求职偏好
  const isShowJobPreference = cities || positions || industry || salary
  return (
    <div className={styles.itemCon}>
      {isShowJobPreference && (
        <div className={styles.jobPreference}>
          <div className={styles.preferenceTitle}>求职偏好</div>
          {cities && (
            <div className={styles.jobPreferenceItem}>
              <span className={styles.jobPreferenceItemLeftText}>
                期望城市：
              </span>
              <span className={styles.jobPreferenceItemRightText}>
                {cities}
              </span>
            </div>
          )}
          {positions && (
            <div className={styles.jobPreferenceItem}>
              <span className={styles.jobPreferenceItemLeftText}>
                期望职位：
              </span>
              <span className={styles.jobPreferenceItemRightText}>
                {positions}
              </span>
            </div>
          )}
          {industry && (
            <div className={styles.jobPreferenceItem}>
              <span className={styles.jobPreferenceItemLeftText}>
                期望行业：
              </span>
              <span className={styles.jobPreferenceItemRightText}>
                {industry}
              </span>
            </div>
          )}
          {salary && (
            <div className={styles.jobPreferenceItem}>
              <span className={styles.jobPreferenceItemLeftText}>
                期望薪资：
              </span>
              <span className={styles.jobPreferenceItemRightText}>
                {salary}
              </span>
            </div>
          )}
        </div>
      )}
      {/* 近期偏好 */}
      {Array.isArray(resumeBadges) && resumeBadges.length > 0 && (
        <div
          className={`${styles.recentPreferences}`}
          style={isShowJobPreference ? { marginTop: '32px' } : {}}
        >
          <div
            className={`${styles.preferenceTitle} ${styles.recentPreferencesTitle}`}
          >
            近期偏好
          </div>
          {resumeBadges.map((item, index) => {
            const uptime = R.propOr('', 'uptime', item)
            const position = R.propOr('', 'position', item)
            return (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`${item.city}${index}`}
                className={styles.recentPreferencesItem}
              >
                <div className={styles.leftText}>{position}</div>
                <div className={styles.rightText}>{uptime}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})
