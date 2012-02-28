	var pageIndex = 0;	
	var valtoken = "";

	function createQueryForLogin(mailAddress,password)
	{
		var requestUrl =  "https://service.pogoplug.com/svc/api/loginUser?email=" 
					+ mailAddress + 
					"&password=" + password;
					
		return encodeURI(requestUrl);
	}
	
	function createQueryForListDevices()
	{
		var requestUrl = "https://service.pogoplug.com/svc/api/listDevices?valtoken=" + valtoken;
		return encodeURI(requestUrl);
	}
	
	function createQueryForListServices()
	{
		var requestUrl = "https://service.pogoplug.com/svc/api/listServices?valtoken=" 
					+ valtoken;
					
		return encodeURI(requestUrl);
	}
	
	function createQueryForListFiles(parentId,pageIndex)
	{
		var listFilesUrl = "https://service.pogoplug.com/svc/api/listFiles?valtoken=" +
					  		valtoken +
					  		"&deviceid=" +
					  		$("#services").val().split(" ")[1] +
					  		"&serviceid=" +
					  		$("#services").val().split(" ")[0];
		if(parentId){
	  		listFilesUrl += "&parentid=" + parentId;	
		}
		if(pageIndex){
  			listFilesUrl +=	"&pageoffset=" + pageIndex;			
		}
		return encodeURI(listFilesUrl);
	}
	
	function craeteQueryForSearchFiles()
	{
		var requestUrl = "https://service.pogoplug.com/svc/api/searchFiles?valtoken=" + valtoken;
		return encodeURI(requestUrl);		
	}	

	function createSearchQuery(deviceid,serviceid,value)
	{
		return {
			devideid: deviceid,
			serviceid: serviceid,
			searchcrit:'name contains "' + value + '"'
			};
	}	
		
		
	function createQueryForMoveDirectory(targetId)
	{
		pageIndex = 0;
		return createQueryForListFiles(targetId);
	}
	
	function createQueryForNextPage()
	{
		pageIndex++;
		if(parentList.length == 0)
		{
			return createQueryForListFiles(null,pageIndex);
		}else{			
			return createQueryForListFiles(parentList[parentList.length -1].id,pageIndex);
		}
	}

	function createQueryForPreviousPage()
	{
		if(pageIndex > 0){
			pageIndex--;			
		}
		if(parentList.length == 0)
		{
			return createQueryForListFiles(null,pageIndex);
		}else{			
			return createQueryForListFiles(parentList[parentList.length -1].id,pageIndex);
		}
	}	
	
	function createQueryForFileLink(deviceId,serviceId,fileId,type,name,urlscheme)
	{	
		if(!urlscheme)
		{
			urlscheme = 'http:';
		}
		var href = urlscheme + '//service.pogoplug.com/svc/files/' 
					+ valtoken + '/' + deviceId + '/' + serviceId + '/' + fileId + '/' + type + '/';
        if(name)
		{
			href += "?title=" + name;
		}
		return encodeURI(href);		
	}
	
