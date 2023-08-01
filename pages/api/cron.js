import BLOG from '@/blog.config'
import { loadNotionPageDataAndCache } from '@/lib/notion/getNotionData'

export default async function handler(req, res) {
  console.log('定时任务开始执行')
  await loadNotionPageDataAndCache({ pageId: BLOG.NOTION_PAGE_ID, from: 'cron job' })
  console.log('定时任务开始成功')

  // 返回响应数据
  res.status(200).send('success')
}
