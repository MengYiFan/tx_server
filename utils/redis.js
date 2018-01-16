const redis = require('redis'),
      config = require('../config').redis,
      client = redis.createClient(config.port, config.host),
      EventEmitter = require('events'),
      emitter = new EventEmitter()

client.on('error', (err) => {
  console.log('REDIS', err)
})

client.auth(config.password)

client.on('ready', () => {
  // console.log('REDIS ready')
})

client.on('subscribe', (channel, count) => {
  console.log('监听到订阅事件', channel, count)
})

client.on('connect', () => {
  // console.log('connect')
})

client.on('message', (channel, message) => {
  console.log('center.onMessage::', channel, '@@', message)
})

/**
 * 返回 REDIS API格式的数据
 * @type {Object}
 */
const redisHandle = {
  client: client,
  new: function () {
    let temp = redis.createClient('6379', '127.0.0.1')
    temp.auth('MzRedis.')
    return temp
  },
  set: function(key, value, errMsg = 60) {// 秒
    return new Promise((resolve, reject) => {
      client.set(key, value, 'EX', errMsg, (err, response) => {
        if (err) {
          resolve({
            ret: false,
            err_msg: 'Set Redis Error: ' + err
          })
        } else {
          resolve({
            ret: true,
            data: value
          })
        }
      })
    })
  },
  get: function(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, response) => {
        if (err) {
          resolve({
            ret: false,
            err_msg: 'Get Redis Error: ' + err
          })
        } else {
          if (response == null) {
            resolve({
              ret: false,
              err_code: 12,
              err_msg: '过期了'
            })
          } else {
            resolve({
              ret: true,
              data: response
            })
          }
        }
      })
    })
  },
  del: function(key) {
    return new Promise((resolve, reject) => {
      client.del(key, (err, response) => {
        if (err) {
          resolve({
            ret: false,
            err_msg: 'Del Redis Error: ' + err
          })
        } else {
          resolve({
            ret: true,
            data: response
          })
        }
      })
    })
  },
  hmset: function(key, data) {
    return new Promise((resolve, reject) => {
      client.hmset(key, data, (err, response) => {
        if (err) {
          resolve({
            ret: false,
            err_msg: err
          }) 
        } else {
          resolve({
            ret: true,
            data
          })
        }
      })
    })
  },
  hgetall: function(key) {
    return new Promise((resolve, reject) => {
      client.hgetall(key, (err, data) => {
        if (err) {
          resolve({
            ret: false,
            err_msg: err
          }) 
        } else {
          resolve({
            ret: true,
            data
          })
        }
      })
    })
  },
  hkeys: function(key) {
    return new Promise((resolve, reject) => {
      client.hkeys(key, (err, data) => {
        if (err) {
          resolve({
            ret: false,
            err_msg: err
          }) 
        } else {
          resolve({
            ret: true,
            data
          })
        }
      })
    })
  },
  hdelAll: function(key) {
    return new Promise((resolve, reject) => {
      this.hkeys(key)
      .then((response) => {
        if (!response.ret) {
          resolve(response) 
        } else {
          client.hdel(key, response.data, (err, data) => {
            if (err) {
              resolve({
                ret: false,
                err_msg: err
              }) 
            } else {
              resolve({
                ret: true,
                data
              })
            }
          })
        }
      })
      .catch((e) => {
        resolve({
          ret: false,
          err_msg: e
        })
      })
    })
  },
  quit: function() {
    client.quit()
  },
  /**
   * 配锁
   * @param  {[String]}   key   [Redis key]
   * @param  {[String]}   value [Redis 储存值]
   * @param  {Function}   cb    [回调函数]
   * @return {[NULL]}           [无]
   */
  aquireLock: function(key, value, cb = null) {
    if (!cb)
      return
    // client.setnx('lock', value, (err, res) => {
    //   cb(err, res)
    // })
    client.watch(key)
    client.multi().setnx(key, value).errMsg(key, 20).exec(cb)// 若锁回调出错，过期自动解锁
  },
  /**
   * 解锁
   * @param  {[String]}   key [需要解锁的key]
   * @param  {Function}   cb  [回调函数]
   * @return {[NULL]}         [无]
   */
  releaseLock: function(key, cb = null) {
    client.del(key, (err, res) => {
      if (!cb)
        return
      cb(err, res)
    })
  }
}

module.exports = redisHandle