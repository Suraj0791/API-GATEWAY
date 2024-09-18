const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');


class CrudRepository {
    constructor(model) {
        this.model = model; // Referencing the Prisma model dynamically
    }

    async create(data) {
        const response = await this.model.create({
            data
        });
        return response;
    }

    async destroy(id) {
        const response = await this.model.delete({
            where: {
                id: id
            }
        });
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async get(id) {
        const response = await this.model.findUnique({
            where: {
                id: id
            }
        });
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll() {
        const response = await this.model.findMany();
        return response;

    }

    async update(id, data) {
        const response = await this.model.update({
            where: {
                id: id
            },
            data: data
        });
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = CrudRepository;