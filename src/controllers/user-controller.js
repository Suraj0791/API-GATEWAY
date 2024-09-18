const{StatusCodes}=require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const{UserService}= require('../services');



//POST = /signup
// req-body {email:'abc@gmail.com',password='1235'}
async function signup(req, res) {
    try {
        const data = req.body;
        const user = await UserService.create( data );
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        console.error('error creating user', error);  
        return res
                .status(error.statusCode || 500)
                .json(ErrorResponse);
    }
}

module.exports={
    signup
}