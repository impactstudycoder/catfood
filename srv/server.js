const cds = require('@sap/cds')
const { auth, requiresAuth } = require('express-openid-connect')

cds.on('bootstrap', app => {
  // Auth0 settings come from env vars: ISSUER_BASE_URL, BASE_URL, CLIENT_ID, SECRET
  if (!process.env.ISSUER_BASE_URL) {
    console.warn('[auth] ISSUER_BASE_URL is not set, Auth0 login is disabled')
    return
  }

  app.use(auth({
    authRequired: true,
    // /logout clears the appSession cookie and ends the Auth0 SSO session (/v2/logout)
    idpLogout: true,
    auth0Logout: true
  }))

  app.get('/user', requiresAuth(), (req, res) => {
    const user = req.oidc.user
    res.json({
      name: user.name || user.nickname || user.email,
      email: user.email,
      picture: user.picture
    })
  })
})

module.exports = cds.server
