    // scrapeController.js
    const axios = require('axios');
    const cheerio = require('cheerio');

    exports.getLinks = async (req, res) => {
      const url = req.query.url;
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
       
        const links = [];
        $('a').each((index, element) => {
          const link = $(element).attr('href');
          if (link && !link.startsWith('#')) { // Exclude empty and anchor links
            links.push(link);
          }
        });
        res.json({ links });
      } catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).json({ error: 'Failed to fetch links from the URL' });
      }
    };
