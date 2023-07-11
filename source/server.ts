import * as dotenv from 'dotenv';
import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import posts from '../routes/posts';
import mongoDB from '../Database/mongoDB';

const router: Express = express();
dotenv.config();

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
router.use('/', posts);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: string = process.env.PORT ?? '6060';
console.log(PORT);
httpServer.listen(PORT, async () => {
    console.log(`The server is running on port ${PORT}`)
    await mongoDB.mongoConnect();
});