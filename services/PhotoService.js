const fs = require("fs");
const ErrorHandler = require('../exeptions/ErrorHandler');

class PhotoService {

    #allowedFormats = ['jpg', 'png', 'jpeg'];
    #DB_DIR = 'database';
    #AVATARS_DIR = `${this.#DB_DIR}/avatars`;
    #EVENTS_DIR = `${this.#DB_DIR}/events`;
    #DEFAULT_AVATAR = `${this.#AVATARS_DIR}/default.png`;


    // return full path to file
    #getFullPath(dir, name) {
        for(var i = 0; i < this.#allowedFormats.length; i++) {
            var path = `${dir}/${name}.${this.#allowedFormats[i]}`
            if(fs.existsSync(path)) {
                return path;
            }
        }
        return null;
    }


    #checkForValidatedFileFormat(fileFormat) {
        for(var i = 0; i < this.#allowedFormats.length; i++) {
            if(this.#allowedFormats[i] === fileFormat) {
                return true;
            }
        }
        return false;
    }


    #saveFile(dir, name, file) {
        if(!file) {
            throw ErrorHandler.BadRequest("No file content");
        }

        let fileFormat = file.name.split('.').pop();
        if(!this.#checkForValidatedFileFormat(fileFormat)) {
            throw ErrorHandler.BadRequest("File should be only .jpg, .png or .jpeg");
        }

        let path = this.#getFullPath(dir, name);
        if(path) {
            this.#deleteFile(path);
        }

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        file.mv(`${dir}/${name}.${fileFormat}`, function(err) {
            if (err) {
                console.log(err);
                throw ErrorHandler.ServerError("Error with saving photo");
            }
        });
    }


    // get file with full path
    #getFile(path) {
        console.log("Get file with path: " + path);
        if(!path) {
            return null;
        }

        try {
            const data = fs.readFileSync(path);
            return data;
        }
        catch(err) {
            console.log(err);
            throw ErrorHandler.BadRequest("File not found");
        }
    }


    // delete file with full path
    #deleteFile(path) {
        console.log("Delete file with path: " + path);
        if(!path) {
            return;
        }

        fs.unlink(path, err => {
            if(err) {
                console.log(err);
                throw ErrorHandler.BadRequest("File not found");
            } 
        });
    }


    getAvatarByLogin(login) {
        if(!login) {
            return null;
        }
        let path = this.#getFullPath(this.#AVATARS_DIR, login);

        if(!path) {
            path = this.#DEFAULT_AVATAR;
        }
        
        return this.#getFile(path);
    }


    getEventPhotoById(id) {
        if(!id) {
            return null;
        }

        let path = this.#getFullPath(this.#EVENTS_DIR, id);
        if(!path) {
            throw ErrorHandler.BadRequest("Photo for event not found")
        }

        return this.#getFile(path);
    }


    uploadAvatarByLogin(login, file) {
        if(!login || !file) {
            return;
        }
        this.#saveFile(this.#AVATARS_DIR, login, file);
    }


    uploadEventPhotoById(id, file) {
        if(!id || !file) {
            return;
        }

        this.#saveFile(this.#EVENTS_DIR, id, file);
    }


    deleteAvatarByLogin(login) {
        if(!login) {
            return;
        }
        
        const path = this.#getFullPath(this.#AVATARS_DIR, login);
        if(path) {
            this.#deleteFile(path);
        }
    }


    deleteEventPhotoById(id) {
        if(!id) {
            return;
        }

        const path = this.#getFullPath(this.#EVENTS_DIR, id);
        if(!path) {
            throw ErrorHandler.BadRequest("Photo for event not found");
        }
        this.#deleteFile(path);
    }

}

module.exports = new PhotoService();