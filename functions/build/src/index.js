"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formMeasureEvent = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pubsub_1 = require("@google-cloud/pubsub");
const pubSubClient = new pubsub_1.PubSub();
const ACCESS_CONTROL_ALLOW_ORIGIN_REGIX = process.env.ACCESS_CONTROL_ALLOW_ORIGIN_REGIX || 'https?://localhost';
const accessControlAllowOriginRegix = new RegExp(ACCESS_CONTROL_ALLOW_ORIGIN_REGIX);
const API_KEY = process.env.API_KEY;
if (!API_KEY)
    console.warn('API_KEY is blank. So NO API KEY AUTH');
const PUB_SUB_TOPIC = process.env.PUB_SUB_TOPIC || 'form_measure_event_topic';
console.info({
    app_env: {
        ACCESS_CONTROL_ALLOW_ORIGIN_REGIX,
        PUB_SUB_TOPIC,
        'API_KEY is set': API_KEY ? 'yes' : 'no',
    },
});
const pubData = async (data) => {
    try {
        const topic = pubSubClient.topic(PUB_SUB_TOPIC);
        const messageId = await topic.publishMessage({ data });
        return messageId;
    }
    catch (e) {
        if (e && e.message)
            console.error(`Received error while publishing: ${e.message}`);
        else
            console.error(`Received error while publishing, ${e}`);
    }
    return null;
};
const debugData = (req) => {
    var _a;
    return JSON.stringify({
        headers: req.headers,
        rawBody: (_a = req.rawBody) === null || _a === void 0 ? void 0 : _a.toString(),
    });
};
const authApiKey = (key) => {
    return key == API_KEY;
};
const formMeasureEvent = async (req, res) => {
    const origin = req.header('Origin') || '';
    // console.debug(
    //   origin,
    //   accessControlAllowOriginRegix,
    //   origin.match(accessControlAllowOriginRegix)
    // );
    if (origin.match(accessControlAllowOriginRegix)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }
    else if (req.url.match(/\/fmet/) && req.method === 'POST') {
        if (API_KEY && !authApiKey(`${req.query['api_key']}`)) {
            res.status(401).send('Unauthorized');
            return;
        }
        if (req.rawBody) {
            const messgaeId = await pubData(req.rawBody)
                .then(messageId => {
                console.log(`messageId:${messageId} published`);
                res.send('OK');
            })
                .catch(e => {
                console.error(e, debugData(req));
                res.status(500).send('');
            });
        }
        else {
            console.log(req.url);
            res.status(400).send('Bad Request');
        }
    }
    else {
        res.status(404).send('Not Found');
    }
};
exports.formMeasureEvent = formMeasureEvent;
//# sourceMappingURL=index.js.map