



export function combined_uuid(uuid1,uuid2){
	if(uuid1 > uuid2){
		var tmp = uuid1
		uuid1 = uuid2
		uuid2 = tmp
	}
	return uuid1+uuid2
}