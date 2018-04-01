function identity(str) {
  return str;
}

module.exports = {
  nfc: identity,
  nfd: identity,
  nfkc: identity,
  nfkd: identity,
};
