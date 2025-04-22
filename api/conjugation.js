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
    
    console.log('try it out')
    console.log(conjugationFr.conjugate(word, "indicative", "present"))

    try {
        const conjugations = {
            "indicatif": [
                {"tense": "présent", "conjugations": conjugationFr.conjugate(word, "indicative", "present")},
                {"tense": "imparfait", "conjugations": conjugationFr.conjugate(word, "indicative", "imperfect")},
                {"tense": "futur", "conjugations": conjugationFr.conjugate(word, "indicative", "future")},
                {"tense": "passé simple", "conjugations": conjugationFr.conjugate(word, "indicative", "simple-past")},
                {"tense": "passé composé", "conjugations": conjugationFr.conjugate(word, "indicative", "perfect-tense")},
                {"tense": "plus-que-parfait", "conjugations": conjugationFr.conjugate(word, "indicative", "pluperfect")},
                {"tense": "passé antérieur", "conjugations": conjugationFr.conjugate(word, "indicative", "anterior-past")},
                {"tense": "futur antérieur", "conjugations": conjugationFr.conjugate(word, "indicative", "anterior-future")},
            ],
            "conditionnel": [
                {"tense": "présent", "conjugations": conjugationFr.conjugate(word, "conditional", "present")},
                {"tense": "passé conditionnel", "conjugations": conjugationFr.conjugate(word, "conditional", "conditional-past")},
            ],
            "subjonctif": [
                {"tense": "présent", "conjugations": conjugationFr.conjugate(word, "subjunctive", "present")},
                {"tense": "imparfait", "conjugations": conjugationFr.conjugate(word, "subjunctive", "imperfect")},
                {"tense": "subjonctif passé", "conjugations": conjugationFr.conjugate(word, "subjunctive", "subjunctive-past")},
                {"tense": "subjontif plus-que-parfait", "conjugations": conjugationFr.conjugate(word, "subjunctive", "subjunctive-pluperfect")},
            ],
            "impératif": [
                {"tense": "impératif présent", "conjugations": conjugationFr.conjugate(word, "imperative", "imperative-present")},
                {"tense": "impératif passé", "conjugations": conjugationFr.conjugate(word, "imperative", "imperative-past")},
            ],
            "participe": [
                {"tense": "participe présent", "conjugations": conjugationFr.conjugate(word, "participle", "present-participle")},
                {"tense": "participe passé", "conjugations": conjugationFr.conjugate(word, "participle", "past-participle")},
            ]
        }
        res.status(200).json({ message: "French conjugation succeeded", data: conjugations})
    } catch (error) {
        res.status(500).json({ error: error })
    }
}