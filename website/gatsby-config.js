const resolve = require('path').resolve;
const DOC_TABLE_OF_CONTENTS = require('../docs/table-of-contents.json');

module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-ocular`,
      options: {
        logLevel: 1, // Adjusts amount of debug information from ocular-gatsby

        // Folders
        DIR_NAME: __dirname,
        ROOT_FOLDER: `${__dirname}/../`,

        DOCS: DOC_TABLE_OF_CONTENTS,
        DOC_FOLDERS: [`${__dirname}/../docs/`],
        SOURCE: [`${__dirname}/static`, `${__dirname}/src`],

        PROJECT_TYPE: 'github',

        PROJECT_NAME: 'pydeck',
        PROJECT_ORG: 'uber-web',
        PROJECT_ORG_LOGO: 'images/uber-logo.png',
        PROJECT_URL: 'https://github.com/unfoldedinc/pydeck.gl',
        PROJECT_DESC: 'GPU powered geospatial visualization for Python',
        PATH_PREFIX: '/',

        GA_TRACKING: null,

        // For showing star counts and contributors.
        // Should be like btoa('YourUsername:YourKey') and should be readonly.
        GITHUB_KEY: null,

        HOME_PATH: '/',

        PROJECTS: [
          {
            name: 'deck.gl',
            url: 'https://deck.gl'
          },
          {
            name: 'luma.gl',
            url: 'https://luma.gl'
          },
          {
            name: 'react-map-gl',
            url: 'https://uber.github.io/react-map-gl'
          },
          {
            name: 'nebula.gl',
            url: 'https://nebula.gl/'
          }
        ],

        LINK_TO_GET_STARTED: '/docs/developer-guide/get-started',

        ADDITIONAL_LINKS: [{name: 'Blog', href: 'http://medium.com/vis-gl'}],

        INDEX_PAGE_URL: resolve(__dirname, './templates/index.jsx'),

        EXAMPLES: []
      }
    },
    {resolve: 'gatsby-plugin-no-sourcemaps'},
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        whitelist: ['MapboxAccessToken']
      }
    }
  ]
};
