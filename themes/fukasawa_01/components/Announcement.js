import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className }) => {
  const { locale } = useGlobal()
  if (post?.blockMap) {
    return <div className={className}>
        {/* 100107: 公告栏添加边框 */}
        <section id='announcement-wrapper' className="dark:text-gray-300 rounded-xl" style={{borderStyle: "solid", borderWidth: "1px", margin: "-10px", padding: "10px", boxShadow: "1px 3px 5px 0px #ccc"}}>
        {/* <section id='announcement-wrapper' className="dark:text-gray-300 rounded-xl px-2 py-4" > */}
            <div><i className='mr-2 fas fa-bullhorn' />{locale.COMMON.ANNOUNCEMENT}</div>
            {post && (<div id="announcement-content">
            {/* 100108: 公告栏内容左靠齐 */}
            {/* <NotionPage post={post} className='text-center ' /> */}
            <NotionPage post={post} className='text-left ' />
        </div>)}
        </section>
    </div>
  } else {
    return <></>
  }
}
export default Announcement
