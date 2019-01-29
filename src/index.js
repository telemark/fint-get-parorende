require('dotenv').config()
const fintGetToken = require('fint-get-token')
const { GraphQLClient } = require('graphql-request')

async function getToken () {
  const options = {
    url: process.env.FINT_AUTH_URL,
    credentials: {
      client: {
        client_id: process.env.FINT_CLIENT_ID,
        client_secret: process.env.FINT_CLIENT_SECRET
      },
      auth: {
        username: process.env.FINT_AUTH_USERNAME,
        password: process.env.FINT_AUTH_PASSWORD,
        grant_type: 'password',
        scope: 'fint-client'
      }
    }
  }
  try {
    const { access_token: token } = await fintGetToken(options)
    return token
  } catch (error) {
    throw error
  }
}

async function getData (elevId, token) {
  const graphQLClient = new GraphQLClient(process.env.FINT_GRAPH_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const query = `{
    elev(brukernavn: "${elevId}") {
      person {
        navn {
          fornavn
          etternavn
        }
        parorende {
          person {
            navn {
              fornavn
              etternavn
            }
            kontaktinformasjon {
              mobiltelefonnummer
              epostadresse
            }
          }
        }
      }
    }
  }`

  try {
    const data = await graphQLClient.request(query)
    return data
  } catch (error) {
    throw error
  }
}

module.exports = async elevId => {
  if (!elevId) throw Error('Missing required input: elevId')
  try {
    const token = await getToken()
    const data = await getData(elevId, token)
    return JSON.stringify(data, null, 2)
  } catch (error) {
    console.error(error)
  }
}
