const { PrismaClient } = require('@prisma/client');
const UserRepository = require('../repositories/user-repository');
const prisma = new PrismaClient();
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcrypt');
const { Auth, Enums } = require('../utils/common');



const UserRepo=new UserRepository();


async function create(data) {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;


        const user = await UserRepo.create(data);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);

        if(error.name == 'PrismaClientValidationError') {
            if (error.errors) {
              let explanation = [];
              error.errors.forEach((err) => {
                explanation.push(err.message);
              });
              throw new AppError(explanation, StatusCodes.BAD_REQUEST);
            } else {
              // Handle the case where error.errors is undefined
              throw new AppError('Unknown error', StatusCodes.BAD_REQUEST);
            }
          }
          throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
      }
}

async function signin(data) {
    try {
        const user = await UserRepo.getUserByEmail(data);
        if(!user) {
            throw new AppError('No user found for the given email', StatusCodes.NOT_FOUND);
        }
        const passwordMatch = Auth.checkPassword(data.password, user.password);
        console.log("password match", passwordMatch)
        if(!passwordMatch) {
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        }
        const jwt = Auth.createToken({id: user.id, email: user.email});
        return jwt;
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}




module.exports={
    create,
    signin
}