var x = 0
var y = 0
//6c480062-871b-45c3-b5cd-4907e771040b
var tempPost = document.createElement("div")
var tempText = document.createElement("textarea")
//PTdsdvAies
var lastX = 0
var lastY = 0

var key = "e3%dvRyNd$2b$10$fmT4vufdnQAVLmHFDaZtmu48DFfOxjbZHEXB2Algbr5EhcAm5A4P2ra5mfjdJDroTwnd"

var rotation = getRndInteger(-20,20)

var finalX = 0
var finalY = 0

var showTempNote = false
var url = "https://api.jsonbin.io/v3/b/6341a84f65b57a31e68f790f"
var http = new XMLHttpRequest

const colorTable = ["Yellow","Blue","Green","Red","Purple"]
var currentColorValue = 0
key = key.substring(9,69)
http.open('GET',url)
http.setRequestHeader("X-Master-Key",key)
http.onload = function() {
  let response = JSON.parse(http.responseText)
  console.log(response)
  for (let i = 0; i < response.record.Posts.length; i++) {
    let post = document.createElement("div")
    let text = document.createElement("pre")
    text.disabled = true
    text.innerText = response.record.Posts[i].Content
    post.style.backgroundImage = `url('stickynote${response.record.Posts[i].Color}.png')`
    post.style.left = `${response.record.Posts[i].X}px`
    post.style.top = `${response.record.Posts[i].Y}px`
    post.style.transform = `rotate(${response.record.Posts[i].Rotation}deg)`
    document.body.appendChild(post)
    post.appendChild(text)
  }
}
http.send()



function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

document.addEventListener('mousemove', (event) => {
  var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	x = event.clientX
  y = event.clientY
  lastX = x
  lastY = y
  finalX = x+scrollLeft
  finalY = y+scrollTop
  if (showTempNote == true) {
    tempPost.style.opacity = 1
    updateTempNote()
  } else {
    tempPost.style.opacity = 0
  }
});
document.addEventListener('scroll', (event) => {
  var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	x = lastX
  y = lastY
  finalX = x+scrollLeft
  finalY = y+scrollTop
  if (showTempNote == true) {
    tempPost.style.opacity = 1
    updateTempNote()
  } else {
    tempPost.style.opacity = 0
  }
});

setInterval(()=>{
  document.getElementById("xy").innerText = `X: ${Math.round(finalX)} Y:${Math.round(finalY)}`
},1)
document.addEventListener('keydown', (event) => {
  if (event.key == "n" && showTempNote == false && tempText != document.activeElement) {
    showTempNote = true
  } else if (event.key == "n" && showTempNote == true && tempText != document.activeElement) {
    showTempNote = false
  }
  if (showTempNote == true) {
    tempPost.style.opacity = 1
  } else {
    tempPost.style.opacity = 0
  }
})
document.addEventListener('keydown', (event) => {
  if (event.key == "f" && tempText != document.activeElement) {
    let posts = document.body.getElementsByTagName("div")
    let rnd = getRndInteger(0,posts.length)
    for (let i = 0; i < posts.length; i++) {
      posts[i].style.zIndex = 50
    }
    posts[rnd].scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    });
    posts[rnd].style.zIndex = 55
  }
})
document.addEventListener('keydown', (event) => {
  if (event.key == "c" && tempText != document.activeElement) {
    currentColorValue = (currentColorValue+1)
  }
})
document.addEventListener('keydown', (event) => {
  if (event.key == "Enter" && showTempNote == true && tempText != document.activeElement) {
    http.open('GET',url)
    http.setRequestHeader("X-Master-Key",key)
    http.setRequestHeader("Content-Type", "application/json");
    http.onload = function() {
      let response = JSON.parse(this.responseText)
      let posts = response.record.Posts
      posts.push({
        "Content": tempText.value,
        "X": finalX-210,
        "Y": finalY-170,
        "Rotation": rotation,
        "Color": colorTable[currentColorValue%colorTable.length]
        },
      )
      posts = {"Posts":posts}
      console.log(JSON.stringify(response))
      http.open('PUT',url)
      http.setRequestHeader("Content-Type", "application/json");
      http.setRequestHeader("X-Master-Key",key)
      http.onload=function(){
        console.log(http.responseText)
      }
      http.send(JSON.stringify(posts))
      tempText.disabled = true
      tempPost = document.createElement("div")
      tempText = document.createElement("textarea")
      rotation = getRndInteger(-20,20)
      showTempNote = false
    }
    http.send()
  } 
})
function updateTempNote() {
  document.body.appendChild(tempPost)
  tempPost.appendChild(tempText)
  tempPost.style.transform = `rotate(${rotation}deg)`
  tempPost.style.top = `${finalY-170}px`
  tempPost.style.left = `${finalX-210}px`
  tempPost.style.backgroundImage = `url('stickynote${colorTable[currentColorValue%colorTable.length]}.png')`
}



