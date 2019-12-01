<template>
    <GridLayout rows="50,20,*,20,60" columns="50,*,50" class="page-parent">
        <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="3" width="100%">
        <Label text="CHỤP HÌNH CHẤM CÔNG" class="text-center" />
        </FlexboxLayout>
        <!-- <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" /> -->
        <Label :text="'fa-check' | fonticon" class="fas btn-done"  @tap="onClickSendButton()" row="0" col="2" v-show="!!cameraImage"/>
        <Image :src="cameraImage" id="image" loadMode="sync" stretch="aspectFit" margin="10" row="2" col="0" colSpan="3" />

        <!-- <StackLayout row="2" col="0" colSpan="3" margin="12" class="lout-rule">
            <Label textWrap="true" text="CHÚ Ý" class="text-rule-header" />       
            <Label textWrap="true" text="Bạn cần phải chụp hình gửi về hệ thống. Hình bạn chụp cần phải đáp ứng những tiêu chí như sau:"/>
            <Label textWrap="true" text="- Hình lấy toàn thân, rõ mặt."/>
            <Label textWrap="true" text="- Tóc tai gọn gàng."/>
            <Label textWrap="true" text="- Trang phục tươm tất, đúng quy định."/>
            <Label textWrap="true" text="- Hình nền là cửa hàng bạn đang làm việc."/>

        </StackLayout> -->
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
    
    const bgHttp = require("nativescript-background-http");
    const fs = require("file-system");
    const platform = require("platform");
    export default {
        data() {
            return {
                saveToGallery: false,
                allowsEditing: false,
                keepAspectRatio: true,
                width: 320,
                height: 240,
                cameraImage: null,
                labelText: "",
                processing: false,
            }
        },
        methods: {
            onClickSendButton() {
                if(this.processing || this.cameraImage == null) {
                    return;
                }
                this.getImageFilePath(this.cameraImage)
                    .then(path => {
                        console.log(`path: ${path}`);
                        this.uploadImage(path);
                    });
            },
            uploadImage(path) {
                this.processing = true;

                let file = fs.File.fromPath(path);
                const fileName = file.path.substr(file.path.lastIndexOf("/") + 1);

                let request = {
                    url: "http://www.csm-testcenter.org/test",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "File-Name": fileName
                    },
                    description: "uploading image " + file.path,
                    androidAutoDeleteAfterUpload: false,
                    androidNotificationTitle: "NativeScript HTTP background"
                };

                const session = bgHttp.session("image-upload");
                let task = session.uploadFile(file.path, request);
                // task.on("progress", this.onEvent.bind(this));
                task.on("error", this.onEvent.bind(this));
                task.on("responded", this.onEvent.bind(this));
                task.on("complete", this.onEvent.bind(this));

            },
            onEvent(e) {
                console.log("UPLOADING IMAGE", e.eventName + " " + e.object.description);
                console.log("UPLOADING IMAGE",  e.error ? e.error.toString() : e.error);
                switch(e.eventName) {
                    case "complete": 
                        this.showDlg(StringConst.lbl_success, StringConst.msg_system_received_your_img)
                        .then(this.$modal.close());
                        this.processing = false;
                        break;
                    case "error": 
                        this.showDlg(StringConst.lbl_fail, e.error ? e.error.toString() : e.error);
                        this.processing = false;
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
                takePicture({ width: this.width, height: this.height, 
                        keepAspectRatio: this.keepAspectRatio, saveToGallery: this.saveToGallery, 
                        allowsEditing: this.allowsEditing }).
                            then(this.callBackTakePictureSuccessful,
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