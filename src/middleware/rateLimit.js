import { ApiError } from '../utils/errors.js'

export function rateLimiterMiddleware(bindingName) {
  return async (c, next) => {
    const limiter = c.env[bindingName]

    if (!limiter) {
      await next()
      return
    }

    //per the docs,IP is not ideal but acceptable for auth endpoints
    //Where we don't yet have a user identify to key on
    const ip = c.req.header('cf-connecting-ip') ?? 'anonymous'
    const key = `${c.req.path}${ip}`

    const { success } = await limiter.limit({ key })

    if (!success) {
      throw new ApiError(
        429,
        'TOO_MANY_REQUESTS',
        'Too many requests, please try again later.',
      )
    }

    await next()
  }
}
