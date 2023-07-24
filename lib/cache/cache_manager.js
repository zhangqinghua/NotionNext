import MemoryCache from './memory_cache'
import FileCache from './local_file_cache'
import MongoCache from './mongo_db_cache'
import BLOG from '@/blog.config'
process.env.ENABLE_FILE_CACHE = true
let api
if (process.env.MONGO_DB_URL && process.env.MONGO_DB_NAME) {
  api = MongoCache
} else if (process.env.ENABLE_FILE_CACHE) {
  api = FileCache
  console.log('use file cache')
} else {
  api = MemoryCache
}

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key, force) {
  if (BLOG.ENABLE_CACHE || force) {
    const dataFromCache = await api.getCache(key)
    if (JSON.stringify(dataFromCache) === '[]') {
      return null
    }
    return api.getCache(key)
  } else {
    return null
  }
}

export async function setDataToCache(key, data) {
  if (!data) {
    return
  }
  await api.setCache(key, data)
}

export async function delCacheData(key) {
  if (!BLOG.ENABLE_CACHE) {
    return
  }
  await api.delCache(key)
}

export function cacheAsync(promiseGenerator, { symbol, expire = 1000 }) {
  const cache = new Map()
  const never = Symbol('')

  console.log('从缓存取数据------------------------------', cache, never)
  return async (params) => {
    console.log('请求参数------------------------', params)
    return new Promise((resolve, reject) => {
      // 获取缓存key
      if (typeof symbol === 'function') {
        symbol = symbol(params)
      }
      let cacheCfg = cache.get(symbol)
      if (!cacheCfg) {
        cacheCfg = {
          hit: never,
          exector: [{ resolve, reject }]
        }
        cache.set(symbol, cacheCfg)
      } else {
        // 命中缓存
        if (cacheCfg.hit !== never) {
          return resolve(cacheCfg.hit)
        }
        cacheCfg.exector.push({ resolve, reject })
      }

      const { exector } = cacheCfg
      // 处理并发，在请求还处于pending过程中就发起了相同的请求
      // 拿第一个请求
      if (exector.length === 1) {
        const next = async () => {
          try {
            if (!exector.length) return
            const response = await promiseGenerator(params)
            console.log('response-------------------------', response)
            // 如果成功了，那么直接resolve掉剩余同样的请求
            while (exector.length) { // 清空
              exector.shift().resolve(response)
            }
            // 缓存结果
            cacheCfg.hit = response
            // 超时不来取缓存则过期
            expire && setTimeout(() => cache.delete(symbol), expire)
          } catch (error) {
            // 如果失败了 那么这个promise的则为reject
            const { reject } = exector.shift()
            reject(error)
            next() // 失败重试，降级为串行
          }
        }
        next()
      }
    })
  }
}
