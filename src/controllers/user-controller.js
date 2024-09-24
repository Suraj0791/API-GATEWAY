const{StatusCodes}=require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const{UserService}= require('../services');



//POST = /signup
// req-body {email:'abc@gmail.com',password='1235'}
async function signup(req, res) {
    try {
        const user = await UserService.create( {
            email: req.body.email,
            password: req.body.password
        } );
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error; 
        return res
                .status(error.statusCode || 500)
                .json(ErrorResponse);
    }
}

async function signin(req, res) {
    try {
        const data = req.body;
        const user = await UserService.signin(
           data
        );
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode || 500)
                .json(ErrorResponse);
    }
}

async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoleToUser({
            role: req.body.role,
            id: req.body.id
        });
        SuccessResponse.data = user;
        return res
            .status(StatusCodes.OK) // Use OK since it's an update
            .json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error = error.message || 'An error occurred while adding role';
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}


module.exports={
    signup,
    signin,
    addRoleToUser
}