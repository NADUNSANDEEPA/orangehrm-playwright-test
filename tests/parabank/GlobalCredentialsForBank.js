class GlobalCredentialsForBank {
    static username;
    static password;

    static setUsername(user) {
        this.username = user;
    }

    static setPassword(pass) {
        this.password = pass;
    }

    static getUsername() {
        return this.username;
    }

    static getPassword() {
        return this.password;
    }
}

module.exports = { GlobalCredentialsForBank };
