function triviaQuestion(amt, cat, diff, type) {
    var fullURL = "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple";
    console.log(fullURL);
}

/*
    https://opentdb.com/api_category.php
    url for trivia categories

    https://opentdb.com/api_count.php?category=CATEGORY_ID_HERE
    url for #questions in a category

    https://opentdb.com/api_count_global.php
    url for global q count





*/

// function apiQuestions() {
//     btn.style.display = 'none'
//     var url = "https://opentdb.com/api.php?amount=1&difficulty=easy";
//     var html = ' '
//     requestAJAX(url, function (data) {
//         console.log(data.results[0]);
//         var obj = data.results[0];
//         html += '<div><div class="cat">' + obj.category + '</div>';
//         html += '<div class="que">' + obj.question + '</div>';
//         html += '</div>'
//         output.innerHTML = html;
//         questionBuilder(obj.correct_answer,obj.incorrect_answers)
//     })

// var btn = document.getElementById('btn');
//         btn.addEventListener('click', nextItem)
//         var answers = {
//             'correct': 0
//             , 'wrong': 0
//         }
//         var output = document.getElementById('output');
//         var selAnswer = document.getElementById('selAnswers')
        
//         }
//         function correctAnswerIs(){
//             var els = document.querySelectorAll('#selAnswers div')
//             for(i = 0; i < els.length; i++){
//                 if(els[i].getAttribute('data-cor')=="true"){
//                     return els[i].innerText
//                 }
//             }
            
//         }
 
//         function sendAnswer(){
//             var res = event.target.getAttribute('data-cor');
//             var correctAnswerValue = correctAnswerIs();
//             btn.style.display = 'block'
//             if(res=='true'){
//                 answers.correct ++;
//                 selAnswer.innerHTML = 'Correct!!! '+correctAnswerValue
            
//             }else{
//                 answers.wrong ++;
//                 selAnswer.innerHTML = 'Maybe next time '+correctAnswerValue
//             }
//             document.getElementById('score').innerHTML = 'Correct '+ answers.correct+' Wrong '+answers.wrong
//         }
        
        
//         function questionBuilder(cor,incor){
//             var holder = incor;
//             holder.push(cor);
//             holder.sort();
            
//             selAnswer.innerHTML = '';
//             for(var i = 0; i < holder.length; i++){
//                 var el = document.createElement('div')
//                 var checker = holder[i] == cor ? true :false;
//                 el.setAttribute('data-cor',checker);
//                 el.innerHTML= holder[i];
//                 el.addEventListener('click',sendAnswer)
//                 selAnswer.appendChild(el);
//             }
//         }
        
        
//         function requestAJAX(url, callback) {
//             var xhr = new XMLHttpRequest();
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState == 4 && xhr.status == 200) {
//                     callback(JSON.parse(xhr.responseText))
//                 }
//             }
//             xhr.open('GET', url, true)
//             xhr.send();
//         }
        