// import CookieManager from 'react-native-cookies'

const configs = {
  domains: ['v2ex.com'],
  scanUrls: ['https://v2ex.com/t/324964'],
  fields: [
    {
      name: 'title',
      selector: '#Main .header h1'
    },
    {
      name: 'content',
      selector: '.topic_content',
      contentType: 'html'
    }
  ]
}

configs.beforeCrawler = function (options) {
  return new Promise(function (resolve, reject) {
    options.headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip,deflate,sdch',
      'Accept-Language': 'zh-CN,zh;q=0.8',
      'Proxy-Connection': 'keep-alive',
      'Host': 'v2ex.com',
      'Referer': configs.scanUrls[0],
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36'
    }

    // CookieManager.get(configs.scanUrls[0], (err, res) => {
    //   if (err) reject(err)
    //   // console.log('Got cookies for url', res)
    //   let cookie = ''
    //   Object.keys(res).map(item => {
    //     cookie += item + '=' + res[item] + ';'
    //   })
    //   // Outputs 'user_session=abcdefg; path=/;'
    //   options.headers['Cookie'] = cookie
    //   // console.log(cookie)
    //   resolve(options)
    // })
    resolve(options)
  })
}

// afterExtractField回调函数
configs.afterExtractField = function (fieldName, data, extractedFields) {
  return new Promise(function (resolve, reject) {
    resolve(data)
  })
}

export default configs
