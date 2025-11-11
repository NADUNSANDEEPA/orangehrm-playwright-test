class GlobalCredentialsForBank {
    static username = "USER0926322";
    static password = "PASSWORD123!";

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
