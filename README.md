# rentable-challenge
XML Parser coding exercise

## Project Setup

### Pre-requistes
Install MongoDB
- Linux: https://docs.mongodb.com/manual/administration/install-on-linux/
- MacOS: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

### Running the server
Install Project Dependencies
```bash
npm i
```

Start
```bash
npm start
```

# API Documentation

## `/api/parse-xml`

Body
```json
{
  "xml_url" : <String>,
  "search_city" : <String>
}
```
#### `xml_url: Link to XML file to parse`
#### `search_city: City to filter properties by within XML data`

#### Returns: Status Code 200 'OK'

## `/api/get-all-properties`

Returns all properties previously stored in DB

Example:
```json
[
  {
    property_id: <Number>,
    name: <String>,
    email: <String>,
  },
  ...
]
```