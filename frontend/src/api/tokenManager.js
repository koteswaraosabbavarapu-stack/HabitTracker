// simple token manager — stores token in memory
// outside of React but accessible everywhere

let accessToken = null

export const setToken = (token) => {
  accessToken = token
}

export const getToken = () => {
  return accessToken
}

export const clearToken = () => {
  accessToken = null
}