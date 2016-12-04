// import CookieManager from 'react-native-cookies'

const configs = {
  domains: ['v2ex.com'],
  scanUrls: ['https://www.v2ex.com/recent'],
  fields: [
    {
      // 抽取列表子顶
      name: 'article',
      selector: '#Main .box .item.cell',
      // required: true,
      children: [
        {
          // 抽取文章标题
          name: 'title',
          selector: '.item_title>a'
        },
        {
          // 抽取文章链接
          name: 'url',
          selector: '.item_title>a',
          contentType: 'attr',
          attr: 'href',
          regex: '/^\\/t\\/(.+)(#reply(.+))/'
        }
      ]
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

    resolve(options)

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
  })
}

// afterExtractField回调函数
configs.afterExtractField = function (fieldName, data, extractedFields) {
  return new Promise(function (resolve, reject) {
    resolve(data)
  })
}

configs.afterExtractPage = function (data) {
  return new Promise(function (resolve, reject) {
    const result = data.article || []
    resolve(result)
  })
}

export default configs
