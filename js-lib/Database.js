'use strict';

const
    js0 = require('js0')
;

class Database 
{
    
    static EscapeString(str)
    {
        return str.replace(/[\0\n\r\b\t\\'"\x1a]/g, (c) => {
            switch (c) {
                case "\0":
                    return "\\0";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\b":
                    return "\\b";
                case "\t":
                    return "\\t";
                case "\x1a":
                    return "\\Z";
                case "'":
                    return "''";
                case '"':
                    return '""';
                default:
                    return "\\" + s;
            }
        });
    }

    static Quote(str)
    {
        return str
            .replace(/\\/g, "\\\\")
            .replace(/\'/g, "\\\'")
            .replace(/\"/g, "\\\"")
            .replace(/\n/g, "\\\n")
            .replace(/\r/g, "\\\r")
            .replace(/\x00/g, "\\\x00")
            .replace(/\x1a/g, "\\\x1a");
    }


    get tables() {
        return this._tables;
    }


    constructor(tables)
    {
        js0.args(arguments, js0.Iterable(require('./Table')));

        this._tables = tables;
    }

    getNextId()
    {
        return Math.round(Math.random() * 1000000);
    }

    getTable(tableName)
    {
        for (let table of this.tables) {
            if (table.name === tableName)
                return table;
        }

        throw new Error(`Table '${tableName}' does not exist.`);
    }

}
module.exports = Database;