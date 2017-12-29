const refreshMoviesFormServer = compose(appendToContainer, creatElement, updateLocalStorge)
const refreshMoviesFormLocal = compose(appendToContainer, creatElement, getLocalData)
const URI = 'http://api.laoliuscript.tk/api/getNewMovie'



function updateLocalStorge(data) {
  let lastData = localStorage.movie ? JSON.parse(localStorage.movie) : { time: null }
  if (lastData.time !== data.time) {
    localStorage.movie = JSON.stringify(data)
  }
  return data
}



function getLocalData() {
  return localStorage.movie ? JSON.parse(localStorage.movie) : null
}

function sendRequest(type) {
  chrome.runtime.sendMessage(type, function(response) {})
}

function appendToContainer(ele) {
  $('.container')
    .html('')
    .append(ele)
}

function creatElement(data) {
  let result = $('<div></div>')
  let list = $('<ul></ul>')
  let updateTips = $(`<span>服务器更新于 ${new Date(data.time).Format('MM-dd HH:mm')}</span>`)
  result.append(updateTips)
  data.list.forEach(item => {
    const li = $(`
    <li>
    <a href='${item.link}' target="_blank"><img src='${item.imgSrc}'/></a>
    <a href='${item.link}'>${item.title}</a>
    </li>
    `)
    list.append(li)
  })
  result.append(list)
  return result
}

function ajaxPromisify(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'http://api.laoliuscript.tk/api/getNewMovie',
      success: resolve
    })
  })
}

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

Date.prototype.Format = function(fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "H+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}



$('.refresh').on('click', () => {
  ajaxPromisify(URI).then(res => {
    refreshMoviesFormServer(res)
    sendRequest('NEW')
  })
})

// get data from local

function tryRefreshFormLocal() {
  if (getLocalData() === null) {
    refreshMoviesFormServer()
  } else {
    refreshMoviesFormLocal()
  }
}

tryRefreshFormLocal()




