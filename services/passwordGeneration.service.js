"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const zxcvbn = require("zxcvbn");
const cipherString_1 = require("../models/domain/cipherString");
const generatedPasswordHistory_1 = require("../models/domain/generatedPasswordHistory");
const wordlist_1 = require("../misc/wordlist");
const DefaultOptions = {
    length: 14,
    ambiguous: false,
    number: true,
    minNumber: 1,
    uppercase: true,
    minUppercase: 0,
    lowercase: true,
    minLowercase: 0,
    special: false,
    minSpecial: 1,
    type: 'password',
    numWords: 3,
    wordSeparator: '-',
    capitalize: false,
    includeNumber: false,
};
const Keys = {
    options: 'passwordGenerationOptions',
    history: 'generatedPasswordHistory',
};
const MaxPasswordsInHistory = 100;
class PasswordGenerationService {
    constructor(cryptoService, storageService) {
        this.cryptoService = cryptoService;
        this.storageService = storageService;
    }
    generatePassword(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // overload defaults with given options
            const o = Object.assign({}, DefaultOptions, options);
            if (o.type === 'passphrase') {
                return this.generatePassphrase(options);
            }
            // sanitize
            if (o.uppercase && o.minUppercase <= 0) {
                o.minUppercase = 1;
            }
            if (o.lowercase && o.minLowercase <= 0) {
                o.minLowercase = 1;
            }
            if (o.number && o.minNumber <= 0) {
                o.minNumber = 1;
            }
            if (o.special && o.minSpecial <= 0) {
                o.minSpecial = 1;
            }
            if (!o.length || o.length < 1) {
                o.length = 10;
            }
            const minLength = o.minUppercase + o.minLowercase + o.minNumber + o.minSpecial;
            if (o.length < minLength) {
                o.length = minLength;
            }
            const positions = [];
            if (o.lowercase && o.minLowercase > 0) {
                for (let i = 0; i < o.minLowercase; i++) {
                    positions.push('l');
                }
            }
            if (o.uppercase && o.minUppercase > 0) {
                for (let i = 0; i < o.minUppercase; i++) {
                    positions.push('u');
                }
            }
            if (o.number && o.minNumber > 0) {
                for (let i = 0; i < o.minNumber; i++) {
                    positions.push('n');
                }
            }
            if (o.special && o.minSpecial > 0) {
                for (let i = 0; i < o.minSpecial; i++) {
                    positions.push('s');
                }
            }
            while (positions.length < o.length) {
                positions.push('a');
            }
            // shuffle
            yield this.shuffleArray(positions);
            // build out the char sets
            let allCharSet = '';
            let lowercaseCharSet = 'abcdefghijkmnopqrstuvwxyz';
            if (o.ambiguous) {
                lowercaseCharSet += 'l';
            }
            if (o.lowercase) {
                allCharSet += lowercaseCharSet;
            }
            let uppercaseCharSet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
            if (o.ambiguous) {
                uppercaseCharSet += 'IO';
            }
            if (o.uppercase) {
                allCharSet += uppercaseCharSet;
            }
            let numberCharSet = '23456789';
            if (o.ambiguous) {
                numberCharSet += '01';
            }
            if (o.number) {
                allCharSet += numberCharSet;
            }
            const specialCharSet = '!@#$%^&*';
            if (o.special) {
                allCharSet += specialCharSet;
            }
            let password = '';
            for (let i = 0; i < o.length; i++) {
                let positionChars;
                switch (positions[i]) {
                    case 'l':
                        positionChars = lowercaseCharSet;
                        break;
                    case 'u':
                        positionChars = uppercaseCharSet;
                        break;
                    case 'n':
                        positionChars = numberCharSet;
                        break;
                    case 's':
                        positionChars = specialCharSet;
                        break;
                    case 'a':
                        positionChars = allCharSet;
                        break;
                    default:
                        break;
                }
                const randomCharIndex = yield this.cryptoService.randomNumber(0, positionChars.length - 1);
                password += positionChars.charAt(randomCharIndex);
            }
            return password;
        });
    }
    generatePassphrase(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = Object.assign({}, DefaultOptions, options);
            if (o.numWords == null || o.numWords <= 2) {
                o.numWords = DefaultOptions.numWords;
            }
            if (o.wordSeparator == null || o.wordSeparator.length === 0 || o.wordSeparator.length > 1) {
                o.wordSeparator = ' ';
            }
            if (o.capitalize == null) {
                o.addCommonRequirements = false;
            }
            if (o.includeNumber == null) {
                o.includeNumber = false;
            }
            const listLength = wordlist_1.EEFLongWordList.length - 1;
            const wordList = new Array(o.numWords);
            for (let i = 0; i < o.numWords; i++) {
                const wordIndex = yield this.cryptoService.randomNumber(0, listLength);
                if (o.capitalize) {
                    wordList[i] = this.capitalize(wordlist_1.EEFLongWordList[wordIndex]);
                }
                else {
                    wordList[i] = wordlist_1.EEFLongWordList[wordIndex];
                }
            }
            if (o.includeNumber) {
                yield this.appendRandomNumberToRandomWord(wordList);
            }
            return wordList.join(o.wordSeparator);
        });
    }
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.optionsCache == null) {
                const options = yield this.storageService.get(Keys.options);
                if (options == null) {
                    this.optionsCache = DefaultOptions;
                }
                else {
                    this.optionsCache = Object.assign({}, DefaultOptions, options);
                }
            }
            return this.optionsCache;
        });
    }
    saveOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.save(Keys.options, options);
            this.optionsCache = options;
        });
    }
    getHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasKey = yield this.cryptoService.hasKey();
            if (!hasKey) {
                return new Array();
            }
            if (!this.history) {
                const encrypted = yield this.storageService.get(Keys.history);
                this.history = yield this.decryptHistory(encrypted);
            }
            return this.history || new Array();
        });
    }
    addHistory(password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cannot add new history if no key is available
            const hasKey = yield this.cryptoService.hasKey();
            if (!hasKey) {
                return;
            }
            const currentHistory = yield this.getHistory();
            // Prevent duplicates
            if (this.matchesPrevious(password, currentHistory)) {
                return;
            }
            currentHistory.unshift(new generatedPasswordHistory_1.GeneratedPasswordHistory(password, Date.now()));
            // Remove old items.
            if (currentHistory.length > MaxPasswordsInHistory) {
                currentHistory.pop();
            }
            const newHistory = yield this.encryptHistory(currentHistory);
            return yield this.storageService.save(Keys.history, newHistory);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.history = [];
            return yield this.storageService.remove(Keys.history);
        });
    }
    passwordStrength(password, userInputs = null) {
        if (password == null || password.length === 0) {
            return null;
        }
        let globalUserInputs = ['bitwarden', 'bit', 'warden'];
        if (userInputs != null && userInputs.length > 0) {
            globalUserInputs = globalUserInputs.concat(userInputs);
        }
        // Use a hash set to get rid of any duplicate user inputs
        const finalUserInputs = Array.from(new Set(globalUserInputs));
        const result = zxcvbn(password, finalUserInputs);
        return result;
    }
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    appendRandomNumberToRandomWord(wordList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (wordList == null || wordList.length < 0) {
                return;
            }
            const index = yield this.cryptoService.randomNumber(0, wordList.length - 1);
            const num = yield this.cryptoService.randomNumber(0, 9);
            wordList[index] = wordList[index] + num;
        });
    }
    encryptHistory(history) {
        return __awaiter(this, void 0, void 0, function* () {
            if (history == null || history.length === 0) {
                return Promise.resolve([]);
            }
            const promises = history.map((item) => __awaiter(this, void 0, void 0, function* () {
                const encrypted = yield this.cryptoService.encrypt(item.password);
                return new generatedPasswordHistory_1.GeneratedPasswordHistory(encrypted.encryptedString, item.date);
            }));
            return yield Promise.all(promises);
        });
    }
    decryptHistory(history) {
        return __awaiter(this, void 0, void 0, function* () {
            if (history == null || history.length === 0) {
                return Promise.resolve([]);
            }
            const promises = history.map((item) => __awaiter(this, void 0, void 0, function* () {
                const decrypted = yield this.cryptoService.decryptToUtf8(new cipherString_1.CipherString(item.password));
                return new generatedPasswordHistory_1.GeneratedPasswordHistory(decrypted, item.date);
            }));
            return yield Promise.all(promises);
        });
    }
    matchesPrevious(password, history) {
        if (history == null || history.length === 0) {
            return false;
        }
        return history[history.length - 1].password === password;
    }
    // ref: https://stackoverflow.com/a/12646864/1090359
    shuffleArray(array) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = array.length - 1; i > 0; i--) {
                const j = yield this.cryptoService.randomNumber(0, i);
                [array[i], array[j]] = [array[j], array[i]];
            }
        });
    }
}
exports.PasswordGenerationService = PasswordGenerationService;
//# sourceMappingURL=passwordGeneration.service.js.map