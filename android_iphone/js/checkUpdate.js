
function checkWidgetUpdate(){
	var updateurl = '';
	var savePath = '';
	var appid = getstorage('appid');
	if(!appid) appid = 'appcanapp';
	var filepath2 = '/sdcard/'+appid+'.apk';

	uexDownloaderMgr.onStatus = function(opId,fileSize, percent, status){
		if(status == 0){
			var str = '下载进度：'+percent+'%';
			if(fileSize==-1) str = '下载中，请稍候...';
			uexWindow.toast('1','5', str,'');
		}else if (status == 1){
			uexWindow.closeToast();
			uexDownloaderMgr.closeDownloader('14');
			uexWidget.installApp(filepath2);
		}
		else{
			uexWindow.closeToast();
			uexWindow.toast('0','5','下载失败','2000');
			uexDownloaderMgr.closeDownloader('14');
		}
	}
	uexDownloaderMgr.cbCreateDownloader = function(opId,dataType,data){
		if(data == 0){
			logs('updateurl='+updateurl);
			uexDownloaderMgr.download('14', updateurl, filepath2, '0');
		}
		else{
			uexWindow.toast('0','5','下载失败','2000');
		}
	}
	uexWindow.cbConfirm = function ConfirmSuccess(opId, dataType, data){
		if (data == 1) {
			if(platform==0){
				uexWidget.loadApp("", "", updateurl);
			}
			else if(platform==1) {
				uexDownloaderMgr.createDownloader("14");	
			}
		}
	}
	uexWidget.cbCheckUpdate = function (opCode, dataType, jsonData){
		//alert(jsonData);



		var obj = eval('('+jsonData+')');
		var tips = '';
		if(obj.result == 0){
			updateurl = obj.url;
			savePath = obj.name;
			var mycars=['稍后', '更新'];
			uexWindow.confirm('', '当前有新版本，是否更新?', mycars);		
		}else if(obj.result == 1){
			tips = "Current version is the newest";
		}else if(obj.result == 2){
			tips = "Unknow error";
		}else if(obj.result == 3){
			tips = "Params error";
		}
		logs('cbCheckUpdate()-->tips='+tips);
	}
	uexFileMgr.cbIsFileExistByPath = function(opCode,dataType,data){
		if(data == 1){
			uexWidget.checkUpdate();
		}
	}
	uexWidgetOne.cbGetPlatform = function(opId,dataType,data){
		platform = data;
		if(data==0){ //iphone
			uexWidget.checkUpdate();
		}else if(data==1){ //android
			uexFileMgr.isFileExistByPath('/sdcard/');
		}
		setstorage('platform', data);
	}
	uexWidgetOne.getPlatform();
}