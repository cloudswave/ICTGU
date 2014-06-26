/*Creat at 2012-07-25 for discuz v3.0 by JetCheung*/

/* 热帖　广告 */
var flip1 = null;
var fliptm = '';
var stobj = {};
var hasSub = false;
function openwindow(tid){
	setstorage('params','{"tid":"'+tid+'"}');
	openwin('forum_detail','forum_detail.html','10');
}

function flipmovecb(){
	if(flip1){
		var f = flip1;	
		var cp = f.currentPoint;
		var mp = f.maxPoint;
		var pp = f.prevPoint;
	}
}
function flipck(){
	var cp = flip1.currentPoint;
	var url = stobj[cp].url;
	logs('flipck-->url='+url);
	if(url){
		if(url.indexOf(serverurl)>=0){
			var str = url.split("tid=");
			var tid = 0;
			if(str){
				var str1 = str[1];
				if (str1) {
					var str2 = str1.split("&");
					tid = str2[0];
				}
			}
			openwindow(tid);
		}
		else{
			var reg = /\D/;
			if(url.match(reg)==null) openwindow(url);
			else loadLink(url);
		}
	}
	
}
function flipend(){
	var cp = flip1.currentPoint;
	var id = 'fr'+cp;
	var ele = $$(id);
	if(ele && !ele.checked) ele.checked=true;
	//logs('flipend()-->cp='+cp);
	if(hasSub){
		var str = stobj[cp].sub;
		setHtml('flipid', str?str:'&nbsp;');
	}
}
function fliptimer(){
	if(flip1){
		var f = flip1;
		var mp = f.maxPoint;
		var tp = f.currentPoint + 1;
		if(tp>mp) tp=0;
		
		f.moveToPoint(tp);
		fliptimerCancel(1);
		fliptm = setTimeout('fliptimer();', 5000);
	}
	//logs('fliptimer()-->fliptm='+fliptm);
}
function fliptimerSet(){
	//logs('fliptimerSet()-->fliptm='+fliptm);
	if(flip1){
		fliptimerCancel(1);
		fliptm = setTimeout('fliptimer();', 5000);
	}
}
function fliptimerCancel(f){
	//if(!f) logs('fliptimerCancel()-->fliptm='+fliptm);
	if(flip1 && fliptm){
		clearTimeout(fliptm);
		fliptm = '';
	}
}
function addflip(obj, wname){
	logs('addflip()-->obj='+obj+', wname='+wname+', flip1='+flip1);
	if(flip1) return;
	if(!obj) obj=getStorJson('usetting'); 
	var locked = 0;
	if(obj && ((wname=='main_forum' && obj.index_pic_status=='1') || (wname=='forum_detail' && obj.hot_post_pic_status=='1'))){
		var str = '';
		var str2 = '';
		var index = 0;
		var src = [obj.index_pic1, obj.index_pic2, obj.index_pic3];
		var url = [obj.index_pic1_url, obj.index_pic2_url, obj.index_pic3_url];
		var sub = [];
		if (wname == 'forum_detail') {
			locked = 0;
			src = [obj.hot_post_pic1, obj.hot_post_pic2, obj.hot_post_pic3];
			url = [obj.hot_post_pic1_url, obj.hot_post_pic2_url, obj.hot_post_pic3_url];
		}
		else{
			hasSub = true;
			sub = [obj.index_pic1_subject, obj.index_pic2_subject, obj.index_pic3_subject];
		} 
		
		if(src[0]){
			var imgID = 'adpic'+index;
			var inpID = 'fr'+index;
			str = '<div class="ub-fh"><img id="'+imgID+'" class="adpic ub-img5" src=""/></div>';
			str2 = '<input type="radio" name="flipr" id="'+inpID+'" class="uhide"><span class="ady"></span>';
			
			dis_imgcache(imgID,src[0],src[0],imgLoadSucSrc,imgLoadErrSrc,null,'');
			
			stobj[index] = {};
			stobj[index].sub = sub[0];
			stobj[index].url = url[0];
			index++;
		}
		if(src[1]){	
			var imgID = 'adpic'+index;
			var inpID = 'fr'+index;
			str = str+'<div class="ub-fh"><img id="'+imgID+'" class="adpic ub-img5" src=""/></div>';
			str2 = str2+'<input type="radio" name="flipr" id="'+inpID+'" class="uhide"><span class="ady"></span>';
			
			dis_imgcache(imgID,src[1],src[1],imgLoadSucSrc,imgLoadErrSrc,null,'');
			
			stobj[index] = {};
			stobj[index].sub = sub[1];
			stobj[index].url = url[1];
			index++;
		}
		if(src[2]){
			var imgID = 'adpic'+index;
			var inpID = 'fr'+index;
			str = str+'<div class="ub-fh"><img id="'+imgID+'" class="adpic ub-img5" src=""/></div>';
			str2 = str2+'<input type="radio" name="flipr" id="'+inpID+'" class="uhide"><span class="ady"></span>';
			
			dis_imgcache(imgID,src[2],src[2],imgLoadSucSrc,imgLoadErrSrc,null,'');
			
			stobj[index] = {};
			stobj[index].sub = sub[2];
			stobj[index].url = url[2];
		}
		
		if(str){
			setHtml('box1', str);
			setHtml('rad1', str2);
			if(hasSub) setHtml('flipid', stobj[0].sub);
			var ele = $$('rad1');
			if(ele && ele.children[0]) ele.children[0].checked = true;
			zy_anim_pop('adimg', 'uhide');
			
			flip1 = new zySlide("box1", "H", flipmovecb, locked, flipend, flipck);
			fliptm = setTimeout('fliptimer();', 5000);
		}
	}
	else zy_anim_push('adimg', 'uhide');
}

function closead(){
	if(flip1){
		clearTimeout(fliptm);
		//removeNode('adimg');
		setstorage('closead', 1);
		delete flip1;
		flip1 = null;
		
		var e = $$('adimg');
		setHtml(e, '');
		e.style.height = '1px';
	}
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */