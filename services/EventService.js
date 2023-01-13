const GeocodingAPI = require('../api/GeocodingAPI');
const EventDto = require('../dtos/EventDto');
const UserLinkDto = require('../dtos/UserLinkDto');
const ErrorHandler = require('../exeptions/ErrorHandler');
const CategoryModel = require('../models/Category');
const EventModel = require('../models/Event');
const UserModel = require('../models/User');
const WalletModel = require("../models/Wallet");
const PhotoService = require('./PhotoService');


class EventService {


    async create(author_id, name, description, country, city, street, house_number,
        people_limit, category_id, price, time_start, time_end) {

        console.log("Create event with name: " + name);

        const user = await UserModel.findById(author_id);
        if (!user) {
            throw ErrorHandler.BadRequest("User not found");
        }

        if (time_start < Date.now()) {
            throw ErrorHandler.BadRequest(`You cannot create an event in the past`);
        }

        if (time_end - time_start < 1800000) {
            throw ErrorHandler.BadRequest("The event must last at least 30 minutes");
        }

        const category = await CategoryModel.findById(category_id);
        if (!category) {
            throw ErrorHandler.BadRequest("Category not found");
        }

        const position = await GeocodingAPI.getCoordinates(country, city, street, house_number);
        if (!position) {
            throw ErrorHandler.BadRequest("Coordinates at this address not found");
        }

        const event = await EventModel.create({
            author_id: author_id,
            name: name,
            description: description,
            country: country,
            city: city,
            street: street,
            house_number: house_number,
            lat: position.lat,
            lng: position.lng,
            people_limit: people_limit,
            category_id: category_id,
            price: price,
            time_start: time_start,
            time_end: time_end
        });

        const eventDto = new EventDto(event, user, category);
        return eventDto;
    }


    async getById(id) {
        console.log("Get event with id: " + id);

        const event = await EventModel.findById(id);
        if (!event) {
            throw ErrorHandler.BadRequest("Event not found");
        }

        const user = await UserModel.findById(event.author_id);
        if (!user) {
            throw ErrorHandler.BadRequest("User not found");
        }

        const category = await CategoryModel.findById(event.category_id);
        if (!category) {
            throw ErrorHandler.BadRequest("Category not found");
        }

        const eventDto = new EventDto(event, user, category);
        return eventDto;
    }


    async #getByConditionLimitSortTypePage(condition, limit, sort, type, page) {
        if (limit && limit < 0) {
            throw ErrorHandler.BadRequest("Limit should be more than 0");
        }

        if (page && page < 0) {
            throw ErrorHandler.BadRequest('Page should be more than 0');
        }

        if (sort && sort !== 'earliest' && sort !== 'latest' && sort !== 'popular') {
            throw ErrorHandler.BadRequest("Sort should be 'earliest', 'latest' or 'popular'");
        }

        if (type && type !== 'active' && type !== 'inactive') {
            throw ErrorHandler.BadRequest("Type should be 'active' or 'inactive'");
        }


        if (!limit) {
            limit = 10;
        }

        if (!sort) {
            sort = 'earliest';
        }

        if (!page) {
            page = 0;
        }

        let sorting = {};
        if (sort === 'latest') {
            sorting = { time_start: 1 };
        }
        else if (sort === 'earliest') {
            sorting = { time_start: -1 };
        }
        else if (sort === 'popular') {
            sorting = { likes: -1 };
        }

        let active = {};
        if (type === 'inactive') {
            active = { active: false };
        }
        else if (type === 'active') {
            active = { active: true };
        }

        console.log(`Get page of event with limit: ${limit}, sort: '${sort}', page: ${page}, type: '${type}'`);

        page++;

        const events = await EventModel.find({ $and: [condition, active] })
            .limit(limit)
            .skip(page > 0 ? ((page - 1) * limit) : 0)
            .sort(sorting);

        const eventsDto = [];

        for (var i = 0; events[i]; i++) {
            const user = await UserModel.findById(events[i].author_id);
            const category = await CategoryModel.findById(events[i].category_id);

            eventsDto.push(new EventDto(events[i], user, category));
        }

