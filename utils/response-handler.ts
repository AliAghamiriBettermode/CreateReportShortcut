import {errors} from "../consts/errors.js";

export function handleResponse(req: any, res: any, result: any, statusCode?: number) {
	if (!result) {
		res.locals.error = errors.INTERNAL_SERVER_ERROR.message.en;
		// @ts-ignore
    return res.status(400).json({success: false, error: errors.INTERNAL_SERVER_ERROR.key, error_message: errors.INTERNAL_SERVER_ERROR.message[req.headers.language || 'en']});
	}
	if (result.success) {
		return res.json(result);
	} else {
		res.locals.error = result.error;
		return res
			.status(statusCode || result.error.responseCode || 400)
			.json({
				success: false,
				error: result.error.key,
				error_message: result.error
			});
	}
}
