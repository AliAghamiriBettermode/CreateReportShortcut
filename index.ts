import express, {Request, Response, NextFunction} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {errors} from "./consts/errors.js";
import {extendMorganTokens} from "./utils/morgan-tokens.js";
import {handleResponse} from "./utils/response-handler.js";
import webhookRouter from "./router/webhook-router.js";


extendMorganTokens();

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :errors'));
app.use(cors());

app.get('/', (req, res) => {
	res.json({success: true, message: `Server is up and running! ${new Date().toISOString()}`});
});

app.use('/webhook', webhookRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.dir('Error caught in client err_func', {colors: true});
	console.dir(err, {colors: true});
	console.dir({url: req.originalUrl, body: req.body}, {colors: true});
	return handleResponse(req, res, {success: false, error: errors.INTERNAL_SERVER_ERROR});
});

app.listen(process.env.NODE_APP_PORT || 5001, () => console.log(`Server running on port ${process.env.NODE_APP_PORT || 5001}`));
