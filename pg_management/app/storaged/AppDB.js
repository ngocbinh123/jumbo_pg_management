import Vue from 'vue';
import Vuex from 'vuex';


const Sqlite = require("nativescript-sqlite");
const DB_NAME = "pg-man.db";

const TABLE_CUSTOMER = "Customer";
const COLS_CUSTOMER = "id, name, sex, phone, address";
const COLS_CUSTOMER_WITHOUT_ID = "name, sex, phone, address";

const QUERY_CREATE_TB_CUSTOMER = "CREATE TABLE IF NOT EXISTS " + TABLE_CUSTOMER +
    " (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "name TEXT, " +
    "sex TEXT, " +
    "phone TEXT, " +
    "address TEXT)";
const QUERY_INSERT_DATA_INTO_CUSTOMER = "INSERT INTO " + TABLE_CUSTOMER + " (" + COLS_CUSTOMER_WITHOUT_ID + ") VALUES (?,?,?,?)";
const QUERY_SELECT_ALL_CUSTOMERS = "SELECT " + COLS_CUSTOMER + "FROM" + TABLE_CUSTOMER;

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        database: null,
        data: []
    },
    mutations: {
        init(state, data) {
            state.database = data.database;
        },
        load(state, data) {
            state.data = [];
            for (var i = 0; i < data.data.length; i++) {
                state.data.push({
                    id: data.data[i][0],
                    name: data.data[i][1],
                    sex: data.data[i][2],
                    phone: data.data[i][3],
                    address: data.data[i][4]
                });
            }
        },
        save(state, data) {
            state.data.push({
                name: data.data[i][1],
                sex: data.data[i][2],
                phone: data.data[i][3],
                address: data.data[i][4]
            });
        },
    },
    actions: {
        init(context) {
            (new Sqlite(DB_NAME)).then(db => {
                db.execSQL(QUERY_CREATE_TB_CUSTOMER).then(id => {
                    context.commit("init", { database: db });
                }, error => {
                    console.log("CREATE TABLE ERROR", error);
                });
            }, error => {
                console.log("OPEN DB ERROR", error);
            });
        },
        insert(context, data) {
            context.state.database.execSQL(QUERY_INSERT_DATA_INTO_CUSTOMER, [data.name, data.sex, data.phone, data.address]).then(id => {
                context.commit("save", { data: data });
            }, error => {
                console.log("INSERT ERROR", error);
            });
        },
        query(context) {
            context.state.database.all(QUERY_SELECT_ALL_CUSTOMERS, []).then(result => {
                context.commit("load", { data: result });
            }, error => {
                console.log("SELECT ERROR", error);
            });
        }
    }
});