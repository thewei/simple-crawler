const configs = {
  domains: ['cnodejs.org'],
  scanUrls: ['https://cnodejs.org/?tab=all&page=1'],
  fields: [
    {
      // 抽取列表子顶
      name: 'article',
      selector: '#topic_list .cell',
      // required: true,
      children: [
        {
          // 抽取文章标题
          name: 'title',
          selector: '.topic_title'
        },
        {
          // 抽取文章链接
          name: 'url',
          selector: '.topic_title',
          contentType: 'attr',
          attr: 'href'
        }
      ]
    }
  ]
}

// configs.beforeCrawler = function (options) {
//   return new Promise(function (resolve, reject) {
//     resolve(options)
//   })
// }

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
