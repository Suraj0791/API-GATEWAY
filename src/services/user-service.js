const { PrismaClient } = require('@prisma/client');
const UserRepository = require('../repositories/user-repository');
const prisma = new PrismaClient();
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcrypt');


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

module.exports={
    create
}