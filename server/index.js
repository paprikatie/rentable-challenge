// Server dependencies
const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const axios = require('axios')

// XML Dependencies
const { parseString } = require('xml2js');
const promisify = require('util').promisify;
const parseStringAsync = promisify(parseString);

// DB Setup
const { Properties } = require('../database');

// Server setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// XML Handlers
const getParsedXML = async (url) => {
  try {
    const { data } = await axios.get(url);
    const parsedXML = await parseStringAsync(data);
    return parsedXML;
  } catch(e) {
    throw new Error(e);
  }
}

const reformatXML = (parsedXML, searchCity) => {
  const reformattedProperties = [];

  const oldProperties = parsedXML['PhysicalProperty']['Property'];

  for (let i = 0; i < oldProperties.length; i++) {
    let propertyData = oldProperties[i]['PropertyID'];

    if (Array.isArray(propertyData)) {
      propertyData = propertyData[0];
    }

    const location = propertyData['Address'][0]['City'][0];

    if (location.toLowerCase() === searchCity.toLowerCase()) {
      const newPacket = 
      {
        property_id: propertyData['Identification'][0]['$']['IDValue'],
        name: propertyData['MarketingName'][0],
        email: propertyData['Email'][0],
      };
      
      reformattedProperties.push(newPacket);
    }
  }

  return reformattedProperties;
}

// DB Handlers
const storeProperties = async (propertiesList) => {
  try {
    await Properties.insertMany(propertiesList);
    return 'OK';
  } catch (e) {
    throw new Error(e);   
  }
}

const getProperties = async () => {
  try {
    const data = await Properties.find({});
    return data;
  } catch (e) {
    throw new Error(e);
  }
}


// Added options to provide a XML url and search_city, could expand to make even more scalable
app.post('/api/parse-xml', async (req, res) => {
  try {
    const { xml_url, search_city } = req.body;
    const parsedXML = await getParsedXML(xml_url);
    const newProperties = reformatXML(parsedXML, search_city);
    // const response = await storeProperties(newProperties);
    
    res.status(201).json(newProperties); //or response to show if data stored in db properly
  } catch(e) {
    console.log(e);
    res.status(500).json(e);
  }
});

app.get('/api/get-all-properties', async (req, res) => {
  try {
    const properties = await getProperties();
    res.status(200).json(properties);
  } catch(e) {
    console.log(e);
    res.status(500).json(e);
  }
});

app.listen(PORT, () => console.log(`App listening @ localhost:${PORT}`));