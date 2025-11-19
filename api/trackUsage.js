const { Redis } = require('@upstash/redis'); // leaving this line in causes a CORS error

const redis = Redis.fromEnv()

const hostname = "https://api.collinsdictionary.com";
const accessKey = process.env.COLLINS_TOKEN;

const numSearchResults = 5;

module.exports = async (req, res) => {
    console.log(req.body)

    // Add CORS headers to allow requests from the client-side
    // const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500']; // Adjust port as per Live Server
    // const origin = req.headers.origin;

    // if (allowedOrigins.includes(origin)) {
    //     res.setHeader('Access-Control-Allow-Origin', origin); // Dynamically allow specific origins
    // }

    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const keyCount = "api_usage_count";
    const keyMonth = "last_accessed_month";
    const today = new Date();
    const currentMonth = today.getUTCMonth();

    const lastMonth = await redis.get(keyMonth);

    const { dictType, reqType, reqWord } = req.body;
    
    let collinsData;
    let apiUsage = 1;
    let collinsMethod;
    let collinsWord;

    // if the month has changed, thus requiring a counter reset
    if (!lastMonth || parseInt(lastMonth) !== currentMonth) {
        await redis.set(keyCount, 1);
        await redis.set(keyMonth, currentMonth);

    } else {
        apiUsage = await redis.incr(keyCount);
    }
    
    if (apiUsage <= 4888) {
        try {
            if (reqType == "best-matching") {
                [collinsData, collinsMethod] = await getBestMatching(dictType, reqWord);
                if ('errorCode' in collinsData) {
                    if (collinsData["errorCode"] == "NoResults") {
                        [collinsData, collinsMethod] = await didYouMean(dictType, reqWord, numSearchResults);
                    } else {
                        res.status(502).json({ error: "502 Bad Gateway" });
                        return;
                    }
                } else {
                    collinsWord = collinsData.entryLabel;
                    [collinsData, collinsMethod] = await getEntry(dictType, collinsData.entryId);
                }
                apiUsage = await redis.incr(keyCount);
            } else if (reqType == "get-entry") {
                [collinsData, collinsMethod] = await getEntry(dictType, reqWord);
                collinsWord = collinsData.entryLabel;
            } else if (reqType == "did-you-mean") {
                [collinsData, collinsMethod] = await didYouMean(dictType, reqWord, numSearchResults);
            } else if (reqType == "make-a-search") {
                [collinsData, collinsMethod] = await makeASearch(dictType, reqWord, numSearchResults);
            }
            res.status(200).json({ message: "Collins API call succeeded", data: collinsData, apiCallCount: apiUsage, format: collinsMethod, word: collinsWord })
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: "Internal Server Error." })
        }
    } else {
        res.status(429).json({ message: "Too Many Requests - Exceeded Collins API usage count for the month. ", apiCallCount: apiUsage })
    }
}

async function getBestMatching(dictType, reqWord) {
    let URL = `${hostname}/api/v1/dictionaries/${dictType}/search/first/?q=${reqWord}&format=xml`;
    collinsResponse = await fetch(URL, {
        method: 'GET',
        headers: {
            'accessKey': accessKey,
            'Accept': 'application/json',
            'User-Agent': 'French-Lookup/1.0'
        }
    });
    console.log(collinsResponse, "what");
    return [await collinsResponse.json(), "best-matching"]
}

async function getEntry(dictType, entryId) {
    let URL = `${hostname}/api/v1/dictionaries/${dictType}/entries/${entryId}?format=xml`;
    collinsResponse = await fetch(URL, {
        method: 'GET',
        headers: {
            'accessKey': accessKey,
            'Accept': 'application/json',
            'User-Agent': 'YourAppName/1.0'
        }
    });
    return [await collinsResponse.json(), "get-entry"]
}

async function didYouMean(dictType, reqWord, limit) {
    let URL = `${hostname}/api/v1/dictionaries/${dictType}/search/didyoumean/?q=${reqWord}&entrynumber=${limit}`;
    collinsResponse = await fetch(URL, {
        method: 'GET',
        headers: {
            'accessKey': accessKey,
            'Accept': 'application/json',
            'User-Agent': 'YourAppName/1.0'
        }
    });
    return [await collinsResponse.json(), "did-you-mean"]
}

async function makeASearch(dictType, reqWord, limit) {
    let URL = `${hostname}/api/v1/dictionaries/${dictType}/search/?q=${reqWord}&pagesize=${numSearchResults}`;
    collinsResponse = await fetch(URL, {
        method: 'GET',
        headers: {
            'accessKey': accessKey,
            'Accept': 'application/json',
            'User-Agent': 'YourAppName/1.0'
        }
    });
    return [await collinsResponse.json(), "make-a-search"]
}

