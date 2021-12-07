import { Router } from "express";
import * as bodyParser from 'body-parser';
import AuthenticationAuthority from './helpers/Auth';

import { userController } from './controllers/user';
import { authenticationController } from './controllers/Authentication';

const Agent  = new AuthenticationAuthority();
const router = Router();
// SETUP ROUTER
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// USER
router.post('/users/',      Agent.verifyToken, userController.createUser);
router.get('/users/',       Agent.verifyToken, userController.getAllUsers);
router.get('/users/:id',    Agent.verifyToken, userController.getUserById);
router.delete('/users/:id', Agent.verifyToken, userController.deleteUserById);
router.put('/users/:id',    Agent.verifyToken, userController.updateUserById);
// AUTHENTICATION CONTROLLER - ADMINISTRATION MODULE
router.get('/me', 		 Agent.verifyToken, authenticationController.infoAboutUser);
router.post('/register', authenticationController.register);
router.get('/login', 	 authenticationController.login);
router.get('/logout', 	 authenticationController.logout);


// export the updated router
export default router;
