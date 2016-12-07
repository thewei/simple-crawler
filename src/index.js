import "isomorphic-fetch"
import cheerio from 'cheerio-without-node-native'
import getUa from './utils/ua'

export default class Crawler {
  constructor(props) {
    this.configs = props
  }
  async start () {
    /**
     * 爬虫初始化时调用, 用来指定一些爬取前的操作
     * 比如覆盖默认设置
     */
    this.configs.headers = getUa(this.configs.domains[0], this.configs.scanUrls[0])
    if (this.configs.beforeCrawler) {
      try {
        const opts = await this.configs.beforeCrawler(this.configs)
        this.configs = Object.assign(this.configs, opts)
      } catch (e) {
        console.error(e)
      }
    }

    return new Promise((resolve, reject) => {
      // 遍历入口 url 开始爬取
      this.configs.scanUrls.map(async url => {
        try {
          let fetchOptions = this.configs.fetchOptions || {}
          const response = await fetch(url, fetchOptions)
          const responseData = await response.text()
          let $ = cheerio.load(responseData)
          /**
           * 在一个网页下载完成之后调用
           * 主要用来对下载的网页进行处理
           */
          if (this.configs.afterDownloadPage) {
            try {
              $ = await this.configs.afterDownloadPage($, response)
            } catch (e) {
              console.error(e)
            }
          }
          // 处理抓取的字段
          let data = await this.getFields(this.configs.fields, $)
          /**
           * field抽取完成之后
           * 可能需要对field进一步处理
           */
          if (this.configs.afterExtractPage) {
            try {
              data = await this.configs.afterExtractPage(data)
            } catch (e) {
              console.error(e)
            }
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
          /**
           * 当一个field的内容被抽取到后进行的回调
           * 在此回调中可以对网页中抽取的内容作进一步处理
           */
          if (this.afterExtractField) {
            try {
              data[field.name] = await this.configs.afterExtractField(
                field.name,
                data[field.name],
                data
              )
            } catch (e) {
              console.error(e)
            }
          }
        }
      })
      resolve(data)
    })
  }
}
