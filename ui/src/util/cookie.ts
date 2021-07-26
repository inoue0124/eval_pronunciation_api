import { parseCookies, setCookie } from 'nookies'
import { NextPageContext } from 'next'

export const getCookie = (ctx?: NextPageContext) => {
  const cookie = parseCookies(ctx)
  return cookie
}
