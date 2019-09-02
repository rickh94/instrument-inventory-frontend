/* eslint-disable no-undef */
const dev = {
  stage: 'dev',
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://r8vz95noef.execute-api.us-east-1.amazonaws.com/dev/',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_E8bTuMdrD',
    APP_CLIENT_ID: '4uk5fpfv8tji91s1e1j86hvb35',
    IDENTITY_POOL_ID: 'us-east-1:c6ffd490-2cbf-4465-9c62-657ec10924b1',
    DOMAIN:
      process.env.USER === 'rick'
        ? 'localhost'
        : process.env.DEPLOY_URL.replace('https://', ''),
    SECURE: process.env.USER === 'rick' ? false : true,
  },
  s3: {
    REGION: 'us-east-1',
    BUCKET: 'instrument-inventory-dev-photosbucket-10qe9d73yvjmj',
  },
}

const prod = {
  stage: 'prod',
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://3dw921ejuh.execute-api.us-east-1.amazonaws.com/prod/',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_x5p2txsmA',
    APP_CLIENT_ID: '7rvmg6d2cklqe6jrt3mscbqba7',
    IDENTITY_POOL_ID: 'us-east-1:95a1e528-85e0-4e89-ac57-810a8f2219ae',
    DOMAIN: process.env.URL ? process.env.URL.replace('https://', '') : '',
    SECURE: true,
  },
  s3: {
    REGION: 'us-east-1',
    BUCKET: 'instrument-inventory-prod-photosbucket-1gn4run79aalw',
  },
}

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev

export default config
