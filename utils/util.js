import moment from './moment.js'


function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatRelativeTime = function(timestamp){
  let date = moment(timestamp).fromNow(true).toString().replace('hours', '小时前').replace('minutes','分钟前').
    replace('seconds', '秒前').replace(/months?/, '月前').replace(/days?/, '日前').replace(/years?/, '年前')
  return date
}

module.exports = {
  formatTime: formatTime,
  formatRelativeTime
}
