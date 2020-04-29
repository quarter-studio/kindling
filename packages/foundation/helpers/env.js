module.exports = (key, fallback) => {
  return key ? collect(process.env).get(key, fallback) : app('env')
}
