/* eslint-disable no-undef */
const dev = {
  stage: "dev",
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://r8vz95noef.execute-api.us-east-1.amazonaws.com/dev/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_E8bTuMdrD",
    APP_CLIENT_ID: "4uk5fpfv8tji91s1e1j86hvb35",
    IDENTITY_POOL_ID: "us-east-1:c6ffd490-2cbf-4465-9c62-657ec10924b1",
    DOMAIN: "localhost",
    SECURE: false
  }
};

const demo = {
  stage: "demo",
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://0sayiu8gd1.execute-api.us-east-1.amazonaws.com/demo/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_mdlcscRdA",
    APP_CLIENT_ID: "220hvavn2s21c6gcgfg7mvt080",
    IDENTITY_POOL_ID: "us-east-1:2bc7b531-0d39-4489-ad87-0f7a4ea33eff",
    DOMAIN: "instrument-demo.rickhenry.dev",
    SECURE: true
  }
};


const prod = {
  stage: "prod",
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://3dw921ejuh.execute-api.us-east-1.amazonaws.com/prod/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_x5p2txsmA",
    APP_CLIENT_ID: "7rvmg6d2cklqe6jrt3mscbqba7",
    IDENTITY_POOL_ID: "us-east-1:95a1e528-85e0-4e89-ac57-810a8f2219ae",
    DOMAIN: "tmminstruments.com",
    SECURE: true
  }
};

let config;

if (process.env.VUE_APP_DEMO === "TRUE") {
  config = demo;
} else if (process.env.NODE_ENV === "production") {
  config = prod;
} else {
  config = dev;
}


export default config;
