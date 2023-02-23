const UserModel = require('../models/User');
const ErrorHandler = require('../exceptions/ErrorHandler');


class UserRepository {

    async findById(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw ErrorHandler.BadRequest(`User with id ${id} not found`);
        }
        return user;
    }


    async findByLogin(login) {
        const user = await UserModel.findOne({ login });
        if (!user) {
            throw ErrorHandler.BadRequest(`User with login '${login}' not found`);
        }
        return user;
    }


    async findByParams(condition, limit, page, sort = {}) {
        if (limit && limit < 0) {
            throw ErrorHandler.BadRequest("Limit should be more than 0");
        }
        if (page && page < 0) {
            throw ErrorHandler.BadRequest('Page should be more than 0');
        }

        if (!limit) {
            limit = 30;
        }
        if (!page) {
            page = 0;
        }

        page++;
        return await UserModel.find(condition)
            .limit(limit)
            .skip(page > 0 ? ((page - 1) * limit) : 0)
            .sort(sort);
    }

}

module.exports = new UserRepository();