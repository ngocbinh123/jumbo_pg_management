<template>
    <GridLayout rows="50,20,*,auto,5,60" columns="50,*,50" class="page-parent">
        <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="3" width="100%">
        <Label text="CHẤM CÔNG" class="text-center" />
        </FlexboxLayout>
        <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

        <!-- <Label :text="'fa-check' | fonticon" class="fas btn-done"  @tap="onClickSendButton()" row="0" col="2"/> -->
       
        <StackLayout row="2" col="0" colSpan="3" class="img-border">
            <Image :src="!cameraImage ? 'res://bg_trans' : cameraImage" id="image" loadMode="sync" stretch="aspectFit" height="100%" />
        </StackLayout>

       <Label :text="'fa-camera' | fonticon" class="fas btn-camera"  @tap="startingTakePictureNow()" row="2" col="1" colSpan="2" :isEnabled="!processing"/>   

        <GridLayout class="lout-location-info" rows="40,40,auto,20" columns="50, *" row="3" col="0" colSpan="3">
            <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-20" row="0" col="0" />
            <Label class="lbl-value" :text="userName" row="0" col="1"/>

            <Label :text="'fa-clock' | fonticon" class="far font-icon font-icon-size-20" row="1" col="0" />
            <Label :text="checkInTime" class="lbl-value text-bold" row="1" col="1"/>

            <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-20" row="2" col="0" />
            <Label :text="$props.location.address" class="lbl-value-address" textWrap="true" row="2" col="1" rowSpan="2" />    
        </GridLayout>

        <Button class="btn-take-pic" text="CHẤM CÔNG" @tap="onClickSendButton()" row="5" col="0" colSpan="3" :isEnabled="!processing" />
        <ActivityIndicator v-show="processing" busy="true" row="0" col="0" colSpan="3" rowSpan="5" />
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
    import Constant from "../../data/Constant";
    import Helper from "../../helper/PopularHelper";
    export default {
        created() {
            this.startingTakePictureNow();
        },
        props: ["location"],
        data() {
            return {
                cameraImage: null,
                userName: CurrentUser.methods.getUserName(),
                checkInTime: Helper.getCurrentTimeStr(),
                imageId: "",
                processing: false,
            }
        },
        methods: {          
            closePage() {
                this.$modal.close();
            },
            onClickSendButton() {
                if(this.processing || this.cameraImage == null) {
                    return;
                }
                if (!this.imageId) {
                    this.getImageFilePath(this.cameraImage)
                    .then(path => {
                        this.uploadImage(path);
                    });       
                }else {
                    this.submitData();
                }
            },
            uploadImageSuccess() {
                this.processing = false;
                this.$modal.close({
                    isSuccess: true
                });
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
                    androidNotificationTitle: "Tải Hình Chấm Công", 
                    androidAutoClearNotification: true
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
                // task.on("responded", this.onEvent.bind(this));
                task.on("complete", this.onEvent.bind(this));

            },
            onEvent(e) {
                switch(e.eventName) {
                    case "complete": 
                        const responseStr = e.response.getBodyAsString();
                        if (responseStr.includes("abiz_imageid")) {
                            this.imageId = JSON.parse(responseStr).abiz_imageid;
                        }

                        this.processing = false;
                        this.submitData();
                        break;
                    case "error": 
                        this.processing = false;
                        this.submitData();
                        break;
                    case "progress":
                        console.log("UPLOADING_IMAGE", JSON.stringify(e));
                        break;
                }
            },
            startingTakePictureNow() {
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
             submitData() {
                this.processing = true;
                const checkInDate = Helper.getCurrentDateStrForRequest();
                this.checkInTime = Helper.getCurrentTimeStr();
                const data = {
                    date: checkInDate,
                    time: this.checkInTime,
                    latitude: this.$props.location.latitude,
                    longitude: this.$props.location.longitude,
                    imageId: this.imageId, 
                    address: this.$props.location.address
                };

                ApiService.methods.checkInOut(data, CurrentUser.methods.getBearId())
                .then(this.submitDataSuccess)
                .catch(this.submitDataFail);
            },
            submitDataSuccess(json) {
                this.processing = false;
                this.$modal.close({
                    isSuccess: true
                });
            }, 
            submitDataFail(error) {
                this.processing = false;
                this.showDlg(StringConst.lbl_error, error.message);
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
        font-family: "f_arima_madurai_extra_bold", "Arima Madurai";
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
            font-family: "f_arima_madurai_bold", "Arima Madurai";
            text-align: center;
            font-size: 24;
            margin-bottom: 24;
            color:$color-accent;
        }
    }

    .img-border, .lout-location-info {
        border-color: $color-border;
        border-radius: 10%;
        border-width: 0.5;
        margin: 10 20;
        padding: 10; 
    }

     .lout-location-info {
        margin: 10 20 10 20;
    }


    .lbl-value {
        vertical-align: middle;
        font-size: 16;
        text-align: left;
    }

    .lbl-value-address {
        vertical-align: top;
        font-size: 16;
        text-align: left;
    }

    .btn-camera {
        color: $color-primary;
        vertical-align: top;
        text-align: right;
        font-size: 28;
        margin: 20 35;
    }

</style>