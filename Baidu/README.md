## what is it?
这个小Demo是用于将获取到的json文件(所有的大学)调用Google的geocoding api获取经纬度，同时再调用Baidu的API获取大学，州的中文翻译，并输出最终组合输出一个csv的文件


## How to run？
``` bash
 node baidu-translate-api.js
```

## Baidu Translate API

详细使用参考：
http://api.fanyi.baidu.com/api/trans/product/apidoc

### 返回值
``` json
{
    from: "en",
    to: "zh",
    trans_result: [{
        src: "apple",
        dst: "苹果"
    }]
}

```
### Quota 配额

若当月翻译字符数≤2百万，当月免费；若超过2百万字符，按照49元/百万字符支付当月全部翻译字符数费用

## Issue
百度的翻译其实还可以