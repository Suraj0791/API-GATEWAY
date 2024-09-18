
const { PrismaClient } = require('@prisma/client');

const CrudRepository = require('./crud-repository');

const prisma = new PrismaClient();




class UserRepository extends CrudRepository {
    constructor() {
        super(prisma.user);
    }
}

 module.exports = UserRepository;
