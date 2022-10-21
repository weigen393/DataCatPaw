# DataCatPaw

An open source npm package to collect data to InfluxDB for Node.js and express server .

Helps monitoring application with [DataCat](https://github.com/weigen393/DataCat).

# Features

-   Send request method, host, status code, duration time to InfluxDB when sending every response.
-   Collecting customized data to InfluxDB.

# Install

```
npm install @weigen393/datacatpaw
```

# Initialization

Put this in front of API routes.

Set InfluxDB parameters so that data can be sent to the specified database.

```js
const express = require('express');
const app = express();

const DataCatPaw = require('./dataCatPaw');
const cat = new DataCatPaw({
    token: INFLUXDB_TOKEN,
    org: INFLUXDB_ORG,
    bucket: INFLUXDB_BUCKET,
    url: INFLUXDB_URL,
});

app.use(cat.dataCat());
```

# Collect customized data

```js
cat.catPaw(SEND_TAG, SEND_DATA);
```

Tag name and Data will be sent to InfluxDB.

# Contact

Thanks for using DataCatPaw :smile_cat: :paw_prints:

Email: weigen393@gmail.com
