## what is it?
这个小Demo是用于将获取到的json文件调用Google的geocoding api翻译为中文，并输出一个csv的文件


## How to run？
```$xslt
 node google-geocoding-api.js
```

## Google MAPS API
https://developers.google.com/maps/web-services/

### Google Auth
可以使用两种验证方式：
- 第一种： clientId + security key
- 第二种： Api key

### Google Geocoding API
详细使用参考：
https://developers.google.com/maps/documentation/geocoding/intro

### 返回值
``` json
{
   "results" : [
      {
         "address_components" : [
            {
               "long_name" : "1600",
               "short_name" : "1600",
               "types" : [ "street_number" ]
            },
            {
               "long_name" : "Amphitheatre Pkwy",
               "short_name" : "Amphitheatre Pkwy",
               "types" : [ "route" ]
            },
            {
               "long_name" : "Mountain View",
               "short_name" : "Mountain View",
               "types" : [ "locality", "political" ]
            },
            {
               "long_name" : "Santa Clara County",
               "short_name" : "Santa Clara County",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "California",
               "short_name" : "CA",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            },
            {
               "long_name" : "94043",
               "short_name" : "94043",
               "types" : [ "postal_code" ]
            }
         ],
         "formatted_address" : "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
         "geometry" : {
            "location" : {
               "lat" : 37.4224764,
               "lng" : -122.0842499
            },
            "location_type" : "ROOFTOP",
            "viewport" : {
               "northeast" : {
                  "lat" : 37.4238253802915,
                  "lng" : -122.0829009197085
               },
               "southwest" : {
                  "lat" : 37.4211274197085,
                  "lng" : -122.0855988802915
               }
            }
         },
         "place_id" : "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
         "types" : [ "street_address" ]
      }
   ],
   "status" : "OK"
}

```


## Google places API
### Google Place Search API
这个其实看上去也不错，还没有试验。不知道情况如何，比起Geocoding的api，这个会多一些，地点详情和图片

https://developers.google.com/places/web-service/search

### Quota 配额
Google map api have usage limits, refer to the link below: 
https://developers.google.com/maps/documentation/geocoding/usage-limits

```
Main important is:
2,500 free requests per day, calculated as the sum of client-side and server-side queries.
50 requests per second, calculated as the sum of client-side and server-side queries.
```

so we handle this by set a timer send Google api call 50 requests per second.

## Issue
最初是希望使用Google的translate API去实现文字的翻译，但是需要试用Google的Cloud platform的，我的信用卡不能注册试用，就无法使用translate API
但是发现在geocoding Api也是可以翻译中文的，只不过翻译的效果就是不太理想