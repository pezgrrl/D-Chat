
// If there is already a screenname in local storage, the browser will choose that one instead of anon -ps
if (localStorage.getItem("sn")) {
    var sn = localStorage.getItem("sn");
} else {    //anon is the default for those who do not pick screennames -ps
    var sn = "anon";
}
var config = {
    apiKey: "AIzaSyCc2VPnhKLPvdEc_h6txQyIIcxrm2Ll_3s",
    authDomain: "project1-chat.firebaseapp.com",
    databaseURL: "https://project1-chat.firebaseio.com",
    projectId: "project1-chat",
    storageBucket: "project1-chat.appspot.com",
    messagingSenderId: "357337575812"
};
firebase.initializeApp(config);
// Initialize Firebase
var database = firebase.database();
var userList = [];
var isDuplicate = false;

function fireMessage(msg) {
    database.ref("message-history").push({
        name: sn,
        message: msg,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
    });
}

function giphySearch(query) {
    var apiKey = "&api_key=tEEFTUSNf170mNTLFD9OkvQMltuPs8gS";
    var queryURL = "https://api.giphy.com/v1/gifs/";
    if (query) {
        queryURL += "search?q=" + query + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            if(response.data.length) {
                var imageURL = response.data[Math.floor(Math.random()*response.data.length)].images.fixed_width.url;
                database.ref("message-history").push({
                    name: sn,
                    message: msg,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    api_query: query,
                    api_result: imageURL,
                    api_type: "giphy",
                });
            } else {
                giphySearch();
            }
        });
    } else {
        queryURL += "random?" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var imageURL = response.data.images.fixed_width.url;
            database.ref("message-history").push({
                name: sn,
                message: msg,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                api_query: "",
                api_result: imageURL,
                api_type: "giphy",
            });
        });
    }
}

function createTriviaURL(d, c, t, a) {
    var cat = "", diff = "", type = "&type=multiple", amt = 1;
    if (d) {
        diff = "&difficulty=" + d;
    }
    if (c) {
        cat = "&category=" + c;
    }
    // if (t) {
    //     type = "&type=" + t;
    // }
    // if (a) {
    //     amt = a;
    // }
    var url = "https://opentdb.com/api.php?amount=" + amt + cat + diff + type;
    return url;
}

function getTrivia(url, msg) {
    $.ajax({
        method: "GET",
        url: url,
    }).then(function (data) {
        if (data.response_code === 0) {
            var triviaQuestion = data.results;
            //console.log(triviaQuestion);
            database.ref("message-history").push({
                name: sn,
                message: msg,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                api_result: triviaQuestion,
                api_type: "trivia",
            });
        }
    })
}


var bot = {
    checkMsg: function (msg) {
        if (msg.charAt(0) === "!") {
            this.botAction(msg);
        } else {
            fireMessage(msg);
        }
    },

    botAction: function (msg) {
        var action = msg.substring(1).split(" ");
        switch (action[0]) {
            case "giphy":
                giphySearch(action[1]);
                break;
            case "trivia":
                getTrivia(createTriviaURL(action[1], action[2]), msg);
                break;
            case "help":
                //help()
                break;
            default:
                fireMessage(msg);
                break;
        }
    },
    help: function () {
        //tell what bot can do
    }
}

