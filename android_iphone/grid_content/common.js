function downcb(){

	toGetApps(0);
}
function upcb(){
  resetBV('1');
}

function loadList(data){
	icons=[];
	var list = data;
	var temp_list;
	var length = zy_tmpl_count(list);

	//alert(JSON.stringify(data));

	var tmpl=' <div class="ub-f1 ub ub-ver ub-ac ub-pc" onclick="go2new5(${id});">'+
   				'<div id="img${id}" class="ub-img uwh-acc2 ${icon} umar-at1" style="${style} ${cb:bgImg}"></div>'+
				'<div class="ulev-1 umar-t-acc1">${name}</div>'+
   			   ' </div>';

   	 var htmlStr="";
   	 var tem="";

   	 var col=3;
	for(var i=0;i<=length/col-1;i++){
		 temp_list=list.slice(i*col,i*col+col);
		 tem = zy_tmpl(tmpl,temp_list,temp_list.length,tmpleCb);
		 tem='<div class="ub t-bla">'+tem+'</div>';
		 htmlStr+=tem;
		// alert(htmlStr);

	}

    //alert(list.length);
    var temp_list=list.slice(length-length%col);
	if(temp_list.length>0){
    		tem = zy_tmpl(tmpl,temp_list,temp_list.length,null);
		 	for (var j = col-temp_list.length; j >=1; j--) {
		 		tem+='<div class="ub-f1 ub ub-ver ub-ac ub-pc" >'+
   				'<div class="ub-img uwh-acc2  umar-at1"></div>'+
				'<div class="ulev-1 umar-t-acc1"></div>'+
   			   ' </div>';
   			}

   			tem='<div class="ub t-bla">'+tem+'</div>';
   			htmlStr+=tem;
	 }

	setHtml("content",htmlStr);



}

//var params='{"view":"score"}';
function go2new5(id){	

	if(data[id].url){
      if(data[id].type=="webapp"){
			uexWindow.toast('1', '5', "加载中...", '1500');
			openUrl(data[id].url,data[id].name,data[id].wnm);
			
	  }else if(data[id].type=="local"){
		setstorage('params',data[id].params);
		//alert(getstorage("params"));
		openwin(data[id].wnm,data[id].url,'10');
	   }else{
	   		eval(data[id].jscode);
	   }
	}
}


var icons=[];
function tmpleCb(a, b){
	switch(b[1]){
		case "bgImg":
			var imgurl=cacheIcons["img"+a['id']];//从缓存里读取图标
			if(isDefine(imgurl)){
				return "background-image: url("+imgurl+")";
			}

		    imgurl = a['bgImg'];
		    if(imgurl){
				icons["img"+a['id']]=imgurl;
				return "background-image: url("+imgurl+")";

			}
			return "";
			break;

		}

}

function imgcache(){
	for(index in icons){
	    zy_imgcache(index, index, icons[index],imgLoadSuc2, imgLoadErr2,null,'png');


	}
}


function imgLoadSuc2(id, src){
	var e = $$(id);
	if(e && e.style) e.style.cssText = "background-image: url("+src+")";
	cacheIcons[id]=src;

}

function imgLoadErr2(id){
	var e = $$(id);
	if(e && e.style) e.style.cssText = "background-image: url(../images/imgno.png)";
}