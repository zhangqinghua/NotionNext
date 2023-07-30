// import { isIterable } from '../utils'

/**
 * 获取所有文章的标签
 * @param allPosts
 * @param sliceCount 默认截取数量为12，若为0则返回全部
 * @param tagOptions tags的下拉选项
 * @returns {Promise<{}|*[]>}
 */

/**
 * 获取所有文章的分类（待优化）
 * @param allPosts
 * @returns {Promise<{}|*[]>}
 */
export function getAllCategories({ database, allPosts, sliceCount = 0 }) {
  if (!allPosts) {
    return []
  }
  // 计数
  let tags = allPosts?.map(p => p.categoryItems)
  tags = [...tags.flat()]

  let list = database.properties.category.select.options
  tags.forEach(tag => {
    const obj = list.find(item => item.id === tag.id)
    if (!obj) {
      list.push({ id: tag.id, name: tag.name, color: tag.color, count: 1 })
    } else {
      if (!obj.count) obj.count = 0
      obj.count += 1
    }
  })
  // 筛选掉没有文章的分类
  list = list.filter(item => item.count && item.count > 0)
  // 按照数量排序
  // list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount)
  } else {
    return list
  }
}
