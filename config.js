const dev = {
  stage: 'dev',
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://r8vz95noef.execute-api.us-east-1.amazonaws.com/dev/'
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_E8bTuMdrD',
    APP_CLIENT_ID: '4uk5fpfv8tji91s1e1j86hvb35',
    IDENTITY_POOL_ID: 'us-east-1:c6ffd490-2cbf-4465-9c62-657ec10924b1'
  }
}

const config = dev

export default config
