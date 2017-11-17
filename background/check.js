function compose(...fns) {
  return function composed(result) {
    // 拷贝一份保存函数的数组
    var list = fns.slice()

    while (list.length > 0) {
      // 将最后一个函数从列表尾部拿出
      // 并执行它
      result = list.pop()(result)
    }

    return result
  }
}

function _showDataOnPage(id, data, link) {
  //显示一个桌面通知
  if (window.webkitNotifications) {
    var notification = window.webkitNotifications.createNotification(
      'images/icon16.png',
      '我是标题',
      data
    )
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
      url: 'http://www.hao6v.com/gvod/zx.html',
      success: resolve
    })
  })
}

function getListDOMText(DOMText) {
  let getList = /<ul class="list" style="border:0;">([\s\S]*)<\/ul>/i
  return DOMText.match(getList)
}

function updateLocalStorge(DOMText) {
  let lastData = localStorage.movie ? localStorage.movie : ''
  if (DOMText != lastData) {
    localStorage.movie = DOMText
    _showDataOnPage(100, '有新电影更新拉！', 'http://www.6vhao.com')
  }
  return DOMText
}

let composeManage = compose(updateLocalStorge, getListDOMText)

function check() {
  ajaxPromisify('http://www.hao6v.com/gvod/zx.html').then(res => {
    composeManage(res)
  })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message === 'NEW') {
    ajaxPromisify('http://www.hao6v.com/gvod/zx.html').then(res => {
      _showDataOnPage(100, '数据已刷新', 'www.laoliuscript.tk')
      chrome.runtime.sendMessage(composeManage(res), function(response) {})
    })
  } else if (message === 'OLD') {
    chrome.runtime.sendMessage(localStorage.movie, function(response) {})
  }
})

check()

setInterval(check, 600000) // 10分钟自动检查
