# Endpoints

- [Authorization](#authorization)
- [Users](#users)
- [Events](#events)
- [Categories](#categories)
- [Wallets](#wallets)
- [Likes](#likes)
- [Comments](#comments)
- [Notifications](#notifications)


#

<a name="authorization"><h2>Authorization</h2></a>
- **register**
- **login**
- **logout**
- **update tokens**
- **reset password**
- **enter in system with new password**
- **get own profile**
#

`POST - /api/auth/register`

```JavaScript
request:
{
    "firstname": "Firstname",
    "lastname": "Lastname",
    "login": "login",
    "password": "password",
    "email": "example@gmail.com",
}
```
```JavaScript
response:
{
    "accessToken": "some access token",
    "refreshToken": "some refresh token",
    "user": {
        "id": "user_id",
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname",
        "email": "example@gmail.com",
        "role": "user",
        "official": false,
        "description": null
    }
}
```
`Errors:`
- `User with the login {login} already exists`
- `The email {email} already in use`
- `Invalid value: email`
- `Invalid value: firstname (min length: 1, max length: 12)`
- `Invalid value: lastname (min length: 1, max length: 12)`
- `Invalid value: login (min length: 6, max length: 12)`
- `Invalid value: password (min length: 6, max length: 12)`
#
`POST - /api/auth/login`
```JavaScript
request:
{
    "login": "login",
    "password": "password"
}
```
```JavaScript
response:
{
    "accessToken": "some access token",
    "refreshToken": "some refresh token",
    "user": {
        "id": "user_id",
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname",
        "email": "example@gmail.com",
        "role": "user" / "admin",
        "official": true / false,
        "phone_number": "+380999999999", // optional
        "description": "description"
    }
}
```
`Errors:`
- `User with the login {login} not found`
- `Wrong password`
- `Invalid value: login (min length: 6, max length: 12)`
- `Invalid value: password (min length: 6, max length: 12)`
#
`POST - /api/auth/logout`
```JavaScript
request: refresh_token in Cookies
```
```JavaScript
response: status 200
```
`Errors:`
- `No errors`

#

`POST - /api/auth/refresh` - get new tokens by refreshToken in cookies
```JavaScript
request: 'refreshToken' in request.cookies
```
```JavaScript
response:
{
    "accessToken": "some access token",
    "refreshToken": "some refresh token",
    "user": {
        "id": "user_id",
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname",
        "email": "example@gmail.com",
        "role": "user" / "admin",
        "official": true / false,
        "phone_number": "+380999999999", // optional
        "description": "description"
    }
}
```

#

`POST - /api/auth/reset` - reset password by email
```JavaScript
request:
{
    "email": "example@gmail.com"
}
```
```JavaScript
response: status 200
```
`Errors:`
- `User with the email {email} not found`
- `Invalid value: email`
#

`POST - /api/auth/reset/:token`
```JavaScript
request:
{
    "password": "new password"
}
```
```JavaScript
response:
{
    "accessToken": "some access token",
    "refreshToken": "some refresh token",
    "user": {
        "id": "user_id",
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname",
        "email": "example@gmail.com",
        "role": "user" / "admin",
        "official": true / false,
        "phone_number": "+380999999999", // optional
        "description": "description"
    }
}
```
`Errors:`
- `Token not found`
- `User not found`
- `Invalid value: password (min length: 6, max length: 12)`
#

`GET - /api/auth/profile` - get your profile data
```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response:
{
    "id": "user_id",
    "login": "login",
    "firstname": "Firstname",
    "lastname": "Lastname",
    "email": "example@gmail.com",
    "role": "user" / "admin",
    "official": true / false,
    "phone_number": "+380999999999", // optional
    "description": "description"
}
```
`Errors:`
- `User is not authorized`

#

<a name="users"><h2>Users</h2></a>
- **subscribe on user**
- **unsubscribe from user**
- **get user by login**
- **get user photo by login**
- **get all users by query params**
- **get subscribers of user**
- **get followings of user**
- **get own user events by login**
- **get events in which user subscribed by login**
- **update user data by login**
- **update user photo by login**
- **delete user by login**
- **delete user photo by login**

#

`POST - /api/users/:login/subscribe` - subscribe on user

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 202
```
`Errors:`
- `User is not authorized`
- `User with login '{login}' not found`
- `You can't subscribe on yourself`
- `You are already subcriber of this user`

#

`POST - /api/users/:login/unsubscribe` - unsubscribe from user

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 202
```
`Errors:`
- `User is not authorized`
- `User with login '{login}' not found`
- `You are not subcriber of this user`

#

`GET - /api/users/:login` - get user info by login

```JavaScript
response:
{
    "id": "user_id",
    "login": "login",
    "firstname": "Firstname",
    "lastname": "Lastname",
    "email": "example@gmail.com",
    "role": "user" / "admin",
    "official": true / false,
    "phone_number": "+380999999999", // optional
    "description": "description"
}

```
`Errors:`
- `User with login {login} not found`

#

`GET - /api/users/:login/photo` - get user photo by login

If user don't have avatar, he get default photo.

```JavaScript
response: photo
```
`Errors:`
- `No errors`

#

`GET - /api/users` - get all users by query params

`Query params`:
- `limit` (default `30`);
- `sort`: `old`, `new` (default `new`);
- `page` (default `0`). 

```JavaScript
response: 
[
    {
        "id": "id",
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname",
        "email": "example@gmail.com",
        "role": "user / admin",
        "official": true / false,
        "description": "some description"
    },
    ...
]
```

#

`GET - /api/users/:login/subscribers` - get subscribers of user by login

If user don't have subscribers, you get empty array - `[]`.

```JavaScript
response: 
[
    {
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname",
        "official": true / false
    },
    ...
]
```

`Errors:`
- `User with login {login} not found`

#

`GET - /api/users/:login/followings` - get followings (users in which the user subscribed) of user by login

If user don't have followings, you get empty array - `[]`.

```JavaScript
response: 
[
    {
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname",
        "official": true / false
    },
    ...
]
```

`Errors:`
- `User with login {login} not found`

#

`GET - /api/users/:login/events` - get user events he created

If user don't have events, you get empty array - `[]`.

`Query params`:
- `limit` (default `10`);
- `sort`: `earliest`, `latest`, `popular` (default `earliest`);
- `page` (default `0`);
- `type`: `active`, `inactive` (default `active`). 

```JavaScript
response: 
[
    {
        "id": "event id",
        "name": "Event name",
        "author": {
            "login": "login",
            "firstname": "Firstname",
            "lastname": "Lastname"
        },
        "location": {
            "lat": 50.00619,
            "lng": 36.24973,
            "country": "Ukraine",
            "city": "Kharkiv",
            "street": "Pushkinska",
            "house_number": "79/1"
        },
        "category": {
            "id": "category id",
            "name": "lection"
        },
        "people_limit": null, // f.e.
        "price": 0,
        "likes": 0,
        "active": true,
        "time_start": time in ms,
        "time_end": time in ms
    },
    ...
]
```

`Errors:`
- `Limit should be more than 0` 
- `Page should be more than 0`
- `Sort should be 'earliest', 'latest' or 'popular'`
- `Type should be 'active' or 'inactive'`
- `User with login '{login}' not found`

#

`GET - /api/users/:login/events/signed` - get events in which user subscribed

If user don't have events, you get empty array - `[]`.

`Query params`:
- `limit` (default `10`);
- `sort`: `earliest`, `latest`, `popular` (default `earliest`);
- `page` (default `0`);
- `type`: `active`, `inactive` (default `active`). 

```JavaScript
response: 
[
    {
        "id": "event id",
        "name": "Event name",
        "author": {
            "login": "login",
            "firstname": "Firstname",
            "lastname": "Lastname"
        },
        "location": {
            "lat": 50.00619,
            "lng": 36.24973,
            "country": "Ukraine",
            "city": "Kharkiv",
            "street": "Pushkinska",
            "house_number": "79/1"
        },
        "category": {
            "id": "category id",
            "name": "lection"
        },
        "people_limit": null, // f.e.
        "price": 0,
        "likes": 0,
        "active": true,
        "time_start": time in ms,
        "time_end": time in ms
    },
    ...
]
```

`Errors:`
- `Limit should be more than 0` 
- `Page should be more than 0`
- `Sort should be 'earliest', 'latest' or 'popular'`
- `Type should be 'active' or 'inactive'`
- `User with login '{login}' not found`

#

`PUT - /api/users/:login` - update data of user

```JavaScript
request:
{
    // choose fields you want to update
    "firstname": "Firstname",
    "lastname": "Lastname",
    "login": "login",
    "email": "example@gmail.com",
    "official": true / false,
    "description": "About me..."
}
```
```JavaScript
response: status 202
```
`Errors:`
- `User is not authorized`
- `User with login '{login}' not found` (checking login in url)
- `Login '{login}' already in use` (checking login in request body)
- `Email '{email}' already in use`
- `You are not admin. You can change only own information` (if you are user)
- `You have problems with the field of time admin. It's empty` (if you are admin, you should have the field "time_admin" in database. Write to developers with the problem)
- `Admin has problems with the field of time admin. It's empty` (if you try to update of admin's data, he don't have the field "time_admin". Write to developers with the problem)
- `You can't change information of senior admin`

#

`PUT - /api/users/:login/photo` - update user's avatar

```JavaScript
request: file from form-data
```
```JavaScript
response: status 202
```
`Errors:`
- `User is not authorized`
- `User with login '{login}' not found`
- `You are not admin. You can change only own information` (if you are user)
- `You have problems with the field of time admin. It's empty` (if you are admin, you should have the field "time_admin" in database. Write to developers with the problem)
- `Admin has problems with the field of time admin. It's empty` (if you try to update of admin's data, he don't have the field "time_admin". Write to developers with the problem)
- `You can't change information of senior admin`
- `No files were uploaded`
- `File should be only .jpg, .png or .jpeg`
  
#

`DELETE - /api/users/:login/photo` - delete user's avatar

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 204
```
`Errors:`
- `User is not authorized`
- `User with login '{login}' not found`
- `You are not admin. You can change only own information` (if you are user)
- `You have problems with the field of time admin. It's empty` (if you are admin, you should have the field "time_admin" in database. Write to developers with the problem)
- `Admin has problems with the field of time admin. It's empty` (if you try to update of admin's data, he don't have the field "time_admin". Write to developers with the problem)
- `You can't change information of senior admin`
  
#

`DELETE - /api/users/:login` - delete user

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 204
```
`Errors:`
- `User is not authorized`
- `User with login '{login}' not found`
- `User has pending events`
- `You are not admin. You can change only own information` (if you are user)
- `You have problems with the field of time admin. It's empty` (if you are admin, you should have the field "time_admin" in database. Write to developers with the problem)
- `Admin has problems with the field of time admin. It's empty` (if you try to update of admin's data, he don't have the field "time_admin". Write to developers with the problem)
- `You can't change information of senior admin`

#

<a name="events"><h2>Events</h2></a>
- **create own event**
- **subscribe on event**
- **unsubscribe from event**
- **update event data by id**
- **update event photo by event id**
- **get event by id**
- **get event photo by event id**
- **get nearest events by ip**
- **get events by query params** *(city, country, sort etc.)*
- **get subscribers of event by event id and query params**
- **delete event by id**
- **delete event photo by event id**
#

`POST - /api/events` - create event

```JavaScript
request:
{
    "name": "Event name",
    "description": "Event description", // optional
    "country": "Ukraine",
    "city": "Kharkiv",
    "street": "Pushkinska",
    "house_number": "79/1",
    "people_limit": 30, // optional
    "category_id": "category id",
    "price": 100, // if it's free, set 0
    "time_start": time in ms,
    "time_end": time in ms
}
```
```JavaScript
response:
{
    "id": "event id",
    "name": "Event name",
    "description": "Event description",
    "author": {
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname"
    },
    "location": {
        "lat": 50.00619,
        "lng": 36.24973,
        "country": "Ukraine",
        "city": "Kharkiv",
        "street": "Pushkinska",
        "house_number": "79/1"
    },
    "category": {
        "id": "category id",
        "name": "lection"
    },
    "people_limit": 30,
    "price": 0,
    "likes": 0,
    "active": true,
    "time_start": time in ms,
    "time_end": time in ms
}
```
`Errors:`
- `User is not authorized`
- `Invalid value: name (min length: 5, max length: 30)`
- `Invalid value: description (max length: 255)`
- `Invalid value: country (min length: 1, max length: 30)`
- `Invalid value: city (min length: 1, max length: 30)`
- `Invalid value: street (min length: 1, max length: 60)`
- `Invalid value: house_number (min length: 1, max length: 30)`
- `Invalid value: people_limit (min value: 0)` (if you choose this field)
- `Invalid value: category_id (min length: 24, max length: 24)`
- `Invalid value: price (min: 0)`
- `Invalid value: time_start (min: 0)`
- `Invalid value: time_end (min: 0)`
- `User not found`
- `You cannot create an event in the past`
- `The event must last at least 30 minutes`
- `Category not found`
- `Coordinates at this address not found`

#

`POST - /api/events/:event_id/subscribe` - subscribe to event and pay money for it

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 200
```
`Errors:`
- `User is not authorized`
- `Event with id {event_id} not found`
- `You can't subscribe to your event`
- `You already subscribed for this event`
- `Event with id {event_id} not active` (author can close the event or the event can become inactive if the people_limit is exceeded)
- `You don't have money`

#

`POST - /api/events/:event_id/unsubscribe` - unsubscribe from event and return money for it

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 200
```
`Errors:`
- `User is not authorized`
- `Event with id {event_id} not found`
- `You didn't subscribe for this event`
  
#

`PUT - /api/events/:event_id` - update data of event

Warning: you can't change `price`

```JavaScript
request:
{
    // choose fields you want to update
    "name": "Event name",
    "description": "Event description",
    "country": "Ukraine",
    "city": "Kharkiv",
    "street": "Pushkinska",
    "house_number": "79/1",
    "people_limit": 30, 
    "category_id": "category id",
    "time_start": time in ms,
    "time_end": time in ms
}
```
```JavaScript
response: status 202
```
`Errors:`
- `User is not authorized`
- `Event with id {event_id} not found`
- `You are not admin. You can change only own events`
- `You have problems with the field of time admin. It's empty` (if you are admin, you should have the field "time_admin" in database. Write to developers with the problem)
- `Admin has problems with the field of time admin. It's empty` (if you try to update of admin's data, he don't have the field "time_admin". Write to developers with the problem)
- `You can't change information of events of senior admin`
- `Invalid value: name (min length: 5, max length: 30)`
- `Invalid value: description (max length: 255)`
- `Invalid value: country (min length: 1, max length: 30)`
- `Invalid value: city (min length: 1, max length: 30)`
- `Invalid value: street (min length: 1, max length: 60)`
- `Invalid value: house_number (min length: 1, max length: 30)`
- `Invalid value: people_limit (min value: 0)`
- `Invalid value: category_id (min length: 24, max length: 24)`
- `Invalid value: price (min: 0)`
- `Invalid value: time_start (min: 0)`
- `Invalid value: time_end (min: 0)`
- `Coordinates at this address not found` (if you change address)
- `People limit can be less of number of subscribers`
- `Category not found`
- `You cannot create an event in the past`
- `The event must last at least 30 minutes`

#

`PUT - /api/events/:event_id/photo`

```JavaScript
request: file from form-data
```
```JavaScript
response: status 202
```
`Errors:`
- `User is not authorized`
- `Event with id {event_id} not found`
- `You are not admin. You can change only own events`
- `You have problems with the field of time admin. It's empty` (if you are admin, you should have the field "time_admin" in database. Write to developers with the problem)
- `Admin has problems with the field of time admin. It's empty` (if you try to update of admin's data, he don't have the field "time_admin". Write to developers with the problem)
- `No files were uploaded`
- `File should be only .jpg, .png or .jpeg`

#

`GET - /api/events/:event_id` - get event data by id

```JavaScript
response:
{
    "id": "event id",
    "name": "Event name",
    "description": "Event description",
    "author": {
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname"
    },
    "location": {
        "lat": 50.00619,
        "lng": 36.24973,
        "country": "Ukraine",
        "city": "Kharkiv",
        "street": "Pushkinska",
        "house_number": "79/1"
    },
    "category": {
        "id": "category id",
        "name": "lection"
    },
    "people_limit": 30, // f.e.
    "price": 0, // f.e.
    "likes": 0, // f.e.
    "active": true / false,
    "time_start": time in ms,
    "time_end": time in ms
}
```
`Errors:`
- `Event not found`

#

`GET - /api/events/:event_id/photo` - get event photo of event
```JavaScript
response: photo
```
`Errors:`
- `Photo for event not found`

#

`GET - /api/events/ip/:ip` - get nearest events by ip

**If you don't have events near you, you get empty array - `[]`.**

`Query params`:
- `limit` (default `10`);
- `sort`: `earliest`, `latest`, `popular` (default `earliest`);
- `page` (default `0`);
- `type`: `active`, `inactive` (default `active`). 

```JavaScript
response: 
[
    {
        "id": "event id",
        "name": "Event name",
        "author": {
            "login": "login",
            "firstname": "Firstname",
            "lastname": "Lastname"
        },
        "location": {
            "lat": 50.00619,
            "lng": 36.24973,
            "country": "Ukraine",
            "city": "Kharkiv",
            "street": "Pushkinska",
            "house_number": "79/1"
        },
        "category": {
            "id": "category id",
            "name": "lection"
        },
        "price": 0,
        "likes": 0,
        "active": true,
        "time_start": time in ms,
        "time_end": time in ms
    },
    ...
]
```

`Errors:`
- `Ip address not correct`
- `Limit should be more than 0` 
- `Page should be more than 0`
- `Sort should be 'earliest', 'latest' or 'popular'`
- `Type should be 'active' or 'inactive'`
  
#

`GET - /api/events` - get all events

If user don't have events, you get empty array - `[]`.

`Query params`:
- `country` (optional)
- `city` (optional)
- `limit` (default `10`);
- `sort`: `earliest`, `latest`, `popular` (default `earliest`);
- `page` (default `0`);
- `type`: `active`, `inactive` (default `active`). 

```JavaScript
response: 
[
    {
        "id": "event id",
        "name": "Event name",
        "author": {
            "login": "login",
            "firstname": "Firstname",
            "lastname": "Lastname"
        },
        "location": {
            "lat": 50.00619,
            "lng": 36.24973,
            "country": "Ukraine",
            "city": "Kharkiv",
            "street": "Pushkinska",
            "house_number": "79/1"
        },
        "category": {
            "id": "category id",
            "name": "lection"
        },
        "price": 0,
        "likes": 0,
        "active": true,
        "time_start": time in ms,
        "time_end": time in ms
    },
    ...
]
```

`Errors:`
- `Limit should be more than 0` 
- `Page should be more than 0`
- `Sort should be 'earliest', 'latest' or 'popular'`
- `Type should be 'active' or 'inactive'`

#

`GET - /api/events/:event_id/subscribers` - get subscribers of event id

If event don't have subscribers, you get empty array - `[]`.

`Query params`:
- `limit` (default `30`);
- `page` (default `0`);

```JavaScript
response: 
[
    {
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname",
        "official": false / true
    },
    ...
]
```

`Errors:`
- `Limit should be more than 0` 
- `Page should be more than 0`
- `Event with id {id} not found`

#

`DELETE - /api/events/:event_id` - delete event by id

Author return money for every user. 

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 204
```
`Errors:`
- `User is not authorized`
- `Event with id {event_id} not found`
- `You are not admin. You can change only own events`
- `You have problems with the field of time admin. It's empty` (if you are admin, you should have the field "time_admin" in database. Write to developers with the problem)
- `Admin has problems with the field of time admin. It's empty` (if you try to update of admin's data, he don't have the field "time_admin". Write to developers with the problem)

#

`DELETE - /api/events/:event_id/photo` - delete photo of event

```JavaScript
response: status 204
```
`Errors:`
- `User is not authorized`
- `Event with id {event_id} not found`
- `You are not admin. You can change only own events`
- `You have problems with the field of time admin. It's empty` (if you are admin, you should have the field "time_admin" in database. Write to developers with the problem)
- `Admin has problems with the field of time admin. It's empty` (if you try to update of admin's data, he don't have the field "time_admin". Write to developers with the problem)
- `Photo for event not found`
  
#

<a name="categories"><h2>Categories</h2></a>
- **create category**
- **update category data**
- **get category by id**
- **get all categories**
- **delete category**
#
`POST - /api/categories` - create category

```JavaScript
request: 
{
    "name": "meeting" // f.e.
}
```
```JavaScript
response: 
{
    "id": "category id",
    "name": "meeting" // f.e.
}
```

`Errors:`
- `User is not authorized`
- `User not found (maybe your token is not valid)`
- `You are not admin`
- `Invalid value: name (min length: 1, max length: 16)`
- `Category with name '{name}' already exists`

#

`PUT - /api/categories/:categories_id` - update category data

```JavaScript
request: 
{
    "name": "new category name"
}
```
```JavaScript
response: status 202
```

`Errors:`
- `User is not authorized`
- `User not found (maybe your token is not valid)`
- `You are not admin`
- `Invalid value: name (min length: 1, max length: 16)`
- `Category with id {id} not found`
- `Category with name '{name}' already exists`

#

`GET - /api/categories/:categories_id` - get category

```JavaScript
response: 
{
    "id": "category id",
    "name": "meeting" // f.e.
}
```

`Errors:`
- `Category with id {id} not found`

#

`GET - /api/categories` - get all categories
```JavaScript
response: 
[
    {
        "id": "category id",
        "name": "meeting" // f.e.
    },
    ...
]
```

#

`DELETE - /api/categories/:categories_id` - delete category

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 204
```

`Errors:` 
- `User is not authorized`
- `User not found (maybe your token is not valid)`
- `You are not admin`
- `Invalid value: name (min length: 1, max length: 16)`
- `Category with id {id} not found`

#

<a name="wallets"><h2>Wallets</h2></a>
- **add money to wallet**
- **withdraw money from wallet**
- **get amount of money of own wallet**
#
**The wallet is created automatically when user create profile. You can't delete own wallet: only add and withdraw money.**

#

`POST - /api/wallet/top-up` - add money to your wallet

```JavaScript
request: 
{
    "number_card": "1111222233334444", // f.e.
    "cvv": "123", // f.e.
    "expires_end": "12/24", // f.e.
    "amount": 100 // f.e.
}
```
```JavaScript
response: status 202
```

`Errors:` 
- `User is not authorized`
- `Invalid value: number_card (only 16 numbers)`
- `Invalid value: cvv (only 3 numbers)`
- `Invalid value: expires_end (length: 5, form: '00/00')`
- `Invalid value: amount (min: 10)`

#

`POST - /api/wallet/withdraw` - withdraw money from your wallet

```JavaScript
request: 
{
    "number_card": "1111222233334444", // f.e.
    "amount": 100 // f.e.
}
```
```JavaScript
response: status 202
```

`Errors:` 
- `User is not authorized`
- `Invalid value: number_card (only 16 numbers)`
- `Invalid value: amount (min: 10)`
- `You can't withdraw money while you have pending events` (for security: if user take money from users for event, he can withdraw money and delete event, and users can't return money. So, author of event should await then event will)
- `You don't have this amount of money`

#

`GET - /api/wallet` - get amount of money of your wallet

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: 
{
    "amount": 100 // f.e.
}
```
`Errors:` 
- `User is not authorized`

#
<a name="likes"><h2>Likes</h2></a>
- **create like under event**
- **get like under event**
- **delete like under event**
#

`POST - /api/likes/:event_id` - create like for event

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 201
```
`Errors:` 
- `User is not authorized`
- `You already liked this event`
- `Event with id '{event_id}' not found`

#

`GET - /api/likes/:event_id` - get your like by event id 

**To tell the true, this endpoint is used for `checking` if user `liked` an event or `no`.**

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: 
{
    "id": "like id",
    "author_id": "user id",
    "event_id": "event id"
}
```
`Errors:` 
- `User is not authorized`
- `You didn't like this event`

#

`DELETE - /api/likes/:event_id` - delete like for event

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 204
```
`Errors:` 
- `User is not authorized`
- `Like not found`

#
<a name="comments"><h2>Comments</h2></a>
- **create comment under event**
- **update comment by id**
- **get all comments by event id**
- **delete comment by id**
#

`POST - /api/comments/:event_id` - create comment under event

```JavaScript
request:
{
    "content": "Not bad" // f.e.
}
```
```JavaScript
response:
{
    "id": "comment id",
    "author": {
        "login": "login",
        "firstname": "Firstname",
        "lastname": "Lastname"
    },
    "event_id": "event id", 
    "content": "Not bad", // f.e.
    "publish_date": time in ms
}
```

`Errors:`
- `User is not authorized`
- `Invalid value: content (length: min: 1, max: 255)`
- `Event with id '{event_id}' not found`

#

`PUT - /api/comments/:comment_id` - update comment by id

```JavaScript
request:
{
    "content": "New content" // f.e.
}
```
```JavaScript
response: status 202
```
`Errors:`
- `User is not authorized`
- `You are not admin. You can update only own comments`
- `You have problems with the field of time admin. It's empty`
- `Admin has problems with the field of time admin. It's empty`
- `You can't change information of comments of senior admin`
- `Invalid value: content (length: min: 1, max: 255)`
- `Comment with id '{id}' not found`

#

`GET - /api/comments/:event_id` - get comments by event id

**If event don't have comments, you get empty array - `[]`.**

`Query params`:
- `limit` (default `10`);
- `sort`: `old`, `new` (default `new`);
- `page` (default `0`);


```JavaScript
response: 
[
    {
        "id": "comment id",
        "author": {
            "login": "login",
            "firstname": "Firstname",
            "lastname": "Lastname"
        },
        "event_id": "event id",
        "content": "Not bad", // f.e.
        "publish_date": time in ms
    },
    ...
]
```
`Errors:`
- `Limit should be more than 0` 
- `Page should be more than 0`
- `Sort should be 'old' or 'new'`
- `Event with id '{event_id}' not found`

#

`DELETE - /api/comments/:comment_id` - delete comment by id

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response: status 204
```

`Errors:`
- `User is not authorized`
- `You are not admin. You can update only own comments`
- `You have problems with the field of time admin. It's empty`
- `Admin has problems with the field of time admin. It's empty`
- `You can't change information of comments of senior admin`
- `Comment with id '{id}' not found`

#

<a name="notifications"><h2>Notifications</h2></a>

**`You can notificate user in comments, event name or event description. To do it write text with '@' and login of user. For example:`**

***`Comment: "I was with @login and it's fantastic!"`***

***`Event name: "Paty with @login and @login near shop @loginshop"`***

***`Description: "Me and @login decided to organized..."`***

#

**`Warning.` User don't get notification if you `update` your comment / event name / event description**

#

- **Get notifications**

#

`GET - /api/notifications` - get own notifications

`Query params`:
- `limit` (default `20`);
- `page` (default `0`);

```JavaScript
request: 'Bearer access_token' in Authorization
```
```JavaScript
response:
[
    {
        "id": "notification id",
        "content": "User @mbabichiev notificated you in comments under event \"Event name\"", // f.e.
        "link": "http://localhost:3000/events/event_id",
        "date": time in ms
    },
    ...
]
```

#

`Errors:`
- `User is not authorized`
- `Limit should be more than 0` 
- `Page should be more than 0`