const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv()

export default redis;