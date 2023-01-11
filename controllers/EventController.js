const {validationResult} = require('express-validator');
const ErrorHandler = require('../exeptions/ErrorHandler');
const eventService = require('../services/EventService');
const photoService = require('../services/PhotoService');

class AuthController {

    async createEvent(request, response, next) {
        try {
            const errors = validationResult(request);
            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {name, description, country, city, street, house_number, people_limit, category_id, price,
                time_start, time_end} = request.body;
            const {user} = request;
            
            const event = await eventService.create(user.id, name, description, country, city, street, house_number, 
                people_limit, category_id, price, time_start, time_end);

            return response.status(201).json(event);
        }
        catch(e) {
            next(e);
        }
    }


    async getEvent(request, response, next) {
        try {

            const id = request.params.id;
            const event = await eventService.getById(id);

            return response.status(200).json(event);
        }
        catch(e) {
            next(e);
        }
    }

    
    async getEventPhoto(request, response, next) {
        try {

            const id = request.params.id;
            const photo = photoService.getEventPhotoById(id);
            return response.status(200).end(photo);
        }
        catch(e) {
            next(e);
        }
    }


    async getUserEventsByQueryParams(request, response, next) {
        try {

            const login = request.params.login;
            const {limit, sort, page, type} = request.query;

            const events = await eventService.getByLoginLimitSortTypePage(login, limit, sort, type, page);

            return response.status(200).json(events);
        }
        catch(e) {
            next(e);
        }
    }


    async getAllEventsByQueryParams(request, response, next) {
        try {

            const {country, city, limit, sort, page, type} = request.query;
            const events = await eventService.getByCountyCityLimitSortTypePage(country, city, limit, sort, type, page);

            return response.status(200).json(events);
        }
        catch(e) {
            next(e);
        }
    }


    async getNearEventsByQueryParams(request, response, next) {
        try {

            const ip = request.params.ip;
            const {limit, sort, page, type} = request.query;
            const events = await eventService.getNearEventsByIpLimitSortTypePage(ip, limit, sort, type, page);

            return response.status(200).json(events);
        }
        catch(e) {
            next(e);
        }
    }


    async getSignedEventsByQueryParams(request, response, next) {
        try {

            const login = request.params.login;
            const {limit, sort, page, type} = request.query;
            const events = await eventService.getSignedUserEventsByLoginLimitSortTypePage(login, limit, sort, type, page);

            return response.status(200).json(events);
        }
        catch(e) {
            next(e);
        }
    }


    async updateEvent(request, response, next) {
        try {
            const errors = validationResult(request);
            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {name, description, country, city, street, house_number, people_limit, category_id,
                time_start, time_end, active} = request.body;
            const id = request.params.id;
            
            await eventService.updateById(id, name, description, country, city, street, house_number, 
                people_limit, category_id, time_start, time_end, active);

            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async uploadPhoto(request, response, next) {
        try {

            if (!request.files || Object.keys(request.files).length === 0) {
                return next(ErrorHandler.BadRequest('No files were uploaded'));
            }
            const id = request.params.id;
            photoService.uploadEventPhotoById(id, request.files.file);

            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async deleteEvent(request, response, next) {
        try {

            const id = request.params.id;
            await eventService.deleteById(id);

            return response.status(204).json();
        }
        catch(e) {
            next(e);
        }
    }


    async deleteEventPhoto(request, response, next) {
        try {

            const id = request.params.id;
            photoService.deleteEventPhotoById(id);

            return response.status(204).json();
        }
        catch(e) {
            next(e);
        }
    }

}


module.exports = AuthController;