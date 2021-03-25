import * as R from 'ramda'

class Broadcast {
  constructor() {
    this.broadcasts = {}
  }

  bind = (name, callback) => {
    if (!name || !callback || !R.is(Function, callback)) {
      // eslint-disable-next-line no-console
      console.log('绑定广播时，参数传入错误')
      return
    }

    if (!this.broadcasts[name]) {
      this.broadcasts[name] = []
    }

    this.broadcasts[name].push(callback)
  }

  unbind = (name, callback) => {
    if (!name || !callback || !R.is(Function, callback)) {
      // eslint-disable-next-line no-console
      console.log('解除广播时，参数传入错误')
      return
    }

    if (!this.broadcasts[name]) {
      return
    }

    const index = this.broadcasts[name].findIndex(R.equals(callback))

    if (index < 0) {
      return
    }

    this.broadcasts[name] = R.remove(index, 1, this.broadcasts[name])
  }

  send = (name, param) => {
    if (this.broadcasts[name]) {
      this.broadcasts[name].forEach((callback) => {
        callback(param)
      })
    }
  }

  getAll = () => {
    return this.broadcasts
  }
}

export default Broadcast
