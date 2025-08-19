const
    js0 = require('js0')
;

class IndexInfo {
    get columnInfos() {
        let columnInfos_Sorted = this._columnInfos.toSorted((a, b) => {
            b.position - a.position;
        });

        let columnInfos = [];
        for (let i = 0; i < columnInfos_Sorted.length; i++) {
            columnInfos.push({
                position: i,
                name: columnInfos_Sorted[i].name,
                desc: columnInfos_Sorted[i].desc,
            });
        }

        return columnInfos;
    }


    constructor() {
        js0.args(arguments);

        this._columnInfos = [];
    }

    addColumnInfo(seq, columnName, desc) {
        js0.args(arguments, 'int', 'string', 'boolean');

        for (let columnInfo of this._columnInfos) {
            if (seq === columnInfo.seq) {
                throw new Error(`Position '${seq}' already exists in` +
                        ` index '${this.name}'.`);
            }

            if (columnName === columnInfo.name) {
                throw new Error(`Index column '${columnName}' already exists in` +
                        ` index '${this.name}'.`);
            }
        }

        this._columnInfos.push({
            seq: seq,
            name: columnName,
            desc: desc,
        });
    }

    hasColumn(columnName) {
        js0.args(arguments, 'string');

        for (let columnInfo of this._columnInfos) {
            if (columnInfo.columnName === columnName)
                return true;
        }

        return false;
    }
}
module.exports = IndexInfo;