import conjugationFr from 'conjugation-fr';

module.exports = async (req, res) => {
    // Add CORS headers to allow requests from the client-side
    const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500']; // Adjust port as per Live Server
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin); // Dynamically allow specific origins
    }

    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { word } = req.body;
    
    try {
        console.log("heybro", 1)
        const conjugations = {
            "indicatif": {
                "présent": conjugationFr.conjugate(word, "indicative", "present"),
                "imparfait": conjugationFr.conjugate(word, "indicative", "imperfect"),
                "futur": conjugationFr.conjugate(word, "indicative", "futur"),
                "passé simple": conjugationFr.conjugate(word, "indicative", "simple-past"),
                "passé composé": conjugationFr.conjugate(word, "indicative", "perfect-tense"),
                "plus-que-parfait": conjugationFr.conjugate(word, "indicative", "pluperfect"),
                "passé antérieur": conjugationFr.conjugate(word, "indicative", "anterior-past"),
                "futur antérieur": conjugationFr.conjugate(word, "indicative", "anterior-future"),
            },
            "conditionnel": {
                "présent": conjugationFr.conjugate(word, "conditional", "present"),
                "passé conditionnel": conjugationFr.conjugate(word, "conditional", "conditional-past"),
            },
            "subjonctif": {
                "présent": conjugationFr.conjugate(word, "subjunctive", "present"),
                "imparfait": conjugationFr.conjugate(word, "subjunctive", "imperfect"),
                "subjonctif passé": conjugationFr.conjugate(word, "subjunctive", "subjunctive-past"),
                "subjontif plus-que-parfait": conjugationFr.conjugate(word, "subjunctive", "subjunctive-pluperfect"),
            },
            "impératif": {
                "impératif présent": conjugationFr.conjugate(word, "imperative", "imperative-present"),
                "impératif passé": conjugationFr.conjugate(word, "imperative", "imperative-past"),
            },
            "participe": {
                "participe présent": conjugationFr.conjugate(word, "participle", "present-participle"),
                "participe passé": conjugationFr.conjugate(word, "participle", "past-participle"),
            }
        }
        console.log("hey bro", 2)
        res.status(200).json({ message: "French conjugation succeeded", data: conjugations})
    } catch (error) {
        res.status(500).json({ error: error })
    }
}