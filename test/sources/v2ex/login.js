const configs = {
  domains: ['v2ex.com'],
  scanUrls: ['https://v2ex.com/signin'],
  fields: []
}

var CookieManager = require('react-native-cookies')

configs.afterDownloadPage = function ($, responseData, response) {
  return new Promise(function (resolve, reject) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'v2ex.com',
        Origin: 'http://v2ex.com',
        Referer: 'http://v2ex.com/signin',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36'
      }
    }
    const inputEl = $('input')
    const username = inputEl[1].attribs.name
    const password = inputEl[2].attribs.name
    const once = inputEl[3].attribs.value

    let formData = new FormData()
    formData.append(username, '')
    formData.append(password, '')
    formData.append('once', once)
    formData.append('next', '/')
    options.body = formData

    // Get cookies as a request header string
    CookieManager.get('https://v2ex.com/signin', (err, res) => {
      if (err) console.log(err)
      // console.log('Got cookies for url', res)
      let cookie = ''
      Object.keys(res).map(item => {
        cookie += item + '=' + res[item] + ';'
      })
      // Outputs 'user_session=abcdefg; path=/;'
      options.headers['Cookie'] = cookie
      // console.log(cookie)
      fetch('https://v2ex.com/signin', options)
        .then((response) => response.text())
        .then((responseData) => {
          console.log(responseData)
          resolve($)
        })
        .catch((error) => {
          reject(error)
        })
    })
  })
}

export default configs
