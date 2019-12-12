import Remember from "../share/Remember";
import Constant from "../data/Constant";

export default {
    getUserInfo() {
        return {
            id: Remember.getUserId(),
            code: Remember.getUserCode(),
            gId: Remember.getUserGID(),
            idCard: Remember.getUserIDCard(),
            name: Remember.getUserName(),
            gender: Remember.getUserGender(),
            birthday: Remember.getUserBirthday(),
            phone: Remember.getUserPhone(),
            address: Remember.getUserAddess(),
            email: Remember.getUserEmail(),
            client: Remember.getUserClientCode(),
            category: Remember.getUserCategory(),
            channel: Remember.getUserChanel(),
            manager: {
                name: Remember.getUserManagerName(),
                email: Remember.getUserManagerEmail(),
                phone: Remember.getUserManagerPhone()
            },

        };
    },
    methods: {
        updatePhone(newPhone) {
            Remember.setUserPhone(newPhone);
        },
        updateAddress(newAddress) {
            Remember.setUserAddress(newAddress);
        },
        updateBirthday(newBirthday) {
            Remember.setUserBirthday(newBirthday);
        },
        getBearId() {
            return Remember.getBearId();
        },
        getUserId() {
            return Remember.getUserId();
        },
        getUserName() {
            return Remember.getUserName();
        },
        logout() {
            Remember.clearAll();
        }, 
        saveUserInfo(json) {
            Remember.setUserName(json.abiz_name);
            Remember.setUserCode(json.abiz_usercode);
            Remember.setUserAddress(json.abiz_addresscalculated);
            
            Remember.setUserIDCard(json.abiz_identitycard);
            Remember.setUserPhone(json.abiz_mobilephone);
            Remember.setUserGID(json.abiz_usergid);

            Remember.setUserCateogry(json.abiz_categorycode.text);
            Remember.setUserChanel(json.abiz_channelcode.text);
            Remember.setUserClientCode(json.abiz_clientcode.text);

            Remember.setUserManagerName(json.manager_abiz_name);
            Remember.setUserManagerEmail(json.manager_emailaddress);
            Remember.setUserManagerPhone(json.manager_abiz_mobilephone);


            var userGenderValue = json.abiz_gendercode.value;
            
            if (userGenderValue == Constant.GENDER.Male.value) {
                Remember.setUserGender(Constant.GENDER.Male.text);
            }else if (userGenderValue == Constant.GENDER.Female.value) {
                Remember.setUserGender(Constant.GENDER.Female.text);
            }
            
            // birthday field in response have comple format.
            var birthday = json.abiz_birthday;
            if (birthday.includes("T")) {
                birthday = birthday.split("T")[0];
                const dateArr = birthday.split("-");
                if (dateArr.length == 3) {
                birthday = dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
                }
            }
            Remember.setUserBirthday(birthday);
        }
    }
};