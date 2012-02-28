document.write('<script type="text/javascript" src="pogopluglib.js"></script>');
document.write('<script type="text/javascript" src="queryCreator.js"></script>');

$(document).ready(function(){
    valtoken = localStorage.valtoken;
    if (!valtoken || valtoken.length == 0) {
        document.location.href = "index.html";
    }
	$.mobile.pageLoading();
    getListServices();
});

function getListServices(){
    $.get(createQueryForListServices(), function(data){
        jsondata = jQuery.parseJSON(data);
        
        var $select = $('<select id="services" />');
        $.each(jsondata.services, function(){
			if(this.online == 1)
			{
	            $('<option value="' + this.serviceid + ' ' + this.deviceid + '" />').append(this.name).appendTo($select);
			}
        });
        $('#servicedata').empty().append($select);
        $('#services').listview()
        $("#services").change(function(){
            $.mobile.pageLoading();
            $.get(createQueryForMoveDirectory(), function(data){
                createfileLinkList(data);
				$.mobile.pageLoading(true);
            });
        });
        $.get(createQueryForMoveDirectory(), function(data){
            createfileLinkList(data);
            $(document).page();
            $.mobile.pageLoading(true);
            
        });
        
    });
}


function createfileLink(fileid, name){

    var fileLink = $('<li />').text(name).append(createUtilityList(fileid, name));
    
    return fileLink;
}


function createUtilityList(fileid, name){
    var ul = $('<ul />');
    
    //download	
    $('<li />').append($("<a />").attr("target", "_blank").attr("href", createQueryForFileLink($("#services").val().split(" ")[1], $("#services").val().split(" ")[0], fileid, 'dl')).text("Download")).appendTo(ul);
    
    //stream
    $('<li />').append($("<a />").attr("target", "_blank").attr("href", createQueryForFileLink($("#services").val().split(" ")[1], $("#services").val().split(" ")[0], fileid, 'strm')).text("stream")).appendTo(ul);
    
    //GoodReader
    $('<li />').append($("<a />").attr("target", "_blank").attr("href", "g" + createQueryForFileLink($("#services").val().split(" ")[1], $("#services").val().split(" ")[0], fileid, 'dl')).text("GoodReader")).appendTo(ul);
    
    //ComicGlass
    $('<li />').append($("<a />").attr("target", "_blank").attr("href", "cg" + createQueryForFileLink($("#services").val().split(" ")[1], $("#services").val().split(" ")[0], fileid, 'dl')).text("ComicGlass")).appendTo(ul);
    
    
    //iBunko
    $('<li />').append($("<a />").attr("target", "_blank").attr("href", "ib" + createQueryForFileLink($("#services").val().split(" ")[1], $("#services").val().split(" ")[0], fileid, 'dl', name)).text("iBunkoHD,iBunkoS")).appendTo(ul);
    
    //Serverman
    $('<li />').append($("<a />").attr("target", "_blank").attr("href", createQueryForFileLink($("#services").val().split(" ")[1], $("#services").val().split(" ")[0], fileid, 'dl', null, 'serversman://http:')).text("ServersMan")).appendTo(ul);
    
    
    return ul;
}


var parentList = [];

function createLinkToParentDirectory(){
    if (parentList.length == 1) {
        return $('<li />').append($('<a />').click(function(){
            $.mobile.pageLoading();
            $.get(createQueryForMoveDirectory(), function(data){
                parentList.pop();
                createfileLinkList(data);
                $.mobile.pageLoading(true);
            });
        }).text(".."));
    }
    else {
        return $('<li />').append($('<a />').click(function(){
            $.mobile.pageLoading();
            $.get(createQueryForMoveDirectory(parentList[parentList.length - 2].id), function(data){
                parentList.pop();
                createfileLinkList(data);
                $.mobile.pageLoading(true);
            });
        }).text(".."));
    }
}

function createLinkToMoveDirectory(fileid, filename){
    return $('<li />').append($('<a />').click(function(){
        $.mobile.pageLoading();
        $.get(createQueryForMoveDirectory(fileid), function(data){
            parentList.push({
                id: fileid,
                name: filename
            });
            createfileLinkList(data);
            $.mobile.pageLoading(true);
        });
    }).text(filename + "/"));
}

