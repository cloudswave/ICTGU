var tokenkey = '';
var qqopenid = '';
var shareed=0;
var cb_url = 'http://www.3g2win.com/tiaozhuan/index.html';
var weibo = {};

function cbError(opid,errCode,errDes)
{
	if(opid=="30" || opid=="31")
	{
		uexXmlHttpMgr.close(opid);
		uexWindow.toast("0","5","分享失败",2000);
	}
	
}

/*转到编辑发送内容页面*/
function weibo_send(key, openid)
{
	var type = weibo.type;
	setstorage(tokenkey, key);
	if(openid) setstorage(qqopenid, openid);
	if(weibo.cb){
		weibo.cb(type);
		return;
	}
	var appname = getstorage('appname');
	var text='来自'+appname+'客户端   ' + weibo.subject + '　' + weibo.content;
	var cont = encodeURIComponent(text);
	var url = "weibosend.html?key="+key+"&cont="+cont+'&type='+type+'&openid='+openid+'&appkey='+weibo[type].appkey;
	logs('weibo_send-->url='+url);
	setstorage('params','{"key":"'+key+'", "cont":"'+text+'", "type":"'+type+'", "openid":"'+openid+'", "appkey":"'+weibo[type].appkey+'"}');
	openwin('weibosend', 'weibosend.html', '2');
 }

 function onOAuth(winNam,url)
 {
 	if(winNam == "webpage")
	{
		logs('onOAuth-->url='+url);
		if(weibo.type==1){ /*新浪*/
			if(url.indexOf(cb_url)==0)
			{
				var key=url.match(/(.*)#access_token=(.*)&expires_in=(.*)&uid=(.*)/);
				if(isDefine(key))
				{
					uescript("weibologin", "closewin('0');");
					var k = key[2];
					var kk = k.split('&');
					if(kk) k=kk[0];
					weibo_send(k);
					logs('sina weibo key1='+key[2]+', key2='+k);
				}else
				{
					uescript("weibologin", "closewin();");
	 			} 
	 		}
		}
		else if(weibo.type==0){ /*腾讯*/
			var key = url.match(/(.*)#access_token=(.*)&expires_in=(.*)&openid=(.*)&openkey=(.*)/);
			if(isDefine(key)){
				logs('qq weibo key='+key[2]);
				weibo[0].openid = key[4];
				weibo_send(key[2], key[4]);
				uescript("weibologin", "closewin('0');");
			}
		}
		else{ /*网易*/
			var key = url.match(/(.*)#access_token=(.*)&expires_in=(.*)&refresh_token=(.*)/);
			if(isDefine(key)){
				logs('163_weibo_key = '+key[2]);
				weibo_send(key[2]);
				uescript("weibologin", "closewin('0');");
			}
		}
	}
 }

/*从*详情页 启动分享*/
function sharestart(cont, uid, sub, wname){
	logs("sharestart(cont, uid, wname): uid="+uid+', wname='+wname);
	weibo.content  = cont;
	weibo.subject = sub;
	weibo.uid = uid;
	weibo.wname = wname;
	uexWidgetOne.cbError=cbError;
	
	setstorage('key_0_2', '');

	uexWindow.cbActionSheet = function (opId, dataType, data){
		logs('cbActionSheet-->data='+data);
		var d = parseInt(data);
		if(d<3) weibo_open(d);
	}
	
	var array = ['腾讯微博', '新浪微博', '网易微博'];
	uexWindow.actionSheet('', '取消', array);
}

function weibo_open(type, uid, cb, wname){
	var appkey = ''; 
	var cburl = '';
	var url = '';
	weibo.type = type;
	weibo.cb = cb;
	if(uid) weibo.uid = uid;
	if(wname) weibo.wname = wname;
	logs('weibo_open(type, uid, cb, wname)-->type='+type+', uid='+uid+', wname='+wname);
	if(!weibo[type]){
		if(type==0){
			weibo[type] = {appkey:'801088600', shareed:0};
			qqopenid = 'opid_'+weibo.uid;;
		}
		else if(type==1){
			weibo[type] = {appkey:'3845409824', shareed:0};
		}
		else if(type==2){
			weibo[type] = {appkey:'0PU25xVLBJ2ChzPF', shareed:0};
		}
	}
	
	if(weibo[type].shareed==1){
		uexWindow.toast("0","5","已分享到微博",2000);
		return;
	}
	
	var obj = getStorJson('usetting');
	var wbk = weibo[type].appkey;

	if(type==1){ /*新浪微博*/
		if(obj.weibo_sina && obj.weibo_sina_callback)
		{
		  	wbk = obj.weibo_sina ;
			cb_url = obj.weibo_sina_callback ;
		}
	}
	else if(type==0){ /*腾讯微博*/
		if(obj.weibo_tencent && obj.weibo_tencent_callback)
		{
		  	wbk = obj.weibo_tencent ;
			cb_url = obj.weibo_tencent_callback ;
		}
	}
	else{ /*网易微博*/	
		//appkey = weibo[type].appkey;
	}
	
	weibo[type].appkey = wbk;
	
	tokenkey = 'key_'+weibo.uid+'_'+type;
	var token = getstorage(tokenkey);
	logs("share.js-->getstorage-->tokenkey="+tokenkey+", token="+token);
	if(isDefine(token)){
		var qqopid = '';
		if(type==0) qqopid=getstorage(qqopenid);
		weibo_send(token, qqopid);
		return;
	}
	
	appkey = encodeURIComponent(wbk);
	cburl = encodeURIComponent(cb_url);	
	
	logs('wdopen-->weibologin.html');
	setstorage('params','{"key":"'+appkey+'", "url":"'+cburl+'", "type":"'+type+'", "wname":"'+weibo.wname+'"}');
	openwin('weibologin', 'weibologin.html', '2');
}

function delweibo(t, tk){
	if(t==1){
		var wb_if = 'https://api.weibo.com/2/account/end_session.json';
		uexXmlHttpMgr.open("50", "GET", wb_if+'?access_token='+tk, "60000");
		uexXmlHttpMgr.send("50");
	}
}


/*以下是编辑发送内容页面接口*/
/*发送内容*/
var weibop = getStorJson('params');
function weiboSubmit(txt, src)
{
	logs('weiboSubmit()-->txt='+txt);
	var key  = weibop.key;
	var type = weibop.type;
	var wb_if = '';
	var str = '';
	var picUrl = src;
	var text = txt;
	weibop.txt = txt;
	
	var len = fucCheckLength(text);
	logs('len='+len);
	if (len > 140) {
		uexWindow.toast('0', '5', "分享内容请小于140个字", 2000);
		return;
	}
	
	if(type==1){
		wb_if = "https://api.weibo.com/2/statuses/update.json?";
		if(isDefine(picUrl)) wb_if="https://api.weibo.com/2/statuses/upload.json?";
		str = "新浪";
	}
	else if(type==0){
		var ip = '127.0.0.1';
		var url = 't/add?';
		if(isDefine(picUrl)) url = 't/add_pic?';;
		var rurl = "https://open.t.qq.com/api/"+url;
		rurl +="&scope=all&format=json";
		rurl +="&clientip="+ip;
		rurl +="&oauth_version=2.a";
		rurl +="&openid="+weibop.openid;
		rurl +="&oauth_consumer_key="+weibop.appkey+'&';
		wb_if = rurl;
		str = "腾讯";
	}
	else{
		wb_if = "https://api.t.163.com/statuses/update.json?";
		if(isDefine(picUrl)) wb_if="https://api.t.163.com/statuses/upload.json?pic"+picUrl+'&';
		str = "网易";
	}
	uexWindow.toast("1","5",'正在分享至'+str+'微博','');
	uexXmlHttpMgr.onData = weiboCb;
	uexWidgetOne.cbError = cbError;
	logs('weibo_send-->url='+wb_if);
  	uexXmlHttpMgr.open("30","POST",wb_if,"60000");
  	uexXmlHttpMgr.setPostData("30","0","access_token",key);
  	if(isDefine(picUrl)) uexXmlHttpMgr.setPostData("30","1","pic",picUrl);
	if(weibop.upload_image_url){
		uexXmlHttpMgr.setPostData("30","1","upload_image_url",weibop.upload_image_url);
		logs('weibo_send-->setPostData-->upload_image_url='+weibop.upload_image_url);
		weibop.upload_image_url = '';
	}
  	if(type==0){ /*腾讯*/
  		uexXmlHttpMgr.setPostData("30","0","content",text);
  	}
  	else{
  	  	uexXmlHttpMgr.setPostData("30","0","status",text);
  	}
  	uexXmlHttpMgr.send("30");
}

function cbError(opid,errCode,errDes)
{
	if(opid=="30" || opid=="31")
	{
		uexXmlHttpMgr.close(opid);
		uexWindow.toast("0","5","分享失败",2000);
	}	
}
function weiboCb(opId,status,data){
	logs('weiboCb-->opId='+opId+', status='+status+', data111='+data);
	if(Int(opId)==30)
	{
		var type = weibop.type;
		if(Int(status)==1)
		{
			uexXmlHttpMgr.close(opId);
			if(type==1){
				var json=JSON.parse(data);
				if(isDefine(json.created_at))
				{
					uexWindow.toast("0","5","分享到新浪微博成功",2000);
				}
				else if(json.error_code==21327)
				{
					openwin('login', 'login.html', '12');
				}
				else if(json.error_code==20019){
					uexWindow.toast("0","5","您已经分享过一次，不能重复分享",2000);
				}
				else
				{
					uexWindow.toast("0","5","分享到新浪微博失败",2000);
				}
			}
			else if(type==0){
				var json = JSON.parse(data);
				var str = "分享到腾讯微博失败"
				if(json.ret==0) str = "分享到腾讯微博成功";
				uexWindow.toast("0","5",str,2000);
			}
			else{
				var json = JSON.parse(data);
				if(json && json.upload_image_url){
					weibop.upload_image_url = json.upload_image_url;
					weiboSubmit(weibop.txt);
					return;
				}
				var str = "分享到网易微博失败"
				if(json.created_at) str = "分享到网易微博成功";
				uexWindow.toast("0","5",str,2000);
			}
			
			setTimeout("uescript('weibosend','closewin();');", 1500);
		}else{
			var note = "已分享到新浪微博";
			if (type == 1) {
				if (data == 'error:403') note = '分享失败！access_token错误。';
				uexXmlHttpMgr.close(opId);
			}
			uexWindow.toast("0", "5", note, 2000);
		}	
	}
} 
