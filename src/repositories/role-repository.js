const CrudRepository = require('./crud-repository');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const Role = prisma.role;



class RoleRepository extends CrudRepository {
    constructor() {
        super(Role);
    }

    async getRoleByName(name) {
        const role = await Role.findOne({ where: { name: name } });
        return role;
    }
}

module.exports = RoleRepository;