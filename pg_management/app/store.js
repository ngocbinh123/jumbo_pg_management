import Vue from 'vue';
import Vuex from 'vuex';
import QueryBuilder from './storaged/QueryBuilder';
import Customers from './data/objects/Customer';
Vue.use(Vuex);

const Sqlite = require("nativescript-sqlite");
const DB_NAME = "pg-man.db";

const TABLE_CUSTOMER = "Customer";
const COLS_CUSTOMER = "id, name, sex, phone, address";
const COLS_CUSTOMER_WITHOUT_ID = "name, sex, phone, address";
const COLS_CUSTOMER_FOR_CREATE_TB = "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, sex TEXT, phone TEXT, address TEXT";

const TABLE_PRODUCT = "Product";
const COLS_PRODUCT = "id, name, model, type, number, price";
const COLS_PRODUCT_WITHOUT_ID = "name, model, type, number, price";
const COLS_PRODUCT_FOR_CREATE_TB = "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, model TEXT, type TEXT, number INTEGER, price INTEGER";

const TABLE_PROVINCE = "Prodvince";
const COLS_PROVINCE = "id, name";
const COLS_PROVINCE_FOR_CREATE_TB = "id TEXT, name TEXT";

const store = new Vuex.Store({
    state: {
        database: null,
        customers: [],
        provinces: []
    },
    mutations: {
        init(state, data) {
            state.database = data.database;
        },
        load(state, data) {
            state.customers = [];
            for (var i = 0; i < data.customers.length; i++) {
                state.customers.push({
                    id: data.customers[i][0],
                    name: data.customers[i][1],
                    sex: data.customers[i][2],
                    phone: data.customers[i][3],
                    address: data.customers[i][4]
                });
            }
        },
        loadProvinces(state, data) {
            state.provinces = [];
            for (var i = 0; i < data.provinces.length; i++) {
                state.customers.push({
                    id: data.provinces[i][0],
                    name: data.provinces[i][1]
                });
            }
        },
        save(state, data) {
            state.customers.unshift(data.customer);
        },
        saveProvince(state, data) {
            state.provinces.push(data.province);
        }
    },
    actions: {
        init(context) {
            (new Sqlite(DB_NAME)).then(db => {
                var createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_CUSTOMER, COLS_CUSTOMER_FOR_CREATE_TB);
                db.execSQL(createTableSQL)
                    .then((result) => {
                        console.log("CREATE TABLE CUSTOMER SUCCESS", result);
                        createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_PROVINCE, COLS_PROVINCE_FOR_CREATE_TB);
                        db.execSQL(createTableSQL)
                            .then((result) => {
                                console.log("CREATE TABLE PROVINCE SUCCESS", result);
                                createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_PRODUCT, COLS_PRODUCT_FOR_CREATE_TB);
                                db.execSQL(createTableSQL)
                                    .then((result) => {
                                        console.log("CREATE TABLE PRODUCT SUCCESS", result);
                                        context.commit("init", { database: db });
                                    }).catch((err) => {
                                        console.log("CREATE TABLE PRODUCT ERROR", err);
                                    });
                            }).catch((err) => {
                                console.log("CREATE TABLE PROVINCE ERROR", err);
                            });
                    }).catch((err) => {
                        console.log("CREATE TABLE CUSTOMER ERROR", err);
                    });

                // createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_PROVINCE, COLS_PROVINCE_FOR_CREATE_TB);
                // db.execSQL(createTableSQL)
                //     .then((result) => {
                //         console.log("CREATE TABLE PROVINCE SUCCESS", result);
                //     }).catch((err) => {
                //         console.log("CREATE TABLE PROVINCE ERROR", err);
                //     });

                // createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_PRODUCT, COLS_PRODUCT_FOR_CREATE_TB);
                // db.execSQL(createTableSQL)
                //     .then((result) => {
                //         console.log("CREATE TABLE PRODUCT SUCCESS", result);
                //     }).catch((err) => {
                //         console.log("CREATE TABLE PRODUCT ERROR", err);
                //     });
                // this.createTables(context, db, 0);
            }, error => {
                console.log("OPEN DB ERROR", error);
            });
        },
        createTables(context, db, step) {
            switch (step) {
                case 0:
                    this.createTableCustomer(context, db, step);
                    break;
                case 1:
                    this.createTableProduct(context, db, step);
                    break;
                case 2:
                    this.createTableProvince(context, db, step);
                    break;
                default:
                    context.commit("init", { database: db });
                    break;
            }
        },
        createTableCustomer(context, db, step) {
            const query = QueryBuilder.buildQueryCreateTB(TABLE_CUSTOMER, COLS_CUSTOMER_FOR_CREATE_TB);
            db.execSQL(query).then(result => {
                console.log("CREATE TABLE CUSTOMER RESULT", result);
                this.createTables(context, db, step + 1);
            }, error => {
                console.log("CREATE TABLE CUSTOMER ERROR", error);
            });
        },
        createTableProduct(context, db, step) {
            const query = QueryBuilder.buildQueryCreateTB(TABLE_PRODUCT, COLS_PRODUCT_FOR_CREATE_TB);
            db.execSQL(query).then(result => {
                console.log("CREATE TABLE PRODUCT RESULT", result);
                this.createTables(context, db, step + 1);
            }, error => {
                console.log("CREATE TABLE PRODUCT ERROR", error);
            });
        },
        createTableProvince(context, db) {
            const query = QueryBuilder.buildQueryCreateTB(TABLE_PROVINCE, COLS_PROVINCE_FOR_CREATE_TB);
            db.execSQL(query).then(result => {
                console.log("CREATE TABLE PROVINCE RESULT", result);
                this.createTables(context, db, step + 1);
            }, error => {
                console.log("CREATE TABLE PROVINCE ERROR", error);
            });
        },
        getAllProvinces(context) {
            const query = QueryBuilder.buildQuerySelectAll(TABLE_PROVINCE, COLS_PROVINCE);
            context.state.database.all(query, []).then(result => {
                context.commit("loadProvinces", { provinces: result });
            }, error => {
                console.log("SELECT PROVINCES ERROR", error);
            });
        },
        insertProvinces(context, data) {
            const query = QueryBuilder.buildQueryDeleteAll(TABLE_PROVINCE);
            context.state.database.execSQL(query, []).then(result => {

                this.state.provinces = [];
                var records = data.records;
                records.forEach(proviceRecord => {

                    const insertQuery = QueryBuilder.buildQueryInsert(TABLE_PROVINCE, COLS_PROVINCE, "?,?");
                    context.state.database.execSQL(insertQuery, [proviceRecord.abiz_locationid, proviceRecord.abiz_name]).then(id => {
                        context.commit("saveProvince", {
                            province: {
                                id: proviceRecord.abiz_locationid,
                                name: proviceRecord.abiz_name
                            }
                        });
                    }, error => {
                        console.log("INSERT PROVINCE RECORD ERROR", error);
                    });
                });

            }, error => {
                console.log("DELETE ALL RECORDS IN PROVINCE ERROR", error);
            });
        },
        insertProvince(context, data) {
            const query = QueryBuilder.buildQueryInsert(TABLE_PROVINCE, COLS_PROVINCE, "?,?");
            context.state.database.execSQL(query, [data.abiz_locationid, data.abiz_name]).then(id => {
                context.commit("saveProvince", { province: data });
            }, error => {
                console.log("INSERT PROVINCE RECORD ERROR", error);
            });
        },

        insertAllCustomers(context, customers) {
            // prepare : is a function that need to charges
            // const query = QueryBuilder.buildQueryInsert(TABLE_CUSTOMER, COLS_CUSTOMER_WITHOUT_ID, "?,?,?,?");
            // var prep = context.state.database.prepare(query);
            // for (var i = 0; i < customers.length; i++) {
            //     const customerItem = customers[i];
            //     prep.execute([customerItem.name, customerItem.sex, customerItem.phone, customerItem.address]);
            // }
            // prep.finished();

            const query = QueryBuilder.buildQueryDeleteAll(TABLE_CUSTOMER);
            context.state.database.execSQL(query, []).then(result => {
                this.state.customers = [];
                customers.forEach(customereRecord => {
                    this.insertCustomer(context, customereRecord);
                });

            }, error => {
                console.log("DELETE ALL RECORDS IN CUSTOMER ERROR", error);
            });
        },
        insertCustomer(context, data) {
            const query = QueryBuilder.buildQueryInsert(TABLE_CUSTOMER, COLS_CUSTOMER_WITHOUT_ID, "?,?,?,?");
            context.state.database.execSQL(query, [data.name, data.sex, data.phone, data.address]).then(id => {
                data.id = id;
                context.commit("save", { customer: data });
            }, error => {
                console.log("INSERT ERROR", error);
            });
        },
        getAllCustomers(context) {
            const query = QueryBuilder.buildQuerySelectAll(TABLE_CUSTOMER, COLS_CUSTOMER);
            context.state.database.all(query, []).then(result => {
                context.commit("load", { customers: result });
            }, error => {
                console.log("SELECT ERROR", error);
            });
        },
        updateCustomer(context, data) {

        },
        deleteCustomer(context, data) {

        },
        findCustomer(context, data) {

        },
        insertProduct(context, data) {
            const query = QueryBuilder.buildQueryInsert(TABLE_CUSTOMER, COLS_CUSTOMER_WITHOUT_ID, "?,?,?,?");
            context.state.database.execSQL(query, [data.name, data.sex, data.phone, data.address]).then(id => {
                data.id = id;
                context.commit("save", { customer: data });
            }, error => {
                console.log("INSERT ERROR", error);
            });
        },
        getAllProducts(context) {
            const query = QueryBuilder.buildQuerySelectAll(TABLE_CUSTOMER, COLS_CUSTOMER);
            context.state.database.all(query, []).then(result => {
                context.commit("load", { customers: result });
            }, error => {
                console.log("SELECT ERROR", error);
            });
        },
        updateProduct(context, data) {

        },
        deleteProduct(context, data) {

        },
        findProduct(context, data) {

        }
    }
})

Vue.prototype.$store = store;
export default store;
store.dispatch("init");