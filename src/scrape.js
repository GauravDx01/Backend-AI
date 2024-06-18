const axios = require('axios');
const cheerio = require('cheerio');

async function getLinks(url) {
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
    return links;
  } catch (error) {
    console.error(`Error fetching URL: ${error.message}`);
    return [];
  }
}

module.exports = getLinks;
