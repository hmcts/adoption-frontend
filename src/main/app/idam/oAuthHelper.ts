import * as express from 'express'
import uuid from 'uuid'
import Cookies from 'cookies'
import config from 'config'

import { RoutablePath } from 'common/router/routablePath'
import { Paths } from 'case/paths'
import { buildURL } from 'common/utils/buildURL'
import { User } from './user'

const clientId = config.get<string>('oauth.clientId')
const loginPath = `${config.get('idam.authentication-web.url')}/login`

export class OAuthHelper {
  static forLogin (req: express.Request, res: express.Response, receiver: RoutablePath = Paths.receiver): string {
    const redirectUri = buildURL(req, receiver.uri)
    const state = uuid()
    OAuthHelper.storeStateCookie(req, res, state)

    return `${loginPath}?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  static forPin (req: express.Request, res: express.Response, claimReference: string): string {
    const redirectUri = buildURL(req, Paths.receiver.uri)
    const state = claimReference
    OAuthHelper.storeStateCookie(req, res, state)

    return `${loginPath}/pin?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  static forUplift (req: express.Request, res: express.Response): string {
    const redirectUri = buildURL(req, Paths.receiver.uri)
    const user: User = res.locals.user
    OAuthHelper.storeStateCookie(req, res, user.id)

    return `${loginPath}/uplift?response_type=code&state=${user.id}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  static getStateCookie (req: express.Request): string {
    return req.cookies['state']
  }

  private static storeStateCookie (req: express.Request, res: express.Response, state: string): void {
    const cookies = new Cookies(req, res)
    cookies.set('state', state)
  }
}
