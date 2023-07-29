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