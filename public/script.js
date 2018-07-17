(function(){
  let nameInput = document.getElementById("nameInput");
  let nickInput = document.getElementById("nickInput");
  let enterButton = document.getElementById("enterButton");
  let enterPage = document.getElementsByClassName("enter-page")[0];
  let peopleList = document.getElementById("peopleList");
  let userName = "";
  let nickName = "@nickname";

  nickInput.value = "";
  nameInput.value = "";

  enterButton.onclick = () => {
    let el = document.getElementsByClassName("container")[0];
    userName = nameInput.value || "Username";
    nickName = "@" + (nickInput.value || "nickname");
    el.style.display = "block";
    enterPage.style.display= "none";

    ajaxRequest({
      method: "POST",
      url: "/",
      data: {
        name : userName,
        nick : nickName
      }
    });
  }

  window.onbeforeunload = () => {
    ajaxRequest({
      method: "DELETE",
      url: "/",
      data: {nick: nickName}
    });
  };

  let messagesList = document.getElementById("messages");
  let text = document.getElementById("message-to-send");
  let textSubmit = document.getElementById("textSubmit");

  textSubmit.onclick = () => {
    let data = {
      name: userName,
      nick: nickName,
      date: Date.now(),
      text: text.value
    };

    text.value = '';
    
    ajaxRequest({
      method: "POST",
      url: "/messages",
      data: data
    });
  }

  let ajaxRequest = (options) => {
    let url = options.url || "";
    let method = options.method || "GET";
    let callback = options.callback || function(){};
    let data = options.data || {};
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(data));

    xmlHttp.onreadystatechange = () => {
      if(xmlHttp.status == 200 && xmlHttp.readyState == 4) {
        callback(xmlHttp.responseText);
      }
    };
  };

  let getData = () => {
    ajaxRequest({
      url: "/messages",
      method: "GET",
      callback: (msg) => {
        let data = JSON.parse(msg);
        let messages = data.messages;
        let usersOnline = data.usersOnline;

        messagesList.innerHTML = "";
        peopleList.innerHTML = "";

        for (let item in messages){
          let el = createMessage(messages[item]);
          if (messages[item].text.includes(nickName)) {
						el.lastElementChild.setAttribute("class", 'message private-message');
          }
          messagesList.appendChild(el);
        }

        for (let item in usersOnline){
          let el = createPeople(usersOnline[item]);
          peopleList.appendChild(el);
        }

        // chat_history.scrollTop = chat_history.scrollHeight + 90;
      }
    });
  };

  let createMessage = (item) => {
    let li = document.createElement("li");
    let divUser = document.createElement("div");
    let divText = document.createElement("div");
    let spanName = document.createElement("span");
    let spanDate = document.createElement("span");

    spanName.innerText = item.name + " (" + item.nick + ")";
    spanName.setAttribute("class", "message-data-name");
    spanDate.innerText = new Date(item.date).toLocaleString();
    spanDate.setAttribute("class", "message-data-time");

    divUser.appendChild(spanName);
    divUser.appendChild(spanDate);
    divUser.setAttribute("class", "message-data ");

    divText.innerText = item.text;
    divText.setAttribute("class", "message other-message");

    li.appendChild(divUser);
    li.appendChild(divText);
    li.setAttribute("class", "clearfix");

    return li;
  }

  let createPeople = (item) => {
    let li = document.createElement("li");
    let divAbout = document.createElement("div");
    let divName = document.createElement("div");

    divName.innerText = item.name + " | " + item.nick;
    divName.setAttribute("class", "name");

    divAbout.appendChild(divName);
    divAbout.setAttribute("class", "about");

    li.appendChild(divAbout);
    li.setAttribute("class", "clearfix");

    return li;
  }

  getData();
  setInterval(()=>{
    getData();
  }, 1000);
}
)();
