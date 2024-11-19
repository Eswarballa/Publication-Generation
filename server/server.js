const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const SERPAPI_KEY = process.env.SERPAPI_KEY;

// Search by author name
app.get('/api/search', async (req, res) => {
    const { author_name } = req.query;

    console.log(`Searching for author: ${author_name}`);

    try {
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                engine: 'google_scholar_profiles',
                mauthors: author_name,
                api_key: SERPAPI_KEY,
            },
        });

        if (!response.data.profiles || response.data.profiles.length === 0) {
            return res.status(404).json({ error: 'No profiles found.' });
        }

        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching author data: ${error.message}`);
        res.status(500).json({ error: 'Error fetching data from SerpApi', details: error.message });
    }
});

// Search for publications by author ID with pagination support
app.get('/publications', async (req, res) => {
    const { author_id, next_url } = req.query;

    let requestUrl = 'https://serpapi.com/search.json';
    const params = {
        engine: 'google_scholar_author',
        api_key: SERPAPI_KEY,
    };

    // Use `next_url` if provided, otherwise fallback to initial request
    if (next_url) {
        requestUrl = next_url;
    } else {
        params.author_id = author_id;
    }

    console.log(`Fetching publications. URL: ${requestUrl}, Params:`, params);

    try {
        const response = await axios.get(requestUrl, { params });

        if (!response.data.articles || response.data.articles.length === 0) {
            return res.status(404).json({ error: 'No publications found for this author.' });
        }

        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching publications: ${error.message}`);
        res.status(500).send({ error: 'Error fetching data from SerpApi', details: error.message });
    }
});

// Port listening
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
