
class helper_Class {
    constructor() {

    }

    escapeString(str        )         {
        return str.replace(/\'/g, '\'\'');
    }

    unescapeString(str        )         {
        return str;
    }

    quote(str        )         {
        return str
            .replace(/\\/g, "\\\\")
            .replace(/\'/g, "\\\'")
            .replace(/\"/g, "\\\"")
            .replace(/\n/g, "\\\n")
            .replace(/\r/g, "\\\r")
            .replace(/\x00/g, "\\\x00")
            .replace(/\x1a/g, "\\\x1a");
    }
}
const helper = new helper_Class();
export default helper;