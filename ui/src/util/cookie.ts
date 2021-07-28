import { parseCookies, destroyCookie } from 'nookies'
import { NextPageContext } from 'next'

export const getCookie = (ctx?: NextPageContext) => {
  const cookie = parseCookies(ctx)
  return cookie
}

export const deleteCookie = (key: string, ctx?: NextPageContext) => {
  destroyCookie(ctx, key, {
    path: '/',
  })
}
