import * as path from 'path'
import * as express from 'express'
import * as nunjucks from 'nunjucks'
import { InitOptions } from 'i18next'

export class Nunjucks {

  constructor (public developmentMode: boolean, public i18next: any) {
    this.developmentMode = developmentMode
    this.i18next = i18next
  }

  enableFor (app: express.Express) {
    app.set('view engine', 'njk')
    const govUkFrontendPath = path.join(
      __dirname, '..', '..', '..', '..', 'node_modules',
      'govuk-frontend'
    )
    const nunjucksEnv = nunjucks.configure([
      path.join(__dirname,'..','..','views'),
      govUkFrontendPath
    ], {
      autoescape: true,
      watch: this.developmentMode,
      express: app
    })

    // Enables i18next translate method globally in nujucks
    nunjucksEnv.addGlobal('t', (key: string, options?: InitOptions): string => this.i18next.t(key, options))

    app.use((req, res, next) => {
      res.locals.pagePath = req.path
      next()
    })
  }
}
