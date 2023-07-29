/**
 * 从数据库（多个表格）里面解析出所有的文章Id
 * @param collectionQuery
 * {
 *   'a11bbb23-3346-4bc6-9917-018e50988f8c': {
 *     'e07df880-25fc-45ba-81e0-39ed9b85f64c': { collection_group_results: [Object] },
 *     '1670ff0d-25f3-4759-945a-9230a0b2c157': { collection_group_results: [Object] },
 *     'ab3d732e-a8a5-42a8-bd24-c02af35af9e4': { collection_group_results: [Object] },
 *     '5425ce5f-d3b9-4f92-bcba-fe5cb193e9f7': { collection_group_results: [Object] }
 *   }
 * }
 * @param collectionId
 * a11bbb23-3346-4bc6-9917-018e50988f8c
 * @param collectionView d
 * [{
 *  'ab3d732e-a8a5-42a8-bd24-c02af35af9e4': {
 *    value: {
 *      id: 'ab3d732e-a8a5-42a8-bd24-c02af35af9e4',
 *      version: 31,
 *      type: 'table',
 *      name: '表格',
 *      format: [Object],
 *      parent_id: '395cd28c-4c9b-4428-88de-c72d8090372b',
 *      parent_table: 'block',
 *      alive: true,
 *      page_sort: [Array],
 *      query2: [Object],
 *      space_id: '682bb85e-66d8-453f-ab3e-d9e1a9b0adbc'
 *    },
 *    role: 'read_and_write'
 *  },]
 * @param viewIds
 * [
 *   'ab3d732e-a8a5-42a8-bd24-c02af35af9e4',
 *   '1670ff0d-25f3-4759-945a-9230a0b2c157',
 *   'e07df880-25fc-45ba-81e0-39ed9b85f64c',
 *   '5425ce5f-d3b9-4f92-bcba-fe5cb193e9f7'
 * ]
 * @returns [1001,100201]
 */
export default function getAllPageIds (collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery && !collectionView) {
    return []
  }
  let pageIds = []
  if (collectionQuery && Object.values(collectionQuery).length > 0) {
    const pageSet = new Set()
    Object.values(collectionQuery[collectionId]).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
    pageIds = [...pageSet]
    // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
  } else if (viewIds && viewIds.length > 0) {
    const ids = collectionView[viewIds[0]].value.page_sort
    // console.log('PageIds: 从viewId获取', viewIds)
    for (const id of ids) {
      pageIds.push(id)
    }
  }
  return pageIds
}
