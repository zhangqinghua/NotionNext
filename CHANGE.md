## `[slug].js`
- 100101: 修改上一页/下一页算法 推荐关联文章处理(要求只查询同一个分类的)(先按日期排序，再按标题排序（经过测试无法对中文数字进行排序）)

## getNotionData
- 100102: 只展示今天之前的数据
- 100102: 修改排序算法（先按日期大小排序，再按中文排序）

## 2. 添加主题
/themes/fukasawa_01

#### ArticleDetail
- 100102: 没有内容，屏蔽封面图，然后用封面图作为内容 
#### AsideLeft
- 100103: 隐藏菜单栏 
- 100104: 隐藏搜索框 
- 100105: 隐藏RSS 
- 100106: 隐藏备案信息 
- 100107: 公告栏添加边框 
- 100108: 公告栏内容左靠齐 
- 100109: 暗黑按钮靠左对齐

## 3. 添加自定义样式
- public/css/custom.css 
- public/font/*

## 4. Notion API 改动
#### mapImage
- 不是封面，也一并压缩，900px
#### getPageProperties.js
全部
#### getNotionData
全部
#### getAllTages
全部
#### getAllCategory
全部

## 5. 缓存
#### local_file_cache
- 文件缓存持续10分钟
#### memory_manager.js
- 使用文件缓存，因为内存缓存好像有并发Bug

注意：有两处缓存，
1. 页面静态缓存，表示服务端渲染数据后，多久后才需要再次渲染。配置：NEXT_REVALIDATE_SECOND
2. Notion API 数据缓存，服务器渲染时需要Notion的数据，这些数据先从Notion API获取，然后缓存到内存中。参考：getNotionData, cache_manager

#### 解决方案
添加了 redis_cache

## 6. 定时任务
1. vercel.json
2. pages/api/cron.js

Notion数据全部从定时任务读取，服务端渲染时直接从缓存读取数据。因为 Vercel 只支持按天的定时任务，所以需要在部署的时候手工调用一些接口 /api/cron
后期想办法实现项目部署后，自动执行初始化数据任务

## 目前发现问题是
本地缓存数据变更了，页面要刷2次才能加载最新的数据。已经排除页面静态缓存的问题