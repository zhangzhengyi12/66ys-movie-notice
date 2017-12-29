
const URI = 'http://api.laoliuscript.tk/api/getNewMovie'

function _showDataOnPage(id, data, link) {
  //显示一个桌面通知
  if (window.webkitNotifications) {
    var notification = window.webkitNotifications.createNotification('images/icon16.png', '我是标题', data)
    notification.show()
    setTimeout(function() {
      notification.cancel()
    }, 5000)
  } else if (chrome.notifications) {
    var opt = {
      type: 'basic',
      title: '66ys资源更新提醒工具',
      message: data,
      iconUrl: 'images/66ys.png'
    }
    chrome.notifications.create('', opt, function(id) {
      chrome.notifications.onClicked.addListener(function() {
        chrome.notifications.clear(id)
        window.open(link) //optional
      })

      setTimeout(function() {
        chrome.notifications.clear(id)
      }, 5000)
    })
  } else {
  }
}

function ajaxPromisify(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'http://api.laoliuscript.tk/api/getNewMovie',
      success: resolve
    })
  })
}



function updateLocalStorge(data) {
  let lastData = localStorage.movie ? JSON.parse(localStorage.movie) : {time:null,list:[{title:''}]}
  if (lastData.list[0].title != data.list[0].title) {
    lastData.movie = JSON.stringify(data)
    _showDataOnPage('有新电影了')
  }
  return data
}

function stringify(obj) {
  return JSON.stringify(obj) 
}


function check() {
  ajaxPromisify(URI).then(res => {
    updateLocalStorge(res)
  })
}



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message === 'NEW') {
    ajaxPromisify(URI).then(res => {
      _showDataOnPage(100, '数据已刷新', 'www.laoliuscript.tk')
    })
  }
})

check()

setInterval(check, 108000) // 10分钟自动检查
