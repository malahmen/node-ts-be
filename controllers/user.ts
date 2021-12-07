import { Request, Response, NextFunction } from 'express';
import AuthenticationAuthority from './../helpers/Auth';
import User from './../models/user';

const Agent     = new AuthenticationAuthority();
const userModel = new User();

class UserController {
    
    // CREATES A NEW USER
    createUser = async (request: Request, response: Response) => {
        try {
            const currentUser = await User.createUser({
                name :     request.body.name,
                surname :  request.body.surname,
                email :    request.body.email,
                password : Agent.hashUserPassword( request.body.password )
            });
            return response.status(200).send(JSON.stringify(currentUser));
        } catch (error) {
            console.error( JSON.stringify(error));
            return response.status(500).send("There was a problem adding the information to the database.");
        }
    }

    // RETURNS ALL THE USERS IN THE DATABASE - CHECK IF REQUEST IS NEEDED
    getAllUsers = async (request: Request, response: Response) => {
        try {
            const users = await User.getAll();
            return response.status(200).send(JSON.stringify(users));
        } catch(error) {
            console.error( JSON.stringify(error));
            return response.status(500).send("There was a problem finding the users.");
        }
    }

    // GETS A SINGLE USER FROM THE DATABASE BY ID
    getUserById = async (request: Request, response: Response) => {
        try {
            const currentUser = await User.getUserById( request.body.id );
            if (!currentUser) return response.status(404).send("No user found.");

            return response.status(200).send(JSON.stringify(currentUser));
        } catch(error) {
            console.error( JSON.stringify(error));
            return response.status(500).send("There was a problem finding the user.");
        }
    }

    // GETS A SINGLE USER FROM THE DATABASE BY EMAIL
    getUserByEmail = async (request: Request, response: Response) => {
        try {
            const currentUser = await User.getUserByEmail( request.body.email );
            if (!currentUser) return response.status(404).send("No user found.");
            return response.status(200).send(JSON.stringify(currentUser));
        } catch(error) {
            console.error( JSON.stringify(error));
            return response.status(500).send("There was a problem finding the user.");
        }
    }

    // DELETES A USER FROM THE DATABASE
    deleteUserById = async ( request:Request, response:Response ) => {
        try {
            const result = await User.deleteUserById( request.body.id );
            return response.status(200).send(" User removed.");
        } catch (error) {
            console.error( JSON.stringify(error));
            return response.status(500).send("There was a problem removing the user information from the database.");
        }
    }

    // UPDATES A SINGLE USER IN THE DATABASE
    updateUserById = async (request: Request, response: Response) => {
        try {
            const currentUser = await User.updateUser( request.body );
            return response.status(200).send(JSON.stringify(currentUser));
        } catch (error) {
            console.error( JSON.stringify(error));
            return response.status(500).send("There was a problem updating the user.");
        }
    }
}

const userController = new UserController();

export {userController};