const { Promise } = require('../src/index.js')

// const pro = new Promise2((resolve, reject) => {
//   console.log(1);
//   setTimeout(() => {
//     console.log(2);
//     resolve(2)
//   }, 1000)
// }).then(res => {
//   console.log(1212, res);
// })

// const pro = new Promise2((resolve, reject) => {
//   console.log(1);
//   resolve(222)
// }).then(res => {
//   console.log(1212, res);
// })


// const promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('成功');
//   },1000);
// }).then(
//   (data) => {
//     console.log('success', data)
//   },
//   (err) => {
//     console.log('faild', err)
//   }
// )

const promise = new Promise((resolve, reject) => {
  // reject('失败');
  resolve('123')
})
  .then()
  .then(res => {
    console.log({ res });
    return new Promise((s, j) => {
      setTimeout(() => {
        s(123123)
      }, 1000)
    })
  })
  .then(data => {
    console.log({ data });
  }, err => {
    console.log('err', err);
  })
