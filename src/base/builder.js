const knex = require("knex");
const { setEngine, setCockpit } = require("./engine");
const WorkflowBbuilder = require('./builder');
const knexConfig = require('../knexfile');

class Workflow {
    constructor(options) {
        const { persist_mode, db } = options;

        this.persist_mode = persist_mode;
        this.dbConfig = db;
        this.builder = new WorkflowBbuilder();
    }

    prepareDB() {
        const dbConfig = knexConfig[process.env.NODE_ENV || "base"];
        if (this.dbConfig) {
            dbConfig.connection = this.dbConfig;
        }

        this.db = knex(dbConfig);

        const migrate = global.process.argv.includes('--migrate') || global.process.argv.includes('-m');
        if (migrate) {
            try {
                console.log('start run migrations...');
                await this.db.migrate.latest();
                console.log('migrations finished');
            } catch (err) {
                throw {
                    name: 'migration',
                    message: err
                }
            }
        }
    }

    use(fn) {
        if (typeof fn === 'function') {
            this.builder.addMiddleware(fn);
        }
        else if (!!fn.allowedMethods && !!fn.routes) {
            this.builder.addRoutes(fn);
        }
        else {
        }

        return this;
    }

    setup() {
        console.log('setup cockpit');
        if (!this.cockpit) {
            this.cockpit = new Cockpit(this.persist_mode, this.db);
        }

        setEngine(this.engine);
        setCockpit(this.cockpit);

        console.log('workflow setup finished!');
    }

    async start() {

        try {
            this.setup();
            this.prepareDB();
            this.app = (await this.builder.build());

            return this.app.listen(this.port, () => {
                console.log(`flow-build workflow api is running on port: ${this.port}`);
            });
        } catch (err) {
            console.log(`something happened [${err.name}]`)
            console.error(err.message);
            console.log('finished workflow');
        }
        return this;
    }
}

module.exports = Workflow;
