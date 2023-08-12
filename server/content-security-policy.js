import helmet from "helmet";

const self = '\'self\'';
const data = 'data:';
const unsafeEval = '\'unsafe-eval\'';
const unsafeInline = '\'unsafe-inline\'';
const allowedOrigins = [
    "http://localhost",
    "http://localhost:3000",
    "https://jsdelivr.net",
    "https://*.jsdelivr.net",
    "https://volt.io",
    "https://*.volt.io"
  ];

// create the default connect source for our current domain in
// a multi-protocol compatible way (http/ws or https/wss)
const url = Meteor.absoluteUrl();
const domain = url.replace(/http(s)*:\/\//, '').replace(/\/$/, '')
const s = url.match(/(?!=http)s(?=:\/\/)/) ? 's' : ''
const usesHttps = s.length > 0
const connectSrc = [
    self,
    `http${s}://${domain}`,
    `ws${s}://${domain}`
]

const helmetOptions = {
	crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
        blockAllMixedContent: true,
        directives: {
            defaultSrc: [self].concat(allowedOrigins),
            scriptSrc: [self,unsafeInline,unsafeEval].concat(allowedOrigins,connectSrc),
            childSrc: [self].concat(allowedOrigins),
            // If you have external apps, that should be allowed as sources for
            // connections or images, your should add them here
            // Call helmetOptions() without args if you have no external sources
            // Note, that this is just an example and you may configure this to your needs
            connectSrc: connectSrc.concat(allowedOrigins),
            fontSrc: [self, data].concat(allowedOrigins),
            formAction: [self],
            frameAncestors: [self],
            frameSrc: ['*'],
            // This is an example to show, that we can define to show images only
            // from our self, browser data/blob and a defined set of hosts.
            // Configure to your needs.
            imgSrc: [self, data, 'blob:'].concat(allowedOrigins),
            manifestSrc: [self].concat(allowedOrigins),
            mediaSrc: [self].concat(allowedOrigins),
            objectSrc: [self].concat(allowedOrigins),
            // these are just examples, configure to your needs, see
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox
            sandbox: [
                // allow-downloads-without-user-activation // experimental
                'allow-forms',
                'allow-modals',
                // 'allow-orientation-lock',
                // 'allow-pointer-lock',
                // 'allow-popups',
                // 'allow-popups-to-escape-sandbox',
                // 'allow-presentation',
                'allow-same-origin',
                'allow-scripts',
                // 'allow-storage-access-by-user-activation ', // experimental
                // 'allow-top-navigation',
                // 'allow-top-navigation-by-user-activation'
            ],
            styleSrc: [self,unsafeInline].concat(allowedOrigins),
            workerSrc: [self, 'blob:'].concat(allowedOrigins)
        }
    },
    // */
    // see the helmet documentation to get a better understanding of
    // the following configurations and settings
    strictTransportSecurity: {
        maxAge: 15552000,
        includeSubDomains: true,
        preload: false
    },
    referrerPolicy: {
        policy: 'origin'
    },
    expectCt: {
        enforce: true,
        maxAge: 604800
    },
    frameguard: {
        action: 'sameorigin'
    },
    dnsPrefetchControl: {
        allow: false
    },
    permittedCrossDomainPolicies: {
        permittedPolicies: 'none'
    }
}

WebApp.connectHandlers.use(helmet(helmetOptions));
