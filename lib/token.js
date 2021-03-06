const uuid = require('uuid');
const redis = require('./redis');

const REDIS_PREFIX = 'message_center:';
const TIMEOUT = 3600 * 24 * 30;

exports.generate = function* generate(_store) {
  const store = JSON.stringify(_store);
  const token = uuid.v1().replace(/-/g, '');
  const resp = yield redis.setexAsync(REDIS_PREFIX + token, TIMEOUT, store);
  return resp ? token : null;
};

exports.get = function* get(token) {
  const store = yield redis.getAsync(REDIS_PREFIX + token);
  return store ? JSON.parse(store) : null;
};

exports.update = function* update(token, store) {
  return yield redis.setexAsync(REDIS_PREFIX + token, TIMEOUT, JSON.stringify(store));
};
