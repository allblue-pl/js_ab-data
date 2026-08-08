import ts0 from "@allblue/ts0"

class IndexInfo {
    #columnInfos                       ;

    get columnInfos()                        {
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

    addColumnInfo(seq        , columnName        , desc         )       {
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

    hasColumn(columnName        )          {
        for (let columnInfo of this.#columnInfos) {
            if (columnInfo.name === columnName)
                return true;
        }

        return false;
    }
}
export default IndexInfo;

                                    
                
                 
                  
   