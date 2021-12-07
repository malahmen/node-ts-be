import { Request, Response, NextFunction } from "express";
import * as bodyParser from "body-parser";

import AuthenticationAuthority from './../helpers/Auth';
import ResponseFormatter from './../helpers/ResponseFormater';
import User from './../models/user';
import { User as UserInterface } from '../interfaces/user';

class AuthenticationController{

  agent          = new AuthenticationAuthority();
  responseFormat = new ResponseFormatter(); 

  // LOGIN HAPPENS HERE
  login = async (request: Request, response: Response) => {
    try {
      User.build();

      let currentUser = <User>( await User.getUserByEmail( request.body.email ) );

      // if user is found
      if (!currentUser) return response.status(404).send(this.responseFormat.apply('That user is lost.'));

      // if user ID is found
      if (!currentUser.id) return response.status(404).send(this.responseFormat.apply('That user is strange.'));

      // when we get the user by email, the password skips the response payload, so we need to get the user again 
      currentUser = <User>(await User.findByPk( currentUser.id ));

      // paranoia checks if user is found
      if (!currentUser) return response.status(404).send(this.responseFormat.apply('That user is really lost.'));

      // if user has password
      if (!currentUser.password) return response.status(404).send(this.responseFormat.apply('That user has memory loss.'));

      // if the password is valid
      if (!this.agent.isValidPassword(request.body.password, currentUser.password)) return response.status(401).send({ auth: false, token: null });

      // create a token
      const token = this.agent.generateTokenForUserID(currentUser.id! as unknown as string);

      // return the information including token as JSON
      return response.status(200).send({ auth: true, token: token });
    } catch(error) {
      console.log(JSON.stringify(error));
      return response.status(500).send(this.responseFormat.apply('Server side error.'));
    }
  }

  // USELESS LOGOUT JUST BECAUSE
  logout = (request: Request, response: Response) => {
    return response.status(200).send({ auth: false, token: null });
  }

  // REGISTER IS HERE
  register = async (request: Request, response: Response) => {
    try {
      // check for the password
      if (!request.body.password) return response.status(404).send(this.responseFormat.apply('Password required.'));

      const hashedPassword = this.agent.hashUserPassword(request.body.password);

      if (!hashedPassword) return response.status(500).send(this.responseFormat.apply('Error processing password.'));

      // replace the password for the hashed value
      request.body.password = hashedPassword;

      // register the user
      const user = <User>( await User.createUser( request.body ));
    
      response.status(200).send( JSON.stringify(user) );  
    } catch( error ) {
      console.log(JSON.stringify(error));
      return response.status(500).send(this.responseFormat.apply('Server side error.')); 
    }
  }

  // USER INFORMATION
  infoAboutUser = async (request: Request, response: Response) => {
    try {
      if ( response.locals.userId != request.body.id ) return response.status(401).send(this.responseFormat.apply("If I told you, I would have to kill you."));
      const user = await User.getUserById( request.body.id );
      if (!user) return response.status(404).send(this.responseFormat.apply("Who are you?"));
      response.status(200).send(user);
    } catch(error) {
      console.log(JSON.stringify(error));
      if (error) return response.status(500).send(this.responseFormat.apply("You just crashed the server...hacker."));
    }
  }
}

const authenticationController = new AuthenticationController();

export {authenticationController};