        return eventsDto;
    }


    async getByLoginLimitSortTypePage(login, limit, sort, type, page) {
        console.log(`Get page of event for user '${login}' with limit: ${limit}, sort: '${sort}', page: ${page}, type: '${type}'`);

        const user = await UserModel.findOne({ login });
        if (!user) {
            throw ErrorHandler.BadRequest(`User with login '${login}' not found`);
        }

        const condition = { author_id: user._id };
        return await this.#getByConditionLimitSortTypePage(condition, limit, sort, type, page);
    }


    async getByCountyCityLimitSortTypePage(country, city, limit, sort, type, page) {
        console.log(`Get page of event for country '${country}' and city ${city} with limit: ${limit}, sort: '${sort}', page: ${page}, type: '${type}'`);

        let condition = {};
        if (country && city) {
            condition = { $and: [{ country: country }, { city: city }] };
        }
        else if (country) {
            condition = { country: country };
        }
        else if (city) {
            condition = { city: city };
        }

        return await this.#getByConditionLimitSortTypePage(condition, limit, sort, type, page);
    }


    async getNearEventsByIpLimitSortTypePage(ip, limit, sort, type, page) {
        console.log(`Get page of event by ip ${ip} with limit: ${limit}, sort: '${sort}', page: ${page}, type: '${type}'`);

        const coordinates = await GeocodingAPI.getCoordinatesByIp(ip);

        if (!coordinates) {
            throw ErrorHandler.BadRequest("Ip address not correct");
        }

        console.log(coordinates)

        const size_for_find = 2;

        const condition = {
            $and: [
                { lat: { $gt: coordinates.latitude - size_for_find, $lt: coordinates.latitude + size_for_find } },
                { lng: { $gt: coordinates.longitude - size_for_find, $lt: coordinates.longitude + size_for_find } }
            ]
        }

        return await this.#getByConditionLimitSortTypePage(condition, limit, sort, type, page);
    }


    async getSignedUserEventsByLoginLimitSortTypePage(login, limit, sort, type, page) {
        console.log(`Get page of signed event for user '${login}' with limit: ${limit}, sort: '${sort}', page: ${page}, type: '${type}'`);

        const user = await UserModel.findOne({ login });
        if (!user) {
            throw ErrorHandler.BadRequest(`User with login '${login}' not found`);
        }

        const condition = { '_id': { $in: user.available_events } };
        return await this.#getByConditionLimitSortTypePage(condition, limit, sort, type, page);
    }


    async getSubscribersOfEventByEventId(id, limit, page) {
        console.log("Get page of subscribers of event with id: " + id + " and with limit: " + limit + " and page: " + page);

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

        const event = await EventModel.findById(id);
        if (!event) {
            throw ErrorHandler.BadRequest(`Event with id ${id} not found`);
        }

        page++;
        const subscribers = await UserModel.find({ '_id': { $in: event.subscribers } })
            .limit(limit)
            .skip(page > 0 ? ((page - 1) * limit) : 0);
        const subscribersDto = [];

        for (var i = 0; subscribers[i]; i++) {
            subscribersDto.push(new UserLinkDto(subscribers[i]));
        }

        return subscribersDto;
    }


    async updateById(id, name, description, country, city, street, house_number,
        people_limit, category_id, time_start, time_end, active) {

        console.log("Update event with id: " + id);

        const event = await EventModel.findById(id);
        if (!event) {
            throw ErrorHandler.BadRequest("Event not found");
        }

        if (name && event.name !== name) {
            event.name = name;
        }

        if (description && event.description !== description) {
            event.description = description;
        }

        if (country && event.country !== country) {
            event.country = country;
        }

        if (city && event.city !== city) {
            event.city = city;
        }

        if (street && event.street !== street) {
            event.street = street;
        }

        if (house_number && event.house_number !== house_number) {
            event.house_number = house_number;
        }

        if (active !== undefined && event.active !== active) {
            event.active = active;
        }

        if (country || city || street || house_number) {
            const position = await GeocodingAPI.getCoordinates(event.country, event.city, event.street, event.house_number);
            if (!position) {
                throw ErrorHandler.BadRequest("Coordinates at this address not found");
            }

            event.lat = position.lat;
            event.lng = position.lng;
        }

        if (people_limit && event.people_limit !== people_limit) {
            if (people_limit < event.subscribers.length) {
                throw ErrorHandler.BadRequest("People limit can be less of number of subscribers")
            }
            event.people_limit = people_limit;
        }

        if (category_id && String(event.category_id) !== category_id) {
            if (!await CategoryModel.findById(category_id)) {
                throw ErrorHandler.BadRequest("Category not found");
            }
            event.category_id = category_id;
        }

        if (time_start && time_start < Date.now()) {
            throw ErrorHandler.BadRequest(`You cannot create an event in the past`);
        }

        if (time_end && time_end < Date.now()) {
            throw ErrorHandler.BadRequest(`You cannot create an event in the past`);
        }

        if (time_start && time_end) {
            if (time_end - time_start < 1800000) {
                throw ErrorHandler.BadRequest("The event must last at least 30 minutes");
            }
            event.time_start = time_start;
            event.time_end = time_end;
        }
        else if (time_start && event.time_start !== time_start) {
            if (event.time_end - time_start < 1800000) {
                throw ErrorHandler.BadRequest("The event must last at least 30 minutes");
            }
            event.time_start = time_start;
        }
        else if (time_end && event.time_end !== time_end) {
            if (time_end - event.time_start < 1800000) {
                throw ErrorHandler.BadRequest("The event must last at least 30 minutes");
            }
            event.time_end = time_end;
        }
        await event.save();
    }


    async deleteById(id) {
        const event = await EventModel.findById(id);
        if (!event) {
            throw ErrorHandler.BadRequest("Event not found");
        }

        if (event.time_end < Date.now()) {
            PhotoService.deleteEventPhotoById(id);
            await EventModel.findByIdAndDelete(id);
            return;
        }

        let author_wallet;
        if (event.price !== 0) {
            author_wallet = await WalletModel.findOne({ user_id: event.author_id });
        }

        const subscribers = event.subscribers;

        for (var i = 0; subscribers[i]; i++) {
            const user = await UserModel.findById(subscribers[i]);
            if (!user) {
                console.log("User with id " + subscribers[i] + " not found, continue");
                continue;
            }

            const indexOfEvent = user.available_events.indexOf(event._id);
            user.available_events.splice(indexOfEvent, 1);

            if (event.price !== 0) {
                const wallet = await WalletModel.findOne({ user_id: user._id });
                wallet.amount += Number(event.price);
                author_wallet -= Number(event.price);
                wallet.save();
            }
            user.save();
        }

        if (event.price !== 0) {
            await author_wallet.save();
        }

        PhotoService.deleteEventPhotoById(id);
        await EventModel.findByIdAndDelete(id);
    }

}

module.exports = new EventService();