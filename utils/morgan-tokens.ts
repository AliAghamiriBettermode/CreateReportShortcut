import morgan from "morgan";

export function extendMorganTokens() {
	morgan.token('errors', function (req, res) {
		// @ts-ignore
        if (res.locals.error) {
			// @ts-ignore
            return `error: ${res.locals.error}`;
		}
		return '';
	});
}
