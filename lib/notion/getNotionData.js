import BLOG from '@/blog.config'
import axios from 'axios'
// import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { cacheAsync } from '@/lib/cache/cache_manager'
// import { getPostBlocks } from '@/lib/notion/getPostBlocks'
// import { idToUuid } from 'notion-utils'
import { deepClone } from '../utils'
// import { getAllCategories } from './getAllCategories'
// import getAllPageIds from './getAllPageIds'
// import { getAllTags } from './getAllTags'
// import getPageProperties from './getPageProperties'
import { mapImgUrl, compressImage } from './mapImage'

const api = axios.create({
  baseURL: 'https://api.example.com', // 设置API的基本URL
  timeout: 5000 // 设置请求超时时间
})

/**
 * 获取数据库信息
 * @param pageId 数据库Id
 */
/* eslint-disable no-unused-vars */
const getDataBaseInfo = async (pageId) => {
  const headers = {
    Authorization: 'Bearer secret_zHZc76hGCjVH08oW2qdAhva0w3MPP96B4WNY47PK3nN',
    'Notion-Version': '2022-06-28'
  }
  const response = await api.get(`https://api.notion.com/v1/databases/${pageId}`, { headers: headers })
  return response.data
}

/**
 * 获取文章列表
 * @param pageId 数据库Id
 */
/* eslint-disable no-unused-vars */
const getAllPost = async (pageId) => {
  const param = {
    page_size: 2
  }
  const headers = {
    Authorization: 'Bearer secret_zHZc76hGCjVH08oW2qdAhva0w3MPP96B4WNY47PK3nN',
    'Notion-Version': '2022-06-28'
  }
  await api.post(`https://api.notion.com/v1/databases/${pageId}/query`, param, { headers: headers })
  // console.log(response.data)
  return null
}

/**
 * 获取Notion的所有数据，外面调用Notion的入口
 * 1. 加载Notion数据库信息
 * 2. 分页加载Notion文章列表（Notion最多一次支持999条数据，所以需要分页加载）
 * 3. 进行数据提取，提取分类数据、tag数据。。。
 * 4. 进行缓存
 * e.g. category-paths
 * e.g. tag-static-path
 * e.g. tag-page-static-path
 * e.g. 404
 * e.g. archive-index
 * e.g. category-index-props
 * e.g. index
 * e.g. tag-index-props
 * e.g. search-props
 * @param pageId 页面Id
 * @param from 请求来源
 * @returns Notion的所有数据
 */
/* eslint-disable no-unused-vars */
async function getDataBaseInfoByNotionAPI({ pageId, from }) {
  console.log('----------------getDataBaseInfoByNotionAPI----------------', `pageId: ${pageId}`, `from: ${from}`)
  // 1. 读取 Notion 数据信息
  const database = await getDataBaseInfo(pageId)
  // getAllPost(pageId)
  // 2. 解析站点数据
  // getSiteInfo(database)
  // 3. 解析通告消息
  // 站点信息
  const siteInfo = {
    title: '搞笑 Gif',
    description: '探索编程的奥秘，成就卓越的代码之匠',
    pageCover: '/bg_image.jpg',
    icon: '/avatar.svg'
  }

  // 通告
  const notice = null

  // 文章列表
  const allPages = []

  const allNavPages = []

  const collection = ''

  const collectionQuery = ''

  const collectionId = ''

  const collectionView = ''

  const viewIds = ''

  const block = ''

  const schema = ''

  const tagOptions = []

  const categoryOptions = []

  const rawMetadata = []

  const customNav = []

  const customMenu = []

  const postCount = 10

  const pageIds = [1]

  const latestPosts = []

  return {
    notice,
    siteInfo,
    allPages,
    allNavPages,
    collection,
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
    block,
    schema,
    tagOptions,
    categoryOptions,
    rawMetadata,
    customNav,
    customMenu,
    postCount,
    pageIds,
    latestPosts
  }
}

/**
 * 获取指定notion的collection数据
 * @param pageId
 * @param from 请求来源
 * @returns {Promise<JSX.Element|*|*[]>}
 */
