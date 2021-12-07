import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcryptjs";

class AuthenticationAuthority {

	isValidPassword(candidate: string, current: string) {
		return bcrypt.compareSync(candidate, current);	
	}

	hashUserPassword(password:string) {
		return bcrypt.hashSync(password, 8);
	}

	generateTokenForUserID( user_id:string ) {
		console.log(process.env.AUTH_TOKEN_TTL);
		return jwt.sign({ id: user_id }, process.env.AUTH_SECRET as jwt.Secret, { algorithm: 'HS256', expiresIn: process.env.AUTH_TOKEN_TTL + 's' }); // that "+ 's" is mandatory
	}

	verifyToken(request: Request, response: Response, next: NextFunction) {
		// check header for token
		const token:string = <string>request.headers['x-access-token'];
		if (!token) return response.status(401).send({ auth: false, message: 'No token provided.' });

		//Try to validate the token and get data
		try {
			const payload = <any>jwt.verify(token, process.env.AUTH_SECRET as jwt.Secret);

			//If token is not valid, respond with 401 (unauthorized)
			if(!payload) return response.status(500).send({ auth: false, message: 'Error validating token.' });

			// if token doesn't identify a user, respond with 401 (unauthorized)
			if(!payload.id) return response.status(401).send({ auth: false, message: 'Invalid token.' });

			// if everything is good, save it for use in other routes
			response.locals.userId = <string>payload.id;
			next();
		} catch (error) {
			console.log(JSON.stringify(error));
			return response.status(500).send({ auth: false, message: 'Error reading token.' });			
		}
	}
}

export default AuthenticationAuthority;