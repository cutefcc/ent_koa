// Use require.context to require reducers automatically
// Ref: https://webpack.js.org/guides/dependency-management/#requirecontext
const modelContext = require.context('./', false, /\.js$/)
const models = modelContext
  .keys()
  .filter((item) => item !== './index.js')
  .map((modelFilePath) => modelContext(modelFilePath))

export default models
