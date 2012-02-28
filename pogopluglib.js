
$.get = function(sendurl, successfunc){
	$.ajax(
	{	
		type:"GET",
		url:sendurl,
		success: function(data){
			successfunc(data);
		},
		error :function(request,textmessage,errorThrown){
				$.mobile.pageLoading(true);
				alert(errorThrown);				
		}
	}
	);
}
var valtoken = "";