$(document).ready(function () {
    //overlay div for picking username initially -ps
    var overlay = $("<div>").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        "z-index": "999",
        "background-color": "#868e96e3",
        opacity: "0.99",
        display: "block",
    });
    var duplicateDiv = $("<div>That name is already in use.</div>").css({
        color: "red",
        display: "none",
        "font-weight": "bold",
        "text-align": "center",
        "text-shadow": "1px 1px black",
    });
    var snForm = $("<form>");
    var snChoice = $("<input type='text' placeholder='Pick a screen name...' id='sn'>");
    snChoice.addClass("my-5 mx-auto d-block");
    var snButton = $("<input type=submit id='snSubmit'>").css("display", "none");
    snForm.append(snChoice, snButton);
    overlay.append(snForm);
    overlay.append(duplicateDiv);
    //submit button for screenname, sets screenname in localstorage and pushes to database
    $("body").on("click", "#snSubmit", function (event) {
        event.preventDefault();
        if ($("#sn").val()) {
            sn = $("#sn").val();
            localStorage.setItem("sn", sn);
        }
        for (let i = 0; i < userList.length; i++) {
            isDuplicate = (localStorage.getItem("sn") === userList[i]);
            if (isDuplicate) {
                duplicateDiv.css("display", "block");
                return;
            }
        }
        if (isDuplicate) {
            localStorage.setItem("sn", "anon");
        } else {
            if (localStorage.getItem("sn")) {
                database.ref("userlist/" + localStorage.getItem("sn")).push({
                    name: localStorage.getItem("sn"),
                });
            }
            overlay.css("display", "none");
            $("#msg").focus();
        }
    });
    $("body").append(overlay);


    //pushes messages to database when send button clicked
    $("#send").on("click", function (event) {
        event.preventDefault();
        if ($("#msg").val()) {
            var msg = $("#msg").val();
            bot.checkMsg(msg);
            $("#msg").val("");
        }

    });


    //updates userList array when new child added to userlist database
    database.ref("userlist").on("child_added", function (snapshot) {
        var newUser = snapshot.key;
        userList.push(newUser);
        $("#contacts ul").append('\
        <li class="contact active" id='+ newUser + '>\
            <div class="wrap">\
                <span class="contact-status online"></span>\
                <img src="assets/images/img.png" alt="" />\
                <div class="meta">\
                    <p class="name">'+ newUser + '</p>\
                    <p class="preview"></p>\
                </div>\
            </div>\
        </li>');
    });

    database.ref("userlist").on("child_removed", function (snapshot) {
        var signoffUser = snapshot.key;
        userList.splice(userList.indexOf(signoffUser), 1);
        $("#" + signoffUser).remove();
    });

    //code to run when user closes screen (signs off)
    window.onbeforeunload = function () {
        database.ref("userlist/" + sn).remove();
    }


    //updates chat window with most recent 50 messages and scrolls most recent into view
    database.ref("message-history").orderByChild("timestamp").limitToLast(50).on("child_added", function (snapshot) {
        var messageObj = snapshot.val();
        var newMsg = $("<li>");
        newMsg.addClass("sent");
        var msgTxt = $("<p>");
        //console.log(messageObj);
        msgTxt.text(messageObj.name + ": ");
        $("#msg-box").append(newMsg);
        if (messageObj.api_type === "giphy") {
            msgTxt.append("<img src=" + messageObj.api_result + " alt=giphy" + messageObj.api_query + ">")
        } else if (messageObj.api_type === "trivia") {
            msgTxt.append(messageObj.message);
            var triviaMsg = $("<li>");
            triviaMsg.addClass("sent");
            var triviaTxt = $("<p>");
            var triviaCorrAns = messageObj.api_result[0].correct_answer;
            var triviaAllAns = messageObj.api_result[0].incorrect_answers;
            triviaAllAns.push(triviaCorrAns);
            triviaTxt.append(messageObj.api_result[0].question, "<br>");
            triviaAllAns.forEach((e, i) => { triviaTxt.append(e + "<br>") });
            triviaMsg.append(triviaTxt);
            $("#msg-box").append(triviaMsg);
        } else {
            msgTxt.append(messageObj.message);
        }
        newMsg.append(msgTxt);
        setTimeout(scrollBot, 100);
    });
    function scrollBot() {
        $(".messages").scrollTop($(".messages")[0].scrollHeight);
    }

    // database.ref("giphy/").on("child_added", function (snapshot) {
    //     var giphyURL = snapshot.val();
    //     var newMsg = $("<li>");
    //     var msgTxt = $("<p>");
    //     newMsg.addClass("sent");
    //     //console.log(historySV);
    //     msgTxt.html("<img src='" + giphyURL + "' alt='giphy-image'>");
    //     newMsg.append(msgTxt);
    //     $("#msg-box").append(newMsg);
    //     $("p")[$("p").length - 1].scrollIntoView();
    //     console.log(snapshot.val());
    // });


});
