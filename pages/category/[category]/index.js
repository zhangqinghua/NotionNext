import { getGlobalData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import { getLayoutByTheme } from '@/themes/theme'

/**
 * 分类页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const { siteInfo } = props
  const { locale } = useGlobal()

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme(useRouter())

  const meta = {
    title: `${props.category} | ${locale.COMMON.CATEGORY} | ${
      siteInfo?.title || ''
    }`,
    description: siteInfo?.description,
    slug: 'category/' + props.category,
    image: siteInfo?.pageCover,
    type: 'website'
  }

  props = { ...props, meta }

  return <Layout {...props} />
}

export async function getServerSideProps({ params: { category } }) {
  const start = new Date().getTime()
  console.log('\n[pages/category/[category]/index.js] getServerSideProps start, category: ', category)

  const from = 'category-props'
  let props = await getGlobalData({ from })

  // 过滤状态
  props.posts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published')
  // 处理过滤
  props.posts = props.posts.filter(post => post && post.category && post.category.includes(category))
  // 处理文章页数
  props.postCount = props.posts.length
  // 处理分页
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (BLOG.POST_LIST_STYLE === 'page') {
    props.posts = props.posts?.slice(0, BLOG.POSTS_PER_PAGE)
  }

  delete props.allPages

  props = { ...props, category }

  const end = new Date().getTime()
  console.log('[pages/category/[category]/index.js] getServerSideProps finish, 耗时: ', `${end - start}ms`)
  return {
    props
  }
}

// export async function getStaticPaths() {
//   const from = 'category-paths'
//   const { categoryOptions } = await getGlobalData({ from })
//   console.log('============================category index getStaticPaths: ', categoryOptions)
//   console.log('============================category index getStaticPaths: ', categoryOptions)
//   const paths = {
//     paths: Object.keys(categoryOptions).map(category => ({
//       params: { category: categoryOptions[category]?.name }
//     })),
//     fallback: true
//   }
//   console.log('========================index.js getStaticPaths return: ', paths.paths)
//   return paths
// }
