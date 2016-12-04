import test from 'ava';
import Crawler from '../dist/index'
import v2exDetail from './sources/v2ex/detail'

test('get detail', t => {
  const crawler = new Crawler(v2exDetail)
  crawler.start().then(function (res) {
    console.log('detail', res)
  })
  t.pass();
});
