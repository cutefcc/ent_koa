/**
 * broadcast between different tabs or windows
 * author: jxintang
 */

const attachedMap = new Map();
/**
 * 随机生成uuid（时间和随机数）
 * @returns {String} buuid 浏览器uuid，一共36位，我们统一去掉中横线, 并转换为小写
 */
function uuid() {
  var d = Date.now();
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now(); // 通过performance来提高精准度
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    })
    .replace(/-/g, '');
}

/**
 * send broadcast. you can send objects like { 'name': 'doit', 'data': 'abcd' }
 * @param {String} name name
 * @param {Object} data message (name/uid/data)
 * @return {String} mode all/iframe todo parent
 */
module.exports.send = function(name, data, mode = 'all') {
  if (!name || !data) {
    throw new Error('name and data is required in msg');
  }

  let bd = { close: () => {} }; // user can close a broadcast himselft for underlying channel
  let parent_uid;
  if (mode === 'iframe') {
    parent_uid = window.parent.tab_uid;
  }

  if ('BroadcastChannel' in window) {
    const broadcast = new BroadcastChannel(name);
    broadcast.postMessage(Object.assign({}, data, { parent_uid }));
    bd = broadcast; // to leave a specific channel
  } else {
    const message = Object.assign(
      {},
      { name, data },
      {
        // make sure that every broad cast is unique,
        // and send the exact same message twice will be propagated only once,
        // so if you need to repeat messages, and this uid will do the right thing as expect
        uid: uuid(),
        parent_uid,
      }
    );
    localStorage.setItem('message', JSON.stringify(message));
    localStorage.removeItem('message');
  }

  return bd;
};

/**
 * receive broadcast
 * @param {Object} ev event
 * @param {String} name message name
 * @param {Object} message message object
 * @param {Function} callback callback
 */
const receiveMsg = function(name, message, callback) {
  if (!message) return; // ignore empty msg or msg reset
  if (message.name !== name) return; // ignore different name

  // here you act on messages.
  if (message.name && message.data && typeof callback === 'function') {
    callback(message.data);
  }
};

/**
 * parse message
 * @param {String} jsonStr
 */
const parseMsg = function(jsonStr) {
  let message = {};
  try {
    message = JSON.parse(jsonStr);
  } catch (err) {
    console.log(err);
  }

  return message;
};

/**
 * receive data
 * @param {String} name broadcast name
 * @param {Function} callback
 */
module.exports.receive = function(name, callback) {
  if (!name) throw new Error('name is required!');
  let bd = { close: () => {} }; // user can close a broadcast himselft for underlying channel
  let message = {};

  if ('BroadcastChannel' in window) {
    const broadcast = new BroadcastChannel(name);
    broadcast.onmessage = ev => {
      message = ev.data;
      if (message.parent_uid && message.parent_uid !== window.tab_uid) return; // ignore different tab when 'iframe' mode

      typeof callback === 'function' && callback(message);
    };
    bd = broadcast; // to leave a specific channel
  } else {
    if (!attachedMap.get(name)) {
      attachedMap.set(name, true);
      window.addEventListener('storage', ev => {
        if (ev.key != 'message' || ev.newValue === null) return; // ignore other keys

        message = parseMsg(ev.newValue);
        if (message.parent_uid && message.parent_uid !== window.tab_uid) return; // ignore different tab when 'iframe' mode
        receiveMsg(name, message, callback);
      });
    }
  }

  return bd;
};
