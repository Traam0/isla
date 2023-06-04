/** @format */

import jswt from "jsonwebtoken";
// const jswt = require('jsonwebtoken')

export function signToken(payload: object, expiresIn: string): string {
	return jswt.sign(payload, process.env.JSWT_SECRET as string, {
		expiresIn,
	});
}
