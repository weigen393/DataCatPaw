require('dotenv').config();

const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const http = require('http');

let serverHost = '';
http.get({ host: 'api.ipify.org', port: 80, path: '/' }, (res) => {
    res.on('data', (ip) => {
        // console.log(`My public IP address is: ${ip}`);
        serverHost = ip.toString();
    });
});

class DataCatPaw {
    constructor(data) {
        this.token = data.token;
        this.org = data.org;
        this.bucket = data.bucket;
        this.url = data.url;
    }

    async catPaw(name, value) {
        const client = new InfluxDB({ url: this.url, token: this.token });
        const writeApi = client.getWriteApi(this.org, this.bucket);
        const point = new Point('api').tag('host', serverHost).floatField(name, `${value}`);
        writeApi.writePoint(point);

        return writeApi
            .close()
            .then(() => {
                console.log('WRITE FINISHED');
            })
            .catch((e) => {
                console.error(e);
                console.log('WRITE Finished ERROR');
            });
    }

    sendToInflux(record, params) {
        const client = new InfluxDB({ url: params.url, token: params.token });
        const writeApi = client.getWriteApi(params.org, params.bucket);
        const point = new Point('api')
            .tag('protocol', `${record.protocol}`)
            .tag('method', `${record.method}`)
            .tag('host', serverHost)
            .tag('url', `${record.url}`)
            .tag('statusCode', `${record.statusCode}`)
            .floatField('startTime', `${record.startTime}`)
            .floatField('duration', `${record.duration}`);
        writeApi.writePoint(point);
        return writeApi
            .close()
            .then(() => {})
            .catch((e) => {
                console.error('DataCatPaw Write Error', e);
            });
    }

    dataCat() {
        const { sendToInflux } = this;
        const params = {
            url: this.url,
            token: this.token,
            org: this.org,
            bucket: this.bucket,
        };
        return function (req, res, next) {
            const start = Date.now();
            const oldSend = res.send;
            res.send = (data) => {
                const record = {
                    protocol: req.protocol,
                    method: req.method,
                    host: serverHost,
                    url: req.originalUrl.split('?')[0],
                    statusCode: res.statusCode,
                    startTime: start,
                    duration: Date.now() - start,
                };
                sendToInflux(record, params);
                oldSend.apply(res);
            };
            return next();
        };
    }
}

module.exports = DataCatPaw;
