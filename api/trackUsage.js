import { Redis } from '@upstash/redis'

// const redis = new Redis({
//   url: process.env.UPSTASH_URL,
//   token: process.env.UPSTASH_TOKEN,
// });

// const hostname = "https://api.collinsdictionary.com";
// const accessKey = process.env.COLLINS_TOKEN;

// const numSearchResults = 5;

export default async function handler(req, res) {
    // Add CORS headers to allow requests from the client-side
    // const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500']; // Adjust port as per Live Server
    // const origin = req.headers.origin;

    // if (allowedOrigins.includes(origin)) {
    //     res.setHeader('Access-Control-Allow-Origin', origin); // Dynamically allow specific origins

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    res.status(200).end()
}
//     const keyCount = "api_usage_count";
//     const keyMonth = "last_accessed_month";
//     const currentMonth = new Date().getUTCMonth();

//     const lastMonth = await redis.get(keyMonth);

//     const { dictType, reqType, reqWord } = req.body;
    
//     let collinsResponse;
//     let collinsData;
//     let apiUsage;

//     // if the month has changed, thus requiring a counter reset
//     if (!lastMonth || parseInt(lastMonth) !== currentMonth) {
//         await redis.set(keyCount, 1);
//         await redis.set(keyMonth, currentMonth);

//     } else {
//         apiUsage = await redis.incr(keyCount);
//     }
    
//     if (apiUsage <= 4800) {
//         try {
//             if (reqType == "best-matching") {
//                 let URL = `${hostname}/api/v1/dictionaries/${dictType}/search/first/?q=${reqWord}`;
//                 collinsResponse = await fetch(URL, {
//                     method: 'GET',
//                     headers: {
//                         'accessKey': accessKey,
//                         'Accept': 'application/json'
//                     }
//                 });
//             } else if (reqType == "get-entry") {
//                 let URL = `${hostname}/api/v1/dictionaries/${dictType}/entries/${reqWord}`;
//                 collinsResponse = await fetch(URL, {
//                     method: 'GET',
//                     headers: {
//                         'accessKey': accessKey,
//                         'Accept': 'application/json'
//                     }
//                 })
//             } else if (reqType == "did-you-mean") {
//                 let URL = `${hostname}/api/v1/dictionaries/${dictType}/search/didyoumean/?q=${reqWord}&entrynumber=${numSearchResults}`;
//                 collinsResponse = await fetch(URL, {
//                     method: 'GET',
//                     headers: {
//                         'accessKey': accessKey,
//                         'Accept': 'application/json'
//                     }
//                 })
//             } else if (reqType == "make-a-search") {
//                 let URL = `${hostname}/api/v1/dictionaries/${dictType}/search/?q=${reqWord}&pagesize=${numSearchResults}`;
//                 collinsResponse = await fetch(URL, {
//                     method: 'GET',
//                     headers: {
//                         'accessKey': accessKey,
//                         'Accept': 'application/json'
//                     }
//                 })
//             }
//             collinsData = await collinsResponse.json()
//             res.status(200).json({ message: "Collins API call succeeded", data: collinsData, apiCallCount: apiUsage })
//         } catch {
//             res.status(500).json({ error: "Internal Server Error." })
//         }
//     } else {
//         res.status(200).json({ message: "Exceeded Collins API usage count for the month. ", apiCallCount: apiUsage })
//     }
// }