// export async function getNotionPageData({ pageId, from }) {
//   console.log(`getNotionPageData, pageId: ${pageId}, from: ${from}`)
//   const inuse = await getDataFromCache('getNotionPageData_inuse')
//   console.log(inuse)
//   if (inuse?.use) {
//     console.log(`getNotionPageData, pageId: ${pageId}, from: ${from} 未获取锁，睡眠1秒`)
//     await new Promise(resolve => setTimeout(resolve, 1000))
//     return getNotionPageData({ pageId, from })
//   }

//   try {
//     // 0. 申请互斥锁
//     console.log(`getNotionPageData, pageId: ${pageId}, from: ${from} 获取锁，执行耗时操作`)
//     setDataToCache('getNotionPageData_inuse', { use: true })

//     // 1. 先从缓存里面读取
//     const cacheKey = 'page_block_' + pageId
//     const data = await getDataFromCache(cacheKey)
//     if (data && data.pageIds?.length > 0) {
//       console.log('[缓存]:', `from:${from}`, `root-page-id:${pageId}`)
//       return data
//     }

//     // 2. 调用远程接口读取
//     const db = await getDataBaseInfoByNotionAPI({ pageId, from })

//     // 3. 存入缓存
//     if (db) {
//       setDataToCache(cacheKey, db)
//     }

//     return db
//   } finally {
//     // 4. 释放锁
//     console.log(`getNotionPageData, pageId: ${pageId}, from: ${from} 操作完毕，释放锁`)
//     delCacheData('getNotionPageData_inuse')
//   }
// }

// export async function getNotionPageData({ pageId, from }) {
//   // 1. 先从缓存里面读取
//   const cacheKey = 'page_block_' + pageId
//   const data = await getDataFromCache(cacheKey)
//   if (data && data.pageIds?.length > 0) {
//     console.log('[缓存]:', `from:${from}`, `root-page-id:${pageId}`)
//     return data
//   } else if (!data) {
//     // 第一个请求，锁定
//     setDataToCache(cacheKey, 'lock sending')
//   } else if (data === 'lock sending') {
//     // 已经发送请求数据还没回来，则等数据回来再返回
//     // return await waitingData()
//     setTimeout(getNotionPageData({ pageId, from }), 1000)
//     return
//   }
//   // 2. 调用远程接口读取
//   const db = await getDataBaseInfoByNotionAPI({ pageId, from })
//   // responseWaiting(db)
//   // 3. 存入缓存
//   if (db) {
//     setDataToCache(cacheKey, db)
//   } else {
//     setDataToCache(cacheKey, null)
//   }

//   return db
// }

export async function getNotionPageData({ pageId, from }) {
  cacheAsync(getDataBaseInfoByNotionAPI, { symbol: 'any' })
}
/**
 * 获取博客数据
 * @param {*} pageId 页面Id
 * @param {*} from   请求来源
 * @param latestPostCount 截取最新文章数量
 * @param categoryCount
 * @param tagsCount 截取标签数量
 * @param pageType 过滤的文章类型，数组格式 ['Page','Post']
 * @returns
 *
 */
export async function getGlobalData({ pageId = BLOG.NOTION_PAGE_ID, from }) {
  // 从notion获取
  const db = deepClone(await getNotionPageData({ pageId, from }))
  // 不返回的敏感数据
  delete db.block
  delete db.schema
  delete db.rawMetadata
  delete db.pageIds
  delete db.viewIds
  delete db.collection
  delete db.collectionQuery
  delete db.collectionId
  delete db.collectionView
  return db
}

/**
 * 站点信息
 * @param notionPageData
 * @param from
 * @returns {Promise<{title,description,pageCover,icon}>}
 */
function getSiteInfo(collection) {
  const title = collection?.title?.[0].plain_text || BLOG.TITLE
  const description = collection?.description ? Object.assign(collection).description[0].plain_text : BLOG.DESCRIPTION
  const pageCover = collection?.cover ? mapImgUrl(collection?.cover?.external.url) : BLOG.HOME_BANNER_IMAGE
  let icon = collection?.icon ? mapImgUrl(collection.icon.emoji, collection, 'collection') : BLOG.AVATAR

  // 用户头像压缩一下
  icon = compressImage(icon)

  // 站点图标不能是emoji情
  const emojiPattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
  if (!icon || emojiPattern.test(icon)) {
    icon = BLOG.AVATAR
  }
  return { title, description, pageCover, icon }
}
