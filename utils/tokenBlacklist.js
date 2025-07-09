const accessTokenBlacklist = new Set();
const refreshTokenBlacklist = new Set();

function blacklistToken(type, token) {
  if (type === "access") accessTokenBlacklist.add(token);
  else if (type === "refresh") refreshTokenBlacklist.add(token);
}

function isTokenBlacklisted(type, token) {
  return type === "access"
    ? accessTokenBlacklist.has(token)
    : refreshTokenBlacklist.has(token);
}

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
};
