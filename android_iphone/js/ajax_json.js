/*
用uexXmlHttpMgr封装AJAX方法
主要解决uexXmlHttpMgr同时多次发起时，onData参数会被覆盖的问题（懂的人会懂的，不明白的人的话忽略 直接用即可。）
*/
window.AJAX = {
	callBack : {},index : 1,
	get : function(url,succCall,errCall,timeout){
		var id = this.index++;
		this.callBack[id] = [succCall,errCall];
		uexXmlHttpMgr.open(id,'get',url,(timeout||0));
		this._send(id);
	},
	post : function(url,data,succCall,errCall,timeout){
		var id = this.index++;
		this.callBack[id] = [succCall,errCall];
		uexXmlHttpMgr.open(id,'post',url,(timeout||0));
		if(data){
			for(var k in data){
				uexXmlHttpMgr.setPostData(id,0,k,data[k]);
			}
		}
		this._send(id);
	},
	_send : function(id){
		uexXmlHttpMgr.onData = this.onData;
		uexXmlHttpMgr.send(id);
	},
	onData : function(inOpCode,inStatus,inResult){
		var that=AJAX,callBack = that.callBack[inOpCode]||[];
		if(inStatus==-1){
			callBack[1] && callBack[1]();
		}else if(inStatus==1){
			callBack[0] && callBack[0](inResult);	
		}
		delete that.callBack[inOpCode];
	}
};
// window.uexOnload = function(){
// 	//GET请求
// 	AJAX.get('http://www.baidu.com',function(res){
// 		alert('baidu');
// 		alert(res);	
// 	},function(){
// 		alert('我ca！baidu出错了');	
// 	});
	
// 	//POST的第2个参数为需要post的数据
// 	AJAX.post('http://m.baidu.com',{
// 		'word':'刺鸟',
// 		'word2':'qq4041990'	
// 	},function(res){
// 		alert('mbaidu');
// 		alert(res);	
// 	},function(){
// 		alert('我ca！mbaidu出错了');	
// 	});
// };