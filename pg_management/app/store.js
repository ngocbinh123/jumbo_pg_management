import Vue from 'vue';
import Vuex from 'vuex';
import QueryBuilder from './storaged/QueryBuilder';
import Helper from './helper/PopularHelper';
Vue.use(Vuex);

const Sqlite = require("nativescript-sqlite");
const DB_NAME = "pg-man.db";

const TABLE_CUSTOMER = "Customer";
const COLS_CUSTOMER = "id, name, sex, phone, address, contactId";
const COLS_CUSTOMER_WITHOUT_ID = "name, sex, phone, address, createdAt, contactId";
const COLS_CUSTOMER_FOR_CREATE_TB = "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, sex TEXT, phone TEXT, address TEXT, createdAt TEXT, contactId TEXT";

const TABLE_PRODUCT = "Product";
const COLS_PRODUCT = "id, name, price, currencyUnit";
const COLS_PRODUCT_FOR_CREATE_TB = "id TEXT PRIMARY KEY, name TEXT, price INTEGER, currencyUnit TEXT";

const TABLE_PROVINCE = "Prodvince";
const COLS_PROVINCE = "id, name";
const COLS_PROVINCE_FOR_CREATE_TB = "id TEXT, name TEXT";

const TABLE_INVOICE = "Invoice";
const COLS_INVOICE = "id, code, total, store, customerName, cursomterId, createdAt";
const COLS_INVOICE_WITHOUT_ID = "code, total, store, customerName, cursomterId, createdAt";
const COLS_INVOICE_FOR_CREATE_TB = "id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, total TEXT, store TEXT, customerName TEXT, cursomterId TEXT, createdAt TEXT";

const TABLE_INVOICE_DETAIL = "InvoiceDetail";
const COLS_INVOICE_DETAIL = "productId, productName, number, price, total, invoiceCode";
const COLS_INVOICE_DETAIL_FOR_CREATE_TB = "productId TEXT, productName TEXT, number INTEGER, price INTEGER, total INTEGER, invoiceCode TEXT";

const store = new Vuex.Store({
    state: {
        tables: [TABLE_CUSTOMER, TABLE_PRODUCT, TABLE_PROVINCE, TABLE_INVOICE, TABLE_INVOICE_DETAIL],
        database: null,
        customers: [],
        notifications: [],
        provinces: [],
    },
    mutations: {
        init(state, data) {
            state.database = data.database;
        },
        loadProvinces(state, data) {
            state.provinces = [];
            for (var i = 0; i < data.provinces.length; i++) {
                state.provinces.push({
                    id: data.provinces[i][0],
                    name: data.provinces[i][1]
                });
            }
        },
        saveProvince(state, data) {
            state.provinces.push(data.province);
        },
        pushCustomers(state, data) {
            state.customers = data.customers;
        },
        pushNotifications(state, data) {
            state.notifications = data.notifications;
        }
    },
    actions: {
        init(context) {
            (new Sqlite(DB_NAME)).then(db => {
                var createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_CUSTOMER, COLS_CUSTOMER_FOR_CREATE_TB);
                db.execSQL(createTableSQL)
                    .then((result) => {
                        createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_PROVINCE, COLS_PROVINCE_FOR_CREATE_TB);
                        db.execSQL(createTableSQL)
                            .then((result) => {
                                createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_PRODUCT, COLS_PRODUCT_FOR_CREATE_TB);
                                db.execSQL(createTableSQL)
                                    .then((result) => {
                                        createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_INVOICE, COLS_INVOICE_FOR_CREATE_TB);
                                        db.execSQL(createTableSQL)
                                            .then((result) => {
                                                createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_INVOICE_DETAIL, COLS_INVOICE_DETAIL_FOR_CREATE_TB);
                                                db.execSQL(createTableSQL)
                                                    .then((result) => {
                                                        context.commit("init", { database: db });
                                                    }).catch((err) => {
                                                        console.log("CREATE TABLE INVOICE DETAIL ERROR", err);
                                                    });
                                            }).catch((err) => {
                                                console.log("CREATE TABLE INVOICE ERROR", err);
                                            });
                                    }).catch((err) => {
                                        console.log("CREATE TABLE PRODUCT ERROR", err);
                                    });
                            }).catch((err) => {
                                console.log("CREATE TABLE PROVINCE ERROR", err);
                            });
                    }).catch((err) => {
                        console.log("CREATE TABLE CUSTOMER ERROR", err);
                    });
            }, error => {
                console.log("OPEN DB ERROR", error);
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
        insertInvoice(context, data) {
            const query = QueryBuilder.buildQueryInsert(TABLE_INVOICE_DETAIL, COLS_INVOICE_DETAIL, "?,?,?,?,?,?");
            data.products.forEach(product => {
                context.state.database.execSQL(query, [product.id, product.name, product.number, product.price, product.total, data.code])
                    .then(id => {})
                    .catch(error => {
                        console.log("INSERT INVOICE DETAIL ERROR", error);
                    });
            });
        },
        pushCustomers(context, data) {
            context.commit("pushCustomers", { customers: data });
        },
        pushNotifications(context, data) {
            var localNotifications = [];
            data.forEach(element => {
                var dateTime = element.abiz_datetime.replace("T", " ");
                dateTime = dateTime.replace(":00Z", "");

                const dateArr = dateTime.split(" ");
                const timeStr = dateArr[1].trim();
                var dateStr = Helper.convertRequestDateToLocalDate(dateArr[0].trim());
                const noti = {
                    id: element.abiz_notificationid,
                    body: element.abiz_body,
                    name: element.abiz_name,
                    datetime: timeStr + " " + dateStr,
                    date: dateStr,
                    time: timeStr,
                };
                localNotifications.push(noti);
            });
            context.commit("pushNotifications", { notifications: localNotifications });
        }
    }
})

Vue.prototype.$store = store;
export default store;
store.dispatch("init");