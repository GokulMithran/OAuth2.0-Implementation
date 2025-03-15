import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';

export const authConfig:AuthConfig={
  issuer:'http://localhost:9090/realms/my-test-realm',
  tokenEndpoint:'http://localhost:9090/realms/my-test-realm/protocol/openid-connect/token',
  redirectUri:window.location.origin,
  clientId:'my-test-realm',
  responseType:'code',
  scope:'openid profile',
  requireHttps:false,
  showDebugInformation:true,
  disableAtHashCheck:true,
  strictDiscoveryDocumentValidation:false
}

export function initializeOAuth(oauthService:OAuthService):Promise<void>{
  return new Promise((resolve)=>{
    oauthService.configure(authConfig);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndTryLogin().then(()=>{
      resolve();
    })
  })
}
