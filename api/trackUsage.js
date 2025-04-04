import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN,
})


export default async function handler(req, res) {
    const keyCount = "api_usage_count";
    const keyMonth = "last_accessed_month";
    const currentMonth = new Date().getUTCMonth();

    const lastMonth = await redis.get(keyMonth);

    // if the month has changed, thus requiring a counter reset
    if (!lastMonth || paresInt(LastMonth) !== currentMonth) {
        await redis.set(keyCount, 1);
        await redis.set(keyMonth, currentMonth);
        res.status(200).json()
    } else {
        const newCount = await redis.incr(keyCount);
        res.status(200).json({ usage_count: newCount })
    }
}