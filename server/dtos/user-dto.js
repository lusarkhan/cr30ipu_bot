module.exports = class UserDto {
    email;
    id;
    confirmed;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.confirmed = model.confirmed;
    }
}