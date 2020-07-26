// Promise的三个状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

const resolvePromise = (promise2, x, resolve, reject) => {
  // 自己等待自己完成是错误的实现，结束promise
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }

  let called
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }
}



class Promise {
  constructor(executor) {
    // 默认状态为PENDING
    this.status = PENDING
    // 成功之后存放成功状态的值
    this.value = undefined
    // 存放失败的状态的值
    this.reason = undefined
    // 存放成功之后的回调
    this.onResolvedCallbacks = []
    // 存放失败的回调
    this.onRejectedCallbacks = []


    // 切换状态为成功
    let resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        // 将对应的函数执行
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    // 切换状态到失败
    let reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        // 将对应的函数执行
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    // 立即执行执行器函数
    try {
      executor(resolve, reject)
    } catch (error) {
      // 发生异常时执行失败逻辑
      reject(error)
    }
  }


  then(onFulfilled, onRejected) {
    // 解决onFulfilled,onRejected没有传值的问题
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }

    // 每次调用.then都返回一个新的Promise
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            // x可能是个promise
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)

      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
}
module.exports = {
  Promise
}
