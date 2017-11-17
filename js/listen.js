$('.refresh').on('click', () => {
  sendRequest('NEW')
})

function sendRequest(type) {
  chrome.runtime.sendMessage(type, function(response) {})
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  let movieDOM = $(`${message}`)
  movieDOM.find('div').remove()
  $('.container')
    .html('')
    .append(movieDOM)
})

sendRequest('OLD')
