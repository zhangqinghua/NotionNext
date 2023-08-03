import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalData } from '@/lib/notion/getNotionData'
import { idToUuid } from 'notion-utils'
import { getNotion } from '@/lib/notion/getNotion'
import Slug, { getRecommendPost } from '.'
import { uploadDataToAlgolia } from '@/lib/algolia'

/**
 * 根据notion的slug访问页面
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props}/>
}

// export async function getStaticPaths() {
//   console.log('============================slug getStaticPaths')
//   if (!BLOG.isProd) {
//     return {
//       paths: [],
//       fallback: true
//     }
//   }

//   const from = 'slug-paths'
//   const { allPages } = await getGlobalData({ from })
//   console.log('========================slug.js slug-paths')
//   const paths = {
//     paths: allPages?.filter(row => row.slug.indexOf('/') > 0).map(row => ({ params: { prefix: row.slug.split('/')[0], slug: row.slug.split('/')[1] } })),
//     fallback: true
//   }

//   console.log('========================slug.js slug-paths return: ', paths.paths)
//   return paths
// }

export async function getServerSideProps({ params: { prefix, slug } }) {
  const start = new Date().getTime()
  console.log('\n[pages/[prefix]/[slug].js] getServerSideProps start,', ` prefix: ${prefix}, slug: ${slug}`)

  let fullSlug = prefix + '/' + slug
  if (JSON.parse(BLOG.PSEUDO_STATIC)) {
    if (!fullSlug.endsWith('.html')) {
      fullSlug += '.html'
    }
  }
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from })
  // 在列表内查找文章
  props.post = props?.allPages?.find((p) => {
    return p.slug === fullSlug || p.id === idToUuid(fullSlug)
  })

  // 处理非列表内文章的内信息
  if (!props?.post) {
    const pageId = slug.slice(-1)[0]
    if (pageId.length >= 32) {
      const post = await getNotion(pageId)
      props.post = post
    }
  }

  // 无法获取文章
  if (!props?.post) {
    const end = new Date().getTime()
    console.log('[pages/[prefix]/[slug].js] getServerSideProps finish, 无法获取文章, 耗时: ', `${end - start}ms`)

    props.post = null
    return { props }
  }

  // 文章内容加载
  if (!props?.posts?.blockMap) {
    props.post.blockMap = await getPostBlocks(props.post.id, from)
  }
  // 生成全文索引 && JSON.parse(BLOG.ALGOLIA_RECREATE_DATA)
  if (BLOG.ALGOLIA_APP_ID) {
    uploadDataToAlgolia(props?.post)
  }
  // 推荐关联文章处理
  // const allPosts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published')
  // 100101: 修改上一页/下一页算法 推荐关联文章处理(要求只查询同一个分类的)(先按日期排序，再按标题排序（经过测试无法对中文数字进行排序）)
  const allPosts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published' && page.category === props.post.category)
  if (allPosts && allPosts.length > 0) {
    const index = allPosts.indexOf(props.post)
    props.prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
    props.next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]
    props.recommendPosts = getRecommendPost(props.post, allPosts, BLOG.POST_RECOMMEND_COUNT)
  } else {
    props.prev = null
    props.next = null
    props.recommendPosts = []
  }

  delete props.allPages
  const end = new Date().getTime()
  console.log('[pages/[prefix]/[slug].js] getServerSideProps finish, 耗时: ', `${end - start}ms`)
  return {
    props
  }
}

export default PrefixSlug
