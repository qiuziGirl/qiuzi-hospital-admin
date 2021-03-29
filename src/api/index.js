const commonApis = {}
const files = require.context('./', true, /\.js$/)

files.keys().forEach(key => {
  if (key === './index.js') {
    return false
  }

  const list = key.match(/\.\/(.*)\/(.*).js$/)
  commonApis[list[1]] = { ...commonApis[list[1]], ...files(key).default }
})

export default commonApis
