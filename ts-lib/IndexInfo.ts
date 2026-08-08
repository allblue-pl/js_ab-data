import ts0 from "@allblue/ts0"

class IndexInfo {
    #columnInfos: IndexInfo_ColumnInfos;

    get columnInfos(): IndexInfo_ColumnInfos {
        let columnInfos_Sorted = this.#columnInfos.toSorted((a, b) => {
            return b.seq - a.seq;
        });

        let columnInfos = [];
        for (let i = 0; i < columnInfos_Sorted.length; i++) {
            columnInfos.push({
                seq: i,
                name: columnInfos_Sorted[i].name,
                desc: columnInfos_Sorted[i].desc,
            });
        }

        return columnInfos;
    }


    constructor() {
        this.#columnInfos = [];
    }

    addColumnInfo(seq: number, columnName: string, desc: boolean): void {
        for (let columnInfo of this.#columnInfos) {
            if (seq === columnInfo.seq) {
                throw new Error(`Position '${seq}' already exists in` +
                        ` index '${columnInfo.name}'.`);
            }

            if (columnName === columnInfo.name) {
                throw new Error(`Index column '${columnName}' already exists in` +
                        ` index '${columnInfo.name}'.`);
            }
        }

        this.#columnInfos.push({
            seq: seq,
            name: columnName,
            desc: desc,
        });
    }

    hasColumn(columnName: string): boolean {
        for (let columnInfo of this.#columnInfos) {
            if (columnInfo.name === columnName)
                return true;
        }

        return false;
    }
}
export default IndexInfo;

type IndexInfo_ColumnInfos = Array<{
    seq: number,
    name: string,
    desc: boolean,
}>;