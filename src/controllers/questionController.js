const axios = require('axios');

exports.askQuestion = async (req, res) => {
    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAsN8NwMOnbefTqN8nbtAmDIOmmdBlRz7M',
            req.body 
        );

        let answer = response.data.candidates[0].content.parts[0].text;
        answer = answer.replace(/^\*\s*/gm, ""); 
      
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying request to Google API:', error);
        res.status(500).json({ error: 'Failed to proxy request to Google API' });
    }
};
