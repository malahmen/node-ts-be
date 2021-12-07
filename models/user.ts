import { DataTypes, Model, Error } from 'sequelize';
import sequelizeConnection from '../connection';
import { User as UserInterface } from '../interfaces/user';
import ResponseFormatter from './../helpers/ResponseFormater';

class User extends Model {

	public id!: number;
	public name!: string;
	public surname!: string;
	public email!: string;
	public password!: string;

	static async getAll() {
		let users = await this.findAll({ attributes: { exclude: ['password'] } });
		return this.parseResults( users );
	}

	static async getUserById( user_id:number ) {
		return await this.findByPk( user_id, { attributes: { exclude: ['password'] } });
	}

	static async getUserByEmail( email:string ) {
		return await this.findOne({ where: { email: email }, attributes: { exclude: ['password'] } });
	}

	static async createUser( user:UserInterface ) {
		const transaction = await sequelizeConnection.transaction();
        let payload: User;
        try {
            const currentUser = await this.create({
                firstName : user.name,
                lastName :  user.surname,
                email :     user.email,
                password :  user.password
            }, { transaction });
            payload = await currentUser;
            await transaction.commit();
            return this.parseResult(payload);
        } catch (error) {
            await transaction.rollback();
            console.error(JSON.stringify(error));
            return error;
        }
	} 

	static async updateUser( user:UserInterface ) {
		const transaction = await sequelizeConnection.transaction();
        try {
        	if (!user.id) throw new Error( "No user found." );
            let currentUser = await User.findByPk( user.id);
            if (!currentUser) throw new Error( "No user found." );
            currentUser.update( user, { transaction: transaction } );
            await transaction.commit();
            return this.parseResult(currentUser);
        } catch (error) {
            await transaction.rollback();
            console.error(JSON.stringify(error));
            return error;
        }
	}

	static async deleteUserById( user_id:number ) {
		const transaction = await sequelizeConnection.transaction();
        try {
            const currentUser = await this.findByPk( user_id );         
            if (!currentUser) throw new Error( "No user found." );
            await currentUser.destroy({transaction});
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error(JSON.stringify(error));
            return error;
        }
	}

	static parseResult( originalResult:User ) {
		try {
			let result:User;
			result = originalResult;
			if ( result.password ) { delete result.dataValues.password; } // hammer time to avoid returning the user password upon registration - needs better solution
			return result;
		} catch( error ) {
			console.error(JSON.stringify(error));
            return error;
		}
	}

	static parseResults( originalResults:User[] ) {
		return originalResults.map( ( userData ) => {
			return this.parseResult( userData );	
		} );
	}
}

User.init({
	// Model attributes are defined here
	firstName: {
		type: DataTypes.STRING,
		allowNull: false,
		//unique: true
		validate: {
			len: [3, 125]
		}
	},
	lastName: {
		type: DataTypes.STRING,
		// allowNull defaults to true
		validate: {
			customValidator(value:string) {
				if (value === null && this.firstName === null) {
					throw new Error("There can be only one empty name.");
				}
			}
		}
	},
	email: {
		type: DataTypes.STRING,
    	allowNull: false,
    	unique: <any> { 
    		args: true,
    		msg: 'Email Address must be unique' 
    	},
		validate: {
			isEmail: true
			
		}
	},
	password: {
		type: DataTypes.STRING,
    	allowNull: false,
	    validate: {
			is: /^[0-9a-f]*/i
		}
	}
}, {
	// Other model options go here
	sequelize: sequelizeConnection, // We need to pass the connection instance
	modelName: 'User', // We need to choose the model name
});

//User.sync({force:true}); // use to truncate the users table every time the server comes up
//User.sync();

export default User;