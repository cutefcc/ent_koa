/* eslint-disable */
import * as qiniu from 'qiniu'
import request from 'utils/request'
import { EventEmitter } from 'events'
import { formateFileSize, formatSeconds } from './utils'

class Uploader extends EventEmitter {
  constructor(params) {
    super()
    this.initParams && this.initParams(params)
  }

  initParams(file, { cuid, xsize = 0, ysize = 0, duration = 0 } = {}) {
    const promise = new Promise((rosolve, reject) => {
      if (!!file && cuid) {
        this.qiniuOb = null
        this.fileInfo = {}
        // last uploaded data
        this.lastUploadedData = {
          uploadedSize: 0,
          time: new Date().getTime(),
        }
        this.runTime = {}
        this._getToken({
          fname: file.name,
          bytesize: file.size,
          fuid: cuid,
          xsize,
          ysize,
          duration,
        }).then(({ data }) => {
          const { result, data: fileInfo } = data
          if (result && result === 'ok') {
            this.fileInfo = {
              ...fileInfo,
              url: `https://t9.taou.com/${fileInfo.key}`,
            }
            this.qiniuOb = qiniu.upload(
              file,
              fileInfo.key,
              fileInfo.token,
              '',
              ''
            )
            rosolve('初始化成功')
          } else {
            reject('获取token失败')
          }
        })
      } else {
        // reject('未初始化完成')
      }
    })
    return promise
  }

  _next(response) {
    const { total = {} } = response
    const uploadedSize = total.loaded
    const diffTime = (new Date().getTime() - this.lastUploadedData.time) / 1000
    const uploadSpeed =
      (uploadedSize - this.lastUploadedData.uploadedSize) / diffTime
    this.runTime = {
      ...this.runTime,
      speed: uploadSpeed,
      frendlySpeed: formateFileSize(uploadSpeed) + '/s',
    }
    if (uploadSpeed !== 0) {
      let predictTime = (total.size - uploadedSize) / uploadSpeed
      this.runTime['predictTime'] = predictTime
      this.runTime['predictFrendlyTime'] = formatSeconds(predictTime)
    }
    this.emit('onProgress', {
      ...response,
      runTime: this.runTime,
      ...this.fileInfo,
    })
    this.lastUploadedData = {
      uploadedSize: uploadedSize,
      time: new Date().getTime(),
    }
    if (uploadedSize === total.size) {
      this.emit('onSuccessed', {
        ...response,
        runTime: this.runTime,
        ...this.fileInfo,
      })
    }
  }

  start(file, params) {
    this.initParams(file, params).then(() => {
      this.qiniuOb.subscribe(this._next.bind(this))
    })
  }

  cancel() {
    this.qiniuOb && this.qiniuOb.unsubscribe && this.qiniuOb.unsubscribe()
  }

  _getToken(payload) {
    return request('/bizjobs/company/manage/pre_upload_video', {
      query: {
        ...payload,
        channel: 'www',
        version: '1.0.0',
      },
    })
    // return request('/company/getToken', {
    //   query: {
    //     ...payload,
    //     channel: 'www',
    //     version: '1.0.0',
    //   },
    // })
  }
}
export default Uploader
