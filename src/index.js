import cheerio from 'cheerio-without-node-native'

export default class Crawler {
  constructor (props) {
    this.options = props.options || {}
    this.domains = props.domains
    this.scanUrls = props.scanUrls
    this.fields = props.fields
    // 爬虫初始化时调用, 用来指定一些爬取前的操作
    this.beforeCrawler = props.beforeCrawler
    // 在一个网页下载完成之后调用. 主要用来对下载的网页进行处理.
    this.afterDownloadPage = props.afterDownloadPage
    // 当一个field的内容被抽取到后进行的回调, 在此回调中可以对网页中抽取的内容作进一步处理
    this.afterExtractField = props.afterExtractField
    // field抽取完成之后, 可能需要对field进一步处理
    this.afterExtractPage = props.afterExtractPage
  }
  async start (options = {}) {
    options = {
      ...this.options,
      options
    }
    // 预处理
    if (this.beforeCrawler) {
      options = await this.beforeCrawler(options)
    }

    return new Promise((resolve, reject) => {
      this.scanUrls.map(async scanUrl => {
        try {
          let fetchOptions = options.fetchOptions || {}
          const response = await fetch(scanUrl, fetchOptions)
          const responseData = await response.text()
          const $ = cheerio.load(responseData)
          let page = $
          if (this.afterDownloadPage) {
            page = await this.afterDownloadPage($, responseData, response)
          }
          // 处理抓取的字段
          const res = await this.getFields(this.fields, page)
          let data = res
          if (this.afterExtractPage) {
            data = await this.afterExtractPage(data)
          }
          // 返回结果
          resolve(data)
        } catch (error) {
          reject(error)
        }
      })
    })
  }
  // TODO: promise 递归
  getFields (fields, $, node, i) {
    return new Promise((resolve, reject) => {
      const data = {}
      fields.map(async field => {
        const selector = node ? $(node).find(field.selector) : $(field.selector)
        if (!selector.length) {
          return
        }
        if (field.children) {
          data[field.name] = []
          selector.map(async (index, selectorChild) => {
            data[field.name].push(await this.getFields(field.children, $, selectorChild, index))
          })
        } else {
          switch (field.contentType) {
            case 'html':
              data[field.name] = selector.html()
              break
            case 'attr':
              data[field.name] = selector.attr(field.attr)
              break
            default:
              data[field.name] = selector.text()
              break
          }
          if (this.afterExtractField) {
            data[field.name] = await this.afterExtractField(field.name, data[field.name], data)
          }
        }
      })
      resolve(data)
    })
  }
}