function createLinkToContinueLoad(){
    return $('<li id="continueLoad" />').append($('<image class="ui-li-icon" src="./pictures/loading.gif" />').text("continue..."));
}

var currentParentid = null;

//ファイルリストのリンクを作成します。ディレクトリの時はディレクトリ移動のボタンが作成されます。
function createfileLinkList(data){
    jsondata = jQuery.parseJSON(data);
    if (jsondata.count == 0) {
        alert("This page does not have data.")
        return;
    }
	    
    var $ul = $('<ul id="filelist" />');
    //親ディレクトリに戻るボタンを作成
    if (parentList.length > 0) {
        createLinkToParentDirectory().appendTo($ul);
    }
    
    $.each(jsondata.files, function(){
        //ファイルタイプがファイルだったらリンクを、ディレクトリだったらサブディレクトリのファイルリスト取得のリンクを作成
        if (this.type == 0) {
            createfileLink(this.fileid, this.name).appendTo($ul);
        }
        else {
            createLinkToMoveDirectory(this.fileid, this.name).appendTo($ul);
        }
    });
	createLinkToContinueLoad().appendTo($ul);
    $('#filedata').html($ul);
    //		$('#breadclumbs').html(createBreadCrumbs());
    $("#filelist").listview();

	var localParentid = null;
	if(parentList.length != 0)
	{
		localParentid = parentList[parentList.length -1].id;
		currentParentid = localParentid;
	}
	else
	{
		currentParentid = null;
	}

	requestNextPage();
}

//ファイルリストのリンクを作成します。ディレクトリの時はディレクトリ移動のボタンが作成されます。
function addfileLinkList(data){
    $('#continueLoad').remove();
    jsondata = jQuery.parseJSON(data);
    if (jsondata.count == 0) {
    
        return;
    }
    
    var $ul = $('<ul />');
   
    $.each(jsondata.files, function(){
        //ファイルタイプがファイルだったらリンクを、ディレクトリだったらサブディレクトリのファイルリスト取得のリンクを作成
        var $li;
        if (this.type == 0) {
            $li = createfileLink(this.fileid, this.name);
        }
        else {
            $li = createLinkToMoveDirectory(this.fileid, this.name);
        }
        $li.appendTo($ul);
    });
	createLinkToContinueLoad().appendTo($ul);
    $ul.listview();
	$ul.find('li').appendTo($("#filelist"));
	requestNextPage();
}

//同じフォルダ内の次ページへのリクエストを出す
//レスポンス取得時に他のフォルダに移っていたらデータを捨てる。
function requestNextPage()
{
	var localParentid = null;
	if(parentList.length != 0)
	{
		localParentid = parentList[parentList.length -1].id;
	}

    $.get(createQueryForNextPage(), function(data){
		if(localParentid != null && currentParentid == null)
		{
			return;
		}		
		if(localParentid == null && currentParentid != null)
		{
			return;
		}		
		if(localParentid != null && currentParentid != null)
		{
			if(localParentid != currentParentid)
			{
				return;
			}
		}		
		addfileLinkList(data);		
    });
	
}




function createBreadCrumbs(){
    var crumbs = "";
    $.each(parentList, function(){
        crumbs += this.name + "&gt;&gt;";
    })
    return crumbs;
}

    /*
     //今までのディレクトリ操作を忘れてファイル検索を行う。
     $("#search").click(function(){
     parentList = [];
     $.post(craeteQueryForSearchFiles(),
     createSearchQuery(
     $("#services").val().split(" ")[1],
     $("#services").val(),
     $("#searchQuery").val()
     ),
     function(data){
     createFileLinkList(data);
     },
     "json")
     });
     
     //検索表示をクリア
     $("#searchclear").click(function(){
     $.get(createQueryForMoveDirectory(),
     function(data){
     createfileLinkList(data);
     $(document).page();
     $.mobile.pageLoading(true);
     }
     );
     });
     */
	
	/*
function getListDevices(){
    $.mobile.pageLoading();
    $.get(createQueryForListDevices(), function(data){
    
        jsondata = jQuery.parseJSON(data);
        
        var $select = $('<select id="devices" />');
        $.each(jsondata.devices, function(){
            $('<option value="' + this.deviceid + '" />').append(this.name).appendTo($select);
        });
        $('#devicedata').empty().append($select);
        $('#devices').listview();
        getListServices();
    });
    
}
*/

