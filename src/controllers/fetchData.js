const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const FileData = require('../models/fetchDataModels');
const { URL } = require('url');
exports.getParagraphs = async (req, res) => {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
  
    try {
      // Fetch public IP address from ipify API
      const ipResponse = await axios.get('https://api.ipify.org/?format=json');
      const ipAddress = ipResponse.data.ip;
  
      // Fetch all sitemap links
      const links = await getLinks(url);
  
      // Ensure the DataFiles directory exists
      const dataFilesDir = path.join(__dirname, '../DataFiles');
      if (!fs.existsSync(dataFilesDir)) {
        fs.mkdirSync(dataFilesDir);
      }
  
      // Generate a unique filename using the domain name and a timestamp
      const timestamp = Date.now();
      const domainName = new URL(url).hostname.replace(/\W+/g, '-');
      const fileName = `${domainName}-${timestamp}.txt`;
      const filePath = path.join(dataFilesDir, fileName);
  
      // Create a write stream to save the paragraphs directly to the file
      const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
  
      // Function to process each link and write paragraphs to the file
      async function processLink(link) {
        try {
          const response = await axios.get(link);
          const html = response.data;
          const $ = cheerio.load(html);
          $('p').each((index, element) => {
            const paragraph = $(element).text();
            writeStream.write(paragraph + '\n');
          });
        } catch (error) {
          console.error(`Error fetching link (${link}):`, error.message);
        }
      }
  
      // Process each link
      for (const link of links) {
        await processLink(link);
      }
  
      // Close the write stream
      writeStream.end(async () => {
        // Save the URL, IP address, and file path to MongoDB
        const fileData = new FileData({
          url,
          ipAddress,
          filePath,
          createdAt: new Date()
        });
  
        try {
          await fileData.save();
          res.json({ message: 'Data saved successfully', filePath });
        } catch (error) {
          console.error('Error saving data to MongoDB:', error);
          res.status(500).json({ error: 'Failed to save data to MongoDB' });
        }
      });
  
    } catch (error) {
      console.error('Error fetching the URL:', error);
      res.status(500).json({ error: 'Failed to fetch the URL' });
    }
  };




  exports.getStoredData = async (req, res) => {
  const ipAddress = req.query.ipAddress;

  if (!ipAddress) {
    return res.status(400).json({ error: 'IP address is required' });
  }

  try {
    // Fetch all entries from MongoDB associated with the IP address
    const fileEntries = await FileData.find({ ipAddress });

    if (!fileEntries.length) {
      return res.status(404).json({ error: 'No data found for the provided IP address' });
    }

    const data = [];

    fileEntries.forEach((entry) => {
      const filePath = entry.filePath;
      const paragraphs = fs.readFileSync(filePath, 'utf-8');

      data.push({
        url: entry.url,
        ipAddress: ipAddress,
        paragraphs,
        createdAt: entry.createdAt
      });
    });

    res.json(data);
  } catch (error) {
    console.error('Error reading data from MongoDB:', error);
    res.status(500).json({ error: 'Failed to read data from MongoDB' });
  }
};











// helper function to get the sitemap


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
