"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = require("../helpers/Storage");
exports.AUTH_KEY = 'auth_token';
const defaultData = {
    hasUser: false,
    token: '',
};
const AuthMixins = (skipMount = false) => ({
    data() {
        return defaultData;
    },
    methods: {
        restoreData() {
            const authProps = Storage_1.default.get(exports.AUTH_KEY, defaultData);
            Object.keys(authProps).forEach(key => {
                this[key] = authProps[key];
            });
        },
        clearUser() {
            Storage_1.default.remove(exports.AUTH_KEY);
            this.hasUser = false;
            this.token = '';
            this.$router.push({ name: 'splash' });
        },
        setUserExistsInDb(hasUser) {
            Storage_1.default.set(exports.AUTH_KEY, {
                hasUser: hasUser,
                token: this.token,
            });
        },
        setLogin(token) {
            Storage_1.default.set(exports.AUTH_KEY, {
                hasUser: true,
                token,
            });
            this.$router.push({ name: 'main' });
        },
        redirect() {
            const currentPath = this.$router.currentRoute.name || '';
            if (this.token) {
                if (currentPath != 'main')
                    this.$router.push({ name: 'main' });
            }
            else {
                if (currentPath != 'auth')
                    this.$router.push({ name: 'auth' });
            }
        },
    },
    computed: {
        isRegister() {
            return !this.hasUser;
        },
    },
    beforeMount() {
        this.restoreData();
        if (skipMount)
            return;
        this.redirect();
    },
});
exports.default = AuthMixins;
//# sourceMappingURL=AuthMixins.js.map