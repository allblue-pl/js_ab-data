import ts0 from "@allblue/ts0"

class DatabaseVersion {
    #type              ;
    #version                       ;

    get type()               {
        return this.#type;
    }

    get version()                        {
        return this.#version;
    }

    constructor(type              , version                       ) {
        this.#type = type,
        this.#version = [...version];
    }
}
export default DatabaseVersion;

                                                     
                                                               