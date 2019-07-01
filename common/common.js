export let serverUrl = (route, arr) => {
	let url = "https://www.imovietrailer.com/superhero/" + route + "?qq=1129434866"
	if (arr && arr.length) {
		arr.forEach(item => {
			url += "&" + item
		})
	}
	return url
}
