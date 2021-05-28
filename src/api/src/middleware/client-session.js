import { nanoid } from 'nanoid'
import { NCCRD_SSL_ENV, NCCRD_CLIENT_ID } from '../config.js'

export default async (ctx, next) => {
  if (!ctx.cookies.get(NCCRD_CLIENT_ID)) {
    ctx.cookies.set(
      NCCRD_CLIENT_ID,
      Buffer.from(
        JSON.stringify({
          date: new Date(),
          id: nanoid(),
        })
      ).toString('base64'),
      {
        signed: true,
        httpOnly: true,
        secure: NCCRD_SSL_ENV === 'development' ? false : true,
        sameSite: NCCRD_SSL_ENV === 'development' ? 'lax' : 'none',
      }
    )
  }

  await next()
}
