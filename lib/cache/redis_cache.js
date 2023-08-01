import Redis from 'ioredis'
import BLOG from 'blog.config'

const redis = new Redis({ host: 'containers-us-west-118.railway.app', port: 7970, password: 'n0kxDTZI3PUKkAfYsfan', db: 1 })

const cacheTime = BLOG.isProd ? 10 * 60 : 120 * 60 // 120 minutes for dev,10 minutes for prod

export async function getCache(key, options) {
  const data = await redis.get(key)
  return JSON.parse(data)
}

export async function setCache(key, data) {
  await redis.set(key, JSON.stringify(data), 'EX', cacheTime)
}

export async function delCache(key) {
  await redis.del(key)
}

export default { getCache, setCache, delCache }
