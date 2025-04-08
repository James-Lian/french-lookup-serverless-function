const { Redis } = require('@upstash/redis'); // leaving this line in causes a CORS error


module.exports = async (req, res) => {
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
    
    res.status(200).json({message: "f"})
}
