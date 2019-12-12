import Constant from "../Constant";
export default {
    methods: {
        formatFromRemote(remoteCustomer) {

            const genderValue = remoteCustomer.gendercode.value;
            var localGender = ""
            if (genderValue == Constant.GENDER.Male.value) {
                localGender = Constant.GENDER.Male.text;
            } else if (genderValue == Constant.GENDER.Female.value) {
                localGender = Constant.GENDER.Female.text;
            }

            return {
                contactid: remoteCustomer.contactid,
                code: remoteCustomer.abiz_contactcode,
                fullName: remoteCustomer.fullname,
                mobilePhone: remoteCustomer.mobilephone,
                gender: localGender,
                address: remoteCustomer.abiz_provinceid.text
            };
        }
    }
}

// {
//     "contactid": "7FA640B9-6519-EA11-A811-000D3A07B96E",
//     "abiz_contactcode": "KH-00272",
//     "abiz_provinceid": {
//         "text": "Hồ Chí Minh",
//         "value": "B3F66BE0-E90C-EA11-A811-000D3AA392C2"
//     },
//     "fullname": "Hà Quốc Tuấn",
//     "gendercode": {
//         "text": "Male",
//         "value": "1"
//     },
//     "mobilephone": "0968411577"
// }