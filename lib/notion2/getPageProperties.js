import BLOG from '@/blog.config'
// import { getTextContent } from 'notion-utils'
import formatDate from '../formatDate'
// import { createHash } from 'crypto'
// import md5 from 'js-md5'
import { mapImgUrl } from './mapImage'
// const excludeProperties = ['date', 'select', 'multi_select', 'person']
/**
 * {
 *   id: 'e54928bc-73b8-477d-a088-e7da8194aa63',
 *   date: { start_date: '2021-07-02' },
 *   type: 'Notice',
 *   slug: '#',
 *   summary: '类型为Notice的文章将被显示为公告，仅 hexo和next支持；仅限一个公告',
 *   title: '公告',
 *   status: 'Published',
 *   publishDate: 1625184000000,
 *   publishTime: '2021-7-2',
 *   lastEditedTime: '2023-7-17',
 *   fullWidth: false,
 *   pageIcon: '📔',
 *   pageCover: '',
 *   pageCoverThumbnail: '',
 *   tagItems: [],
 *   password: '',
 *   blockMap: {
 *     block: {
 *       'e54928bc-73b8-477d-a088-e7da8194aa63': [Object],
 *       '395cd28c-4c9b-4428-88de-c72d8090372b': [Object],
 *       'cfc9a844-a4f3-4799-8fb8-4213fe9f7422': [Object],
 *       '77821b2e-80f4-4cd5-9453-f78a02ba1085': [Object],
 *       '29030eb2-ec42-4f63-8a95-0930dc010875': [Object],
 *       '17cb60f0-ba8d-4e5f-9fba-0b811ee75045': [Object],
 *       '04ba90c1-1ce1-41ac-8a1c-372527f6fbbd': [Object],
 *       'ce4ce1af-525b-4594-a148-5346def242f6': [Object],
 *       '84ec803a-a87a-48da-8275-c0216fea0081': [Object]
 *     },
 *     collection: { 'a11bbb23-3346-4bc6-9917-018e50988f8c': [Object] },
 *     space: {},
 *     collection_view: {
 *       'ab3d732e-a8a5-42a8-bd24-c02af35af9e4': [Object],
 *       '1670ff0d-25f3-4759-945a-9230a0b2c157': [Object],
 *       'e07df880-25fc-45ba-81e0-39ed9b85f64c': [Object],
 *       '5425ce5f-d3b9-4f92-bcba-fe5cb193e9f7': [Object]
 *     },
 *     notion_user: {},
 *     collection_query: {},
 *     signed_urls: {}
 *   }
 * }
 */
export default async function getPageProperties(collection) {
  const posts = []
  collection.forEach(item => {
    const post = {}
    posts.push(post)
    // 1. id
    post.id = item.id
    // 2. date
    post.date = { start_date: item.properties.date.date?.start }
    // 3. type
    post.type = item.properties.type?.select?.name || null
    // 4. slug
    post.slug = item.properties.slug.rich_text[0]?.plain_text || ''
    // 5. summary
    post.summary = item.properties.summary.rich_text[0]?.plain_text || ''
    // 6. title
    post.title = item.properties.title?.title ? item.properties.title?.title[0]?.plain_text : ''
    // 7. status
    post.status = item.properties.status?.select?.name || null
    // 8. publishDate
    post.publishDate = new Date(item.properties?.date?.start_date || item.created_time).getTime()
    // 9. publishTime
    post.publishTime = formatDate(post.publishDate, BLOG.LANG)
    // 10. lastEditedTime
    post.lastEditedTime = formatDate(new Date(item.last_edited_time), BLOG.LANG)
    // 11. fullWidth
    post.fullWidth = false
    // 12. pageIcon
    post.pageIcon = ''
    // 13. pageCover
    post.pageCover = mapImgUrl(item.cover?.external?.url) ?? ''
    // 14. pageCoverThumbnail
    post.pageCoverThumbnail = mapImgUrl(item.cover?.external?.url, 'block', 'pageCoverThumbnail') ?? ''
    // 15. tags tagItems?
    post.tags = item.properties.tags.multi_select.map(item => item.name) || []
    post.tagItems = item.properties?.tags?.multi_select || []
    // 16. category categoryItems
    post.category = [item.properties.category?.select?.name].filter(Boolean)
    post.categoryItems = [item.properties.category?.select].filter(Boolean)
    // 16. password
    post.password = ''
    // 17. notion_user
    post.notion_user = {}
    // 18. collection_query
    post.collection_query = {}
    // 19. signed_urls
    post.signed_urls = {}
  })
  return posts
}

// /**
//  * 映射用户自定义表头
//  */
// function mapProperties(properties) {
//   if (properties?.type === BLOG.NOTION_PROPERTY_NAME.type_post) {
//     properties.type = 'Post'
//   }
//   if (properties?.type === BLOG.NOTION_PROPERTY_NAME.type_page) {
//     properties.type = 'Page'
//   }
//   if (properties?.type === BLOG.NOTION_PROPERTY_NAME.type_notice) {
//     properties.type = 'Notice'
//   }
//   if (properties?.status === BLOG.NOTION_PROPERTY_NAME.status_publish) {
//     properties.status = 'Published'
//   }
//   if (properties?.status === BLOG.NOTION_PROPERTY_NAME.status_invisible) {
//     properties.status = 'Invisible'
//   }
// }

// /**
//  * 获取自定义URL
//  * @param {*} postProperties
//  * @returns
//  */
// function generateCustomizeUrl(postProperties) {
//   let fullPrefix = ''
//   const allSlugPatterns = BLOG.POST_URL_PREFIX.split('/')
//   allSlugPatterns.forEach((pattern, idx) => {
//     if (pattern === '%year%' && postProperties?.publishTime) {
//       const formatPostCreatedDate = new Date(postProperties?.publishTime)
//       fullPrefix += formatPostCreatedDate.getUTCFullYear()
//     } else if (pattern === '%month%' && postProperties?.publishTime) {
//       const formatPostCreatedDate = new Date(postProperties?.publishTime)
//       fullPrefix += String(formatPostCreatedDate.getUTCMonth() + 1).padStart(2, 0)
//     } else if (pattern === '%day%' && postProperties?.publishTime) {
//       const formatPostCreatedDate = new Date(postProperties?.publishTime)
//       fullPrefix += String(formatPostCreatedDate.getUTCDate()).padStart(2, 0)
//     } else if (pattern === '%slug%') {
//       fullPrefix += (postProperties.slug ?? postProperties.id)
//     } else if (!pattern.includes('%')) {
//       fullPrefix += pattern
//     } else {
//       return
//     }
//     if (idx !== allSlugPatterns.length - 1) {
//       fullPrefix += '/'
//     }
//   })
//   if (fullPrefix.startsWith('/')) {
//     fullPrefix = fullPrefix.substring(1) // 去掉头部的"/"
//   }
//   if (fullPrefix.endsWith('/')) {
//     fullPrefix = fullPrefix.substring(0, fullPrefix.length - 1) // 去掉尾部部的"/"
//   }
//   return `${fullPrefix}/${(postProperties.slug ?? postProperties.id)}`
// }
