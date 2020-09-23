'use strict';

const path = require('path');

const abTasks = require('ab-tasks');
const abFSWatcher = require('ab-fs-watcher');

const Data = require('./Data');


class abData_Class
{

    get Builder() {
        return require('./Builder');
    }

    Data(objects)
    {
        return new Data(objects);
    }


    get fields() {
        return require('./fields');
    }

    constructor()
    {
        this._buildTask = null;
    }

    build(builderType, properties)
    {
        let builderPath = 'ab-data-' + builderType;
        let inputPath = path.join(path.dirname(require.main.filename),
                properties.input);

        /* Builder */
        try {
            require.resolve(builderPath);
        } catch(err) {
            throw new Error(`Builder package '${builderType}' does not exist.`)
        }

        if (require.resolve(builderPath) in require.cache)
            delete require.cache[require.resolve(builderPath)];

        let builder = new (require(require.resolve(builderPath)))(properties);

        /* Data */
        try {
            require.resolve(inputPath);
        } catch(err) {
            throw new Error(`Input path '${inputPath}' does not exist.`)
        }

        if (require.resolve(inputPath) in require.cache)
            delete require.cache[require.resolve(inputPath)];

        let data = require(require.resolve(inputPath))();
        data.initialize();

        /* Build */
        builder.build(properties, data);
    }

    clear()
    {

    }

    exec(properties)
    {
        this._task = new abTasks.Task('build', () => {
            this.build();
        });
    }

    parse(filePath)
    {
        if (require.resolve(this._filePath) in require.cache)
            delete require.cache[require.resolve(this._filePath)];

        this.clear();
    }

    watch(builderType, properties)
    {
        builderType = builderType;
        inputPath = properties.input;

        abFSWatcher.watch([ `${inputPath}/**/*.js` ], [ 'add', 'unlink',
                'change' ], () => {
            abTasks.call(this._buildTask, builderType, properties);
        });
    }

}
module.exports = new abData_Class();
