import {BinaryLike, KeyObject, createHmac, timingSafeEqual} from 'crypto';

export const getSignature = ({secret, body, timestamp}: { secret: BinaryLike | KeyObject, body: any, timestamp: number }) => {
	return createHmac('sha256', secret).update(`${timestamp}:${body}`).digest('hex');
};

const MILLISECONDS_IN_MINUTE = 1000 * 60;

export const verifySignature = ({signature, secret, body, timestamp}: { signature: string, secret: BinaryLike | KeyObject, body: any, timestamp: number }) => {
	const timeDifference = (timestamp - new Date().getTime()) / MILLISECONDS_IN_MINUTE;
	if (timeDifference > 5) return false;
	const hash = getSignature({secret, body, timestamp});
	return timingSafeEqual(Buffer.from(signature), Buffer.from(hash));
};

export const encodeBase64 = (data: string) => Buffer.from(data).toString('base64');
