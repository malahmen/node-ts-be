class ResponseFormater {

	apply(response: string|object) {
		return JSON.stringify(response);	
	}
}

export default ResponseFormater;