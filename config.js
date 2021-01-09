/**
 *
 * All Configuration for the app
 */

const ENVIRONMENT = {}

ENVIRONMENT.development = {
  PORT: 5000,
  ENV_NAME: 'Development',
  PUPPETEER_CONFIG: {
    headless: true,
    devtools: false,
    slowMo: 10,
  },
}
ENVIRONMENT.production = {
  PORT: 5000,
  ENV_NAME: 'Development',
  PUPPETEER_CONFIG: {
    headless: false,
    devTools: true,
    slowMo: 5,
  },
}

const DESIRED_ENVIRONMENT =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : false

const ENVIRONMENT_TO_RETURN =
  typeof ENVIRONMENT[DESIRED_ENVIRONMENT] == 'object'
    ? ENVIRONMENT[DESIRED_ENVIRONMENT]
    : ENVIRONMENT.development

module.exports = ENVIRONMENT_TO_RETURN
