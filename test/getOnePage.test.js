const test = require('ava');
const Crawler = require('../src/index').default
const v2exList = require('./sources/v2ex/list').default

let context = {}
test.before(async t => {
  const crawler = new Crawler(v2exList)
  context = await crawler.start()
});

test('返回文章列表长度大于0', t => {
  t.is(context.length > 0, true);
});

// test('DOM.text()', t => {
//   t.is(context.title, '[CSS] 了一个极简的多说评论框。');
// });

// test('DOM.html()', t => {
//   // 转义字符串
//   let content = unescape(context.content);
//   content = content.replace(/&#(x)?(\w+);/g,function($,$1,$2){
//     return String.fromCharCode(parseInt($2,$1?16:10));
//   });
//   t.is(content, '<a target="_blank" href="http://www.niudana.com/Guestbook/" rel="nofollow">http://www.niudana.com/Guestbook/</a>\r<br>\r<br>不知道有没有熟悉多说美化的朋友在，第一次给这东西弄 CSS ，一个属性一个属性的抠了几个小时才搞好，因为要重写很多他预置的样式。不明白为什么不能预置一个无样式的模版来自由发挥。');
// });
