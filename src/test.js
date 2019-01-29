const getParorende = require('./index')

getParorende('MISJ2')
  .then(data => console.log(data))
  .catch(error => console.error(error))
