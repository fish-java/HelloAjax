var xhr = new XMLHttpRequest();

xhr.onload = function(){
  console.log(this.status)
  console.log(this.statusText)
  console.log(this.getAllResponseHeaders())
  console.log(this.responseText)
}

xhr.open('GET', 'https://api.github.com/repos/bitfishxyz/ajax/issues/2');

xhr.send();