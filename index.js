	document.write('<script type="text/javascript" src="pogopluglib.js"></script>');
	document.write('<script type="text/javascript" src="queryCreator.js"></script>');

	$(document).ready(function(){
		if(localStorage.mailAddress)
		{
			$("#mailAddress").val(localStorage.mailAddress);
		}
	
		//Loginボタンをクリックしたときに発行されます。
		//valtokenを取得することで、次以降のステップのサービスが利用できるようにします。
		$("#login").click(function(){
			$.mobile.pageLoading();
			localStorage.mailAddress = $("#mailAddress").val();
			$.get(createQueryForLogin($("#mailAddress").val(),$("#password").val()), 
					function(data){
						jsondata = jQuery.parseJSON(data);
						localStorage.valtoken = jsondata.valtoken;
						window.document.location.href = "content.html";
			});
	});
});
	


