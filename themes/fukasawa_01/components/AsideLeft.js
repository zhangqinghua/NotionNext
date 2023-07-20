import Logo from './Logo'
import GroupCategory from './GroupCategory'
import { MenuList } from './MenuList'
import GroupTag from './GroupTag'
import SearchInput from './SearchInput'
import SiteInfo from './SiteInfo'
import Catalog from './Catalog'
import Announcement from './Announcement'
import { useRouter } from 'next/router'
import DarkModeButton from '@/components/DarkModeButton'
import SocialButton from './SocialButton'

function AsideLeft (props) {
  const { tagOptions, currentTag, categoryOptions, currentCategory, post, slot, siteInfo, notice } = props
  const router = useRouter()
  return <div className='sideLeft relative w-80 bg-white dark:bg-hexo-black-gray min-h-screen px-10 py-14 hidden lg:block z-20'>
    <Logo {...props}/>

    <section className='siteInfo flex flex-col dark:text-gray-300 pt-8'>
      { siteInfo?.description }
    </section>

    {/* 隐藏菜单栏 */}
    {/* <section className='flex flex-col text-gray-600'>
      <div className='w-12 my-4' />
      <MenuList {...props}/>
    </section> */}

    {/* 隐藏搜索框 */}
    {/* <section className='flex flex-col text-gray-600'>
      <div className='w-12 my-4' />
      <SearchInput {...props}/>
    </section> */}

    <section className='flex flex-col dark:text-gray-300'>
      <div className='w-12 my-4' />
      <Announcement post={notice}/>
    </section>

    {router.asPath !== '/category' && <section className='flex flex-col'>
      <div className='w-12 my-4' />
      <GroupCategory categories={categoryOptions} currentCategory={currentCategory}/>
    </section>}

    {router.asPath !== '/tag' && <section className='flex flex-col'>
      <div className='w-12 my-4' />
      <GroupTag tags={tagOptions} currentTag={currentTag}/>
    </section>}

    
    <section className='flex flex-col'>
      <div className='w-12 my-4' />
      {/* RSS之类的社交图标 */}
      {/* <SocialButton/> */}
      <SiteInfo/>
    </section>

    {/* 切换黑暗模式/明亮模式 */}
    <section className='flex justify-left dark:text-gray-200'>
        <DarkModeButton/>
    </section>

    {/* 应该是备案信息 */}
    {/* <section className='sticky top-0 pt-12'>
      <Catalog toc={post?.toc}/>
      <div className='flex justify-center'>
        <div>{slot}</div>
      </div>
    </section> */}
  </div>
}

export default AsideLeft
