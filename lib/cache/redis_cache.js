import Redis from 'ioredis'
import MemoryCache from './memory_cache'
// import BLOG from 'blog.config'

const redis = new Redis({ host: 'containers-us-west-118.railway.app', port: 7970, password: 'n0kxDTZI3PUKkAfYsfan', db: 1 })

// const cacheTime = BLOG.isProd ? 10 * 60 : 30 * 60 * 60 // 120 minutes for dev,10 minutes for prod

export async function getCache(key, options) {
  let data
  if (key !== 'getNotionPageData_inuse') {
    console.log('尝试从内存读取缓存数据, key: ', key)
    data = await MemoryCache.getCache(key, options)
  }
  if (!data) {
    console.log('内存读取缓存数据失败, key: ', key)
    console.log('尝试从Redis读取缓存数据, key: ', key)
    const start = new Date().getTime()
    const a = await redis.get('notion_next:' + key)
    const end = new Date().getTime()
    console.log('[Redis耗时]', `${end - start}ms`)
    if (a && a !== '[]') {
      console.log('Redis读取缓存数据成功, key: ', key)
      data = JSON.parse(a)
      MemoryCache.setCache(key, data)
    } else {
      console.log('Redis读取缓存数据失败, key: ', key)
    }
  } else {
    console.log('内存读取缓存数据成功, key: ', key)
  }
  return data
}

export async function setCache(key, data, minutes = 1) {
  await MemoryCache.setCache(key, data)
  await redis.set('notion_next:' + key, JSON.stringify(data), 'EX', minutes * 60)
}

export async function delCache(key) {
  await MemoryCache.delCache(key)
  await redis.del('notion_next:' + key)
}

export default { getCache, setCache, delCache }
