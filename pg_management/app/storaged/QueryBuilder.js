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
const QUERY_INSERT_DATA_INTO_CUSTOMER = "INSERT INTO " + TABLE_CUSTOMER + " (" + COLS_CUSTOMER_WITHOUT_ID + ") VALUES (?,?,?,?)"
const QUERY_SELECT_ALL_CUSTOMERS = "SELECT " + COLS_CUSTOMER + " FROM " + TABLE_CUSTOMER;


module.exports = {
    buildQueryCreateTB(tableName, columns) {
        return "CREATE TABLE IF NOT EXISTS " + tableName + " (" + columns + ");";
    },
    buildQuerySelectAll(tableName, columns) {
        return "SELECT " + columns + " FROM " + tableName;
    },
    buildQuerySelect(tableName, columns, condition) {
        return "SELECT " + columns + " FROM " + tableName + " WHERE " + condition;
    },
    buildQueryInsert(tableName, columns, values) {
        return "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + values + ");";
    },
    buildQueryUpdate(tableName, setValues, condition) {
        return "UPDATE " + tableName + " SET " + setValues + " WHERE " + condition;
    },
    buildQueryDeleteAll(tableName) {
        return "DELETE FROM " + tableName;
    },
    buildQueryDelete(tableName, condition) {
        return "DELETE FROM " + tableName + " WHERE " + condition;
    }
};