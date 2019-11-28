import Vue from 'vue';
import Vuex from 'vuex';
import QueryBuilder from './storaged/QueryBuilder';
import Customers from './data/objects/Customer';
import Helper from './helper/PopularHelper';
Vue.use(Vuex);

const Sqlite = require("nativescript-sqlite");
const DB_NAME = "pg-man.db";

const TABLE_CUSTOMER = "Customer";
const COLS_CUSTOMER = "id, name, sex, phone, address, contactId";
const COLS_CUSTOMER_WITHOUT_ID = "name, sex, phone, address, createdAt, contactId";
const COLS_CUSTOMER_FOR_CREATE_TB = "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, sex TEXT, phone TEXT, address TEXT, createdAt TEXT, contactId TEXT";

const TABLE_PRODUCT = "Product";
const COLS_PRODUCT = "id, name, model, type, number, price";
const COLS_PRODUCT_WITHOUT_ID = "name, model, type, number, price";
const COLS_PRODUCT_FOR_CREATE_TB = "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, model TEXT, type TEXT, number INTEGER, price INTEGER";

const TABLE_PROVINCE = "Prodvince";
const COLS_PROVINCE = "id, name";
const COLS_PROVINCE_FOR_CREATE_TB = "id TEXT, name TEXT";

const TABLE_INVOICE = "Invoice";
const COLS_INVOICE = "id, code, total, store, customerName, cursomterId, createdAt";
const COLS_INVOICE_WITHOUT_ID = "code, total, store, customerName, cursomterId, createdAt";
const COLS_INVOICE_FOR_CREATE_TB = "id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, total TEXT, store TEXT, customerName TEXT, cursomterId INTEGER, createdAt TEXT";

const TABLE_INVOICE_DETAIL = "InvoiceDetail";
const COLS_INVOICE_DETAIL = "productId, productName, number, price, total, invoiceId";
const COLS_INVOICE_DETAIL_FOR_CREATE_TB = "productId INTEGER, productName TEXT, number INTEGER, price INTEGER, total INTEGER, invoiceId INTEGER";

const store = new Vuex.Store({
    state: {
        tables: [TABLE_CUSTOMER, TABLE_PRODUCT, TABLE_PROVINCE, TABLE_INVOICE, TABLE_INVOICE_DETAIL],
        database: null,
        customers: [],
        provinces: [],
        invoices: []
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
                    address: data.customers[i][4],
                    contactId: data.customers[i][5],

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
        loadInvoices(state, data) {
            console.log("loadInvoices", data.invoices);
            state.invoices = [];
            for (var i = 0; i < data.invoices.length; i++) {
                var dateArr = data.invoices[i][6].split(" ");
                var newItems = {
                    id: data.invoices[i][0],
                    code: data.invoices[i][1],
                    store: data.invoices[i][3],
                    transTotal: data.invoices[i][2],
                    displayTransTotal: Helper.formatCurrencystr(data.invoices[i][2]),
                    customer: {
                        id: data.invoices[i][5],
                        name: data.invoices[i][4],
                        phone: data.invoices[i][7],
                        address: data.invoices[i][8]
                    },
                    time: dateArr[0],
                    date: dateArr[1],
                    products: []
                };
                state.invoices.push(newItems);
            }
        },
        saveInvoice(state, data) {
            console.log("saveInvoice: ", data.invoice);
            state.invoices.unshift(data.invoice);
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
                                        createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_INVOICE, COLS_INVOICE_FOR_CREATE_TB);
                                        db.execSQL(createTableSQL)
                                            .then((result) => {
                                                console.log("CREATE TABLE INVOICE SUCCESS", result);
                                                createTableSQL = QueryBuilder.buildQueryCreateTB(TABLE_INVOICE_DETAIL, COLS_INVOICE_DETAIL_FOR_CREATE_TB);
                                                db.execSQL(createTableSQL)
                                                    .then((result) => {
                                                        console.log("CREATE TABLE INVOICE DETAIL SUCCESS", result);
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
            const query = QueryBuilder.buildQueryInsert(TABLE_CUSTOMER, COLS_CUSTOMER_WITHOUT_ID, "?,?,?,?,?,?");
            context.state.database.execSQL(query, [data.name, data.sex, data.phone, data.address, Helper.getCurrentDateStr(), data.contactId]).then(id => {
                data.id = id;
                context.commit("save", { customer: data });
            }, error => {
                console.log("INSERT ERROR", error);
            });
        },
        getAllCustomers(context) {
            const query = QueryBuilder.buildQuerySelect(TABLE_CUSTOMER, COLS_CUSTOMER, "createdAt = ?");
            context.state.database.all(query, [Helper.getCurrentDateStr()]).then(result => {
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

        },
        insertInvoice(context, data) {
            var query = QueryBuilder.buildQueryInsert(TABLE_CUSTOMER, COLS_CUSTOMER_WITHOUT_ID, "?,?,?,?,?");
            context.state.database.execSQL(query, [data.customer.name, data.customer.sex, data.customer.phone, data.customer.address, Helper.getCurrentDateStr()]).then(id => {
                data.customer.id = id;
                context.commit("save", { customer: data.customer });
                // code, total, store, customerName, cursomterId, createdAt
                query = QueryBuilder.buildQueryInsert(TABLE_INVOICE, COLS_INVOICE_WITHOUT_ID, "?,?,?,?,?,?");
                context.state.database.execSQL(query, [data.code, data.transTotal, data.store, data.customer.name, id, data.time + " " + data.date])
                    .then(id => {
                        console.log("INSERT INVOICE SUCCESS", id);
                        data.id = id;
                        context.commit("saveInvoice", { invoice: data });
                        // productId, productName, number, price, total, invoiceId
                        data.products.forEach(product => {
                            query = QueryBuilder.buildQueryInsert(TABLE_INVOICE_DETAIL, COLS_INVOICE_DETAIL, "?,?,?,?,?,?");
                            context.state.database.execSQL(query, [product.id, product.name, product.number, product.price, product.total, id])
                                .then(id => {
                                    console.log("INSERT INVOICE DETAIL SUCCESS", id);
                                })
                                .catch(error => {
                                    console.log("INSERT INVOICE DETAIL ERROR", error);
                                });
                        });

                    })
                    .catch(error => {
                        console.log("INSERT INVOICE ERROR", error);
                    })
            }, error => {
                console.log("INSERT ERROR", error);
            });
        },
        getInvoices(context) {
            const currentDate = Helper.getCurrentDateStr();
            var joinQuery = "SELECT a.id, a.code, a.total, a.store, a.customerName, a.cursomterId, a.createdAt, b.phone, b.address "
            joinQuery += "FROM " + TABLE_INVOICE + " as a , " + TABLE_CUSTOMER + " as b ";
            joinQuery += "WHERE a.cursomterId == b.id and a.createdAt like '%" + currentDate + "'";
            context.state.database.all(joinQuery, []).then(result => {
                console.log("SELECT INVOICES SUCCESS: ", result.length);
                context.commit("loadInvoices", { invoices: result });
            }, error => {
                console.log("SELECT INVOICES ERROR", error);
            });
        }
    }
})

Vue.prototype.$store = store;
export default store;
store.dispatch("init");