const
    js0 = require('js0')
;

class DatabaseVersion {
    get type() {
        return this._type;
    }

    get version() {
        return this._version;
    }

    constructor(type, version) {
        js0.args(arguments, js0.Enum([ 'scheme', 'mysql', 'sqlite' ]),
                js0.PresetArray([ 'int', 'int', 'int' ]));
        this._type = type,
        this._version = version;
    }
}
module.exports = DatabaseVersion;