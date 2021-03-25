import React from 'react'
import request from 'utils/request'

const uidsMap = new Map()
const expireTime = 60 * 60 * 1000

const uploadUids = (uids) => {
  const candidate_uids = uids.toString()
  request('/api/ent/candidate/show', {
    query: {
      candidate_uids,
      channel: 'www',
      version: '1.0.0',
    },
  }).then((res) => {
    if (res.data.code === 0) {
      candidate_uids.split(',').forEach((uid) => {
        uidsMap.set(parseInt(uid, 10), new Date().getTime() + expireTime)
      })
    }
  })
}

/**
 * upload uids which is viewed
 * @param {Object} object rootSelector:root in IntersectionObserver, selector: target elements in IntersectionObserver
 */
export const uidsUploader = ({ rootSelector, selector }) => (
  WrappedComponent
) => {
  if (!rootSelector || !selector)
    throw new Error('rootSelector and selector is required')

  const upload = (uids) => {
    if (!(Array.isArray(uids) && uids.length)) return
    const candidate_uids = uids.splice(0, 20).join(',') // 20 is the max length
    uploadUids(candidate_uids)

    if (uids.length) throw new Error('candidate_uids is too large!')
  }
  return class extends React.Component {
    componentDidUpdate() {
      const { talentList } = this.props
      if (!('IntersectionObserver' in window)) return
      if (!this.observer) {
        this.observer = new IntersectionObserver(
          (entries) => {
            const collections = document.querySelectorAll(selector)
            const visibleIndexes = []
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const { target } = entry
                const index = Array.prototype.indexOf.call(collections, target)
                visibleIndexes.push(this.props.talentList[index])
              }
            })
            const now = new Date().getTime()
            upload(
              visibleIndexes
                .filter(
                  (item) =>
                    item &&
                    item.id &&
                    (!uidsMap.get(item.id) || uidsMap.get(item.id) < now)
                )
                .map((item) => item.id)
            )
          },
          {
            root: document.querySelector(rootSelector),
            threshold: 0.5,
          }
        )
      }

      if (!talentList.length) return
      const query = (s) => {
        return Array.from(document.querySelectorAll(s))
      }

      query(selector).forEach((item) => {
        this.observer.observe(item)
      })
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

export const uidUploader = (uid) => {
  const now = new Date().getTime()
  if (!uidsMap.get(uid) || uidsMap.get(uid) < now) {
    uploadUids(uid)
  }
}
