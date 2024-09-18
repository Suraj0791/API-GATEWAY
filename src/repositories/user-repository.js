
const { PrismaClient ,User} = require('@prisma/client');

const CrudRepository = require('./crud-repository');

const prisma = new PrismaClient();




class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getUserByEmail(data) {
        const { email } = data;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        return user;
    }

}

 module.exports = UserRepository;
