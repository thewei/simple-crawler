const test = require('ava');
const Crawler = require('../src/index').default
const v2exDetail = require('./sources/v2ex/detail').default

test('get detail', async t => {
  const crawler = new Crawler(v2exDetail)
  const res = await crawler.start()
  console.log('detail', res)
  t.pass();
});
