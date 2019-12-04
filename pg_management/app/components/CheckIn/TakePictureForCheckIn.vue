<template>
    <GridLayout rows="50,20,*,20,60" columns="50,*,50" class="page-parent">
        <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="3" width="100%">
        <Label text="CHỤP HÌNH CHẤM CÔNG" class="text-center" />
        </FlexboxLayout>
        <Label :text="'fa-check' | fonticon" class="fas btn-done"  @tap="onClickSendButton()" row="0" col="2" />
        <Image :src="cameraImage" id="image" loadMode="sync" stretch="aspectFit" margin="10" row="2" col="0" colSpan="3" />

        <Button class="btn-take-pic" text="CHỤP HÌNH" @tap="onTakePictureTap" row="4" col="0" colSpan="3" :isEnabled="!processing" v-show="!processing"/>
        <ActivityIndicator v-show="processing" busy="true" row="4" col="0" colSpan="3" />
    </GridLayout>
</template>

<script>
    import { EventData, Observable, fromObject } from "tns-core-modules/data/observable";
    import { Page } from "tns-core-modules/ui/page";
    import { View } from 'tns-core-modules/ui/core/view';
    import { takePicture, requestPermissions } from "nativescript-camera";
    import StringConst from '../../assets/StringConst';
    import ApiService from '../../service/BackEndService';
    import CurrentUser from '../../data/CurrentUser';
    import Config from '../../service/Config';
    const imageSourceModule = require("tns-core-modules/image-source");
    const bgHttp = require("nativescript-background-http");
    const fs = require("file-system");
    const platform = require("platform");
    import { error } from '@nativescript/core/trace/trace';
    import * as firebase from"nativescript-plugin-firebase";
    import Constant from "../../data/Constant";

    export default {
        created() {
            this.trackingPage();
        },
        data() {
            return {
                cameraImage: null,
                processing: false,
            }
        },
        methods: {
            trackingPage() {
                firebase.analytics.logEvent({
                key: Constant.KEY_PAGE_VIEW,
                parameters: [
                    {
                        key: Constant.KEY_PAGE_ID, 
                        value: "CHECK_IN_TAKE_PICTURE"
                    }
                    ]
                });
            },
            onClickSendButton() {
                if(this.processing || this.cameraImage == null) {
                    return;
                }
                this.getImageFilePath(this.cameraImage)
                    .then(path => {
                        this.uploadImage(path);
                    });    
            },
            uploadImageSuccess() {
                this.processing = false;
                this.$modal.close({
                    isSuccess: true
                });
            },
            uploadImageSuccessFail(error) {
                this.showDlg(StringConst.lbl_fail, error.message);
                this.processing = false;
            },
            uploadImage(path) {
                this.processing = true;

                let file = fs.File.fromPath(path);
           
                const fileName = file.path.substr(file.path.lastIndexOf("/") + 1);
                var bearer = "Bearer " + CurrentUser.methods.getBearId();

                let request = {
                    url: Config.uploadImageUrl,
                    method: "POST",
                    headers: {
                        "Authorization": bearer,
                        "Content-Type": "application/octet-stream"
                    },
                    description: "Đang tải hình...",
                    androidAutoDeleteAfterUpload: true,
                    androidNotificationTitle: "Tải Hình Chấm Công"
                };

                request.description = "uploading image " + file.path;
                request.headers["File-Name"] = fileName;

                const session = bgHttp.session("image-upload");

                var params = [
                            {
                                name: fileName,
                                filename: file.path,
                                mimeType: "image/jpeg"
                            }
                        ];

                var task = session.multipartUpload(params, request);

                // task.on("progress", this.onEvent.bind(this));
                task.on("error", this.onEvent.bind(this));
                task.on("responded", this.onEvent.bind(this));
                task.on("complete", this.onEvent.bind(this));

            },
            onEvent(e) {
                switch(e.eventName) {
                    case "complete": 
                        this.processing = false;
                        this.$modal.close({
                            isSuccess: true
                        });
                        break;
                    case "error": 
                        this.processing = false;
                        var message = StringConst.please_try_again;
                    
                        switch(e.responseCode) {
                            case 400: 
                                message = "Đã có lỗi xảy ra trong quá trình tải hình lên hệ thống. Xin hãy thử lại một lần nữa."
                                break;
                            case 500: 
                                message = "Đã có sự cố xảy trên hệ thống. Xin hãy thử lại."
                                break;
                            case 401: 
                                message = "Đã xảy ra lỗi 401 (Unauthorized). \nBạn cần phải đăng xuất ứng dụng rồi đăng nhập lại."
                                break;
                            default: 
                                message = "Tải hình lên hệ thống thất bại với lỗi " + e.responseCode + ". Xin hãy thử lại."
                        }
                        this.uploadImageSuccessFail(Error(message))
                        break;
                    case "progress":
                        console.log("UPLOADING_IMAGE", JSON.stringify(e));
                        break;
                }
            },
            onTakePictureTap: function(args) {
                if(this.processing) {
                    return;
                }
                this.processing = true;
                requestPermissions().then(this.starTakePicture,this.callBackUserRejectPermission);
            },
            starTakePicture() {
                this.processing = true;
                takePicture({ width: 240, height: 320, 
                        keepAspectRatio: true, saveToGallery: false, 
                        allowsEditing: false })
                        .then(this.callBackTakePictureSuccessful,
                            this.callBackError);
            },
            callBackUserRejectPermission() {
                this.processing = false;
                this.showDlg(StringConst.lbl_notification,StringConst.msg_user_reject_camera_permission);
            },
            callBackTakePictureSuccessful(imageAsset) {
                this.cameraImage = imageAsset;
                this.processing = false;            
            },
            callBackError(err) {
                this.processing = false;
                console.log("Error -> " + err.message);
            },
            getImageFilePath(imageAsset) {
                return new Promise(resolve => {
                    if (platform.isIOS) {
                        const options = PHImageRequestOptions.new();
                        options.synchronous = true;
                        options.version =
                            PHImageRequestOptionsVersion.Current;
                        options.deliveryMode =
                            PHImageRequestOptionsDeliveryMode.HighQualityFormat;

                        PHImageManager.defaultManager().requestImageDataForAssetOptionsResultHandler(
                            imageAsset.ios,
                            options,
                            nsData => {
                                // create file from image asset and return its path
                                const tempFolderPath = fs.knownFolders
                                    .temp()
                                    .getFolder("nsimagepicker").path;
                                const tempFilePath = fs.path.join(
                                    tempFolderPath,
                                    Date.now() + ".jpg"
                                );

                                nsData.writeToFileAtomically(
                                    tempFilePath, true);
                                resolve(tempFilePath);
                            }
                        );
                    } else {
                        // return imageAsset.android, since it 's the path of the file
                        resolve(imageAsset.android);
                    }
                });
            },
            showDlg(dlgTitle, dlgMsg) {
                return alert({
                    title: dlgTitle,
                    okButtonText: StringConst.lbl_close,
                    message: dlgMsg
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    @import "../../app-variables.scss";
    .info {
        font-size: 20;
    }

    .btn-take-pic {
        font-family: "f_arima_madurai_extra_bold";
        font-size: 18;
        margin: 0;
        border-top-width: 1;
        border-bottom-width: 0;
        border-left-width: 0;
        border-right-width: 0;
        border-top-width: $color-primary;
        background-color: $color-primary;
        color: white;
    }

    .btn-take-pic:active {
        color: $color-primary-dark;
        background-color: white;
    }

    .lout-rule {
        Label {
            font-family: "f_arima_madurai_medium";
            text-align: justify;
            font-size: 18;
            margin-bottom: 12;
        }
        Label.text-rule-header {
            font-family: "f_arima_madurai_bold";
            text-align: center;
            font-size: 24;
            margin-bottom: 24;
            color:$color-accent;
        }
    }
</style>