let openQuestionformButton = document.getElementById("openQuestionform"); //button
let searchQuestionInput = document.getElementById("searchQuestionInput");
let QuestionsList = document.getElementById("QuestionsList");
let newQuestionSectionDiv = document.getElementById("newQuestionSectionDiv");
let QuestionSubject = document.getElementById("QuestionSubject");
let QuestionBody = document.getElementById("QuestionBody");
let AddQuestionButton = document.getElementById("AddQuestionButton");//button
let SelectedQuestionDiv = document.getElementById("SelectedQuestionDiv");
let RightQuestionSubject = document.getElementById("RightQuestionSubject");
let RightQuestionBody = document.getElementById("RightQuestionBody");
let resolveButton = document.getElementById("resolveButton");//button
let ResponseList = document.getElementById("ResponseList");
let AddResponseName = document.getElementById("AddResponseName");
let AddResponseBody = document.getElementById("AddResponseBody");
let SubmitResponseButton = document.getElementById("SubmitResponseButton");//button
let fetchedData = [];
let idOFSelectedQuestion=-1;
let id=1;
let DiscussionPortalData = [];
    if(localStorage.getItem("dataOfPortal")){
        DiscussionPortalData = JSON.parse(localStorage.getItem("dataOfPortal"));
    }else{
        localStorage.setItem("dataOfPortal",JSON.stringify(DiscussionPortalData));
        
    }

function addNewQuestionToDiscussionPortal(subject,body,response=[]){
    DiscussionPortalData = JSON.parse(localStorage.getItem("dataOfPortal"));
    if(DiscussionPortalData.length==0){
        id=1;
    }else{
        id = DiscussionPortalData[DiscussionPortalData.length-1].id+1;
    }
    DiscussionPortalData.push({subject:subject,body:body,response:response,id:id});
    localStorage.setItem("dataOfPortal",JSON.stringify(DiscussionPortalData));
    id++;
}

function QuestionFormFunctionality(){
    newQuestionSectionDiv.style.display = "block";
    SelectedQuestionDiv.style.display = "none";
    QuestionSubject.value="";
    QuestionBody.value = "";
}


function DisplayQuestionsInList(){
    QuestionsList.innerHTML="";
    DiscussionPortalData = JSON.parse(localStorage.getItem("dataOfPortal"));
    if(!(DiscussionPortalData.length==0)){
        DiscussionPortalData.forEach(function(value){
            let li = document.createElement("li");
            li.id= value.id;
            li.className = "QuestionListClass";
        let h1 = document.createElement("h1");
        h1.id = value.id;
        h1.innerText = value.subject;
        let p = document.createElement("p");
        p.id = value.id;
        p.innerText = value.body;
        li.appendChild(h1);
        li.appendChild(p);
            QuestionsList.appendChild(li);
        });
    }
    document.querySelectorAll(".QuestionListClass").forEach(function(val){
        val.addEventListener("click",OpenSelectedQuestion);
    });
}

function addNewResponse(e){
    e.preventDefault();
    if(fetchedData.length!=0 && idOFSelectedQuestion!=-1){
        DiscussionPortalData = JSON.parse(localStorage.getItem("dataOfPortal"));
        if(!(AddResponseBody.value.toString()==="" || AddResponseName.value.toString()==="")){
            DiscussionPortalData.forEach(function(value){
                if(value.id==fetchedData[0].id){
                    value.response.push({name:AddResponseName.value.toString(),body:AddResponseBody.value.toString()});
                    ResponseList.innerHTML="";
                    value.response.forEach(function(res){
                        let llist = document.createElement("li");
                        llist.innerHTML = "<h3>"+res.name+"</h3><p>"+res.body+"</p>";
                        ResponseList.appendChild(llist);
                    });
                }
            });
            localStorage.setItem("dataOfPortal",JSON.stringify(DiscussionPortalData));
            AddResponseBody.value = "";
            AddResponseName.value="";
        }



    }
    
    
}


function SubmitNewQuestion(event){
    event.preventDefault();
   if(!(QuestionBody.value.toString()==="" || QuestionSubject.value.toString()==="")){
    addNewQuestionToDiscussionPortal(QuestionSubject.value.toString(),QuestionBody.value.toString());
    DisplayQuestionsInList();
   }
    QuestionBody.value="";
    QuestionSubject.value="";
    
} 

function OpenSelectedQuestion(e){
     idOFSelectedQuestion = parseInt(e.target.id);
    // console.log(idOFSelectedQuestion);
    newQuestionSectionDiv.style.display = "none";
    SelectedQuestionDiv.style.display = "block";
    DiscussionPortalData = JSON.parse(localStorage.getItem("dataOfPortal"));
    fetchedData = DiscussionPortalData.filter(function(value){
        return value.id == idOFSelectedQuestion;
    });
    // console.log(fetchedData);
    RightQuestionSubject.innerText = fetchedData[0].subject;
    RightQuestionBody.innerText = fetchedData[0].body;

    if(!(fetchedData[0].response.length==0)){
        ResponseList.innerHTML = "";
        fetchedData[0].response.forEach(function(val){
            let llist = document.createElement("li");
            llist.innerHTML = "<h3>"+val.name+"</h3><p>"+val.body+"</p>";
            ResponseList.appendChild(llist);
        });
    }else{
        ResponseList.innerHTML = "";
    }
}

function resolveCurrentQuestion(){
    if(fetchedData.length!=0 && idOFSelectedQuestion!=-1){
        DiscussionPortalData= JSON.parse(localStorage.getItem("dataOfPortal"));
        var temp = DiscussionPortalData.filter(function(val){
            return val.id != fetchedData[0].id;
        });
        DiscussionPortalData = temp;
        localStorage.setItem("dataOfPortal",JSON.stringify(DiscussionPortalData));
        newQuestionSectionDiv.style.display="block";
        SelectedQuestionDiv.style.display = "none";
        DisplayQuestionsInList();
    }
}


function searchQuestionsByInput(event){
    let inputString = event.target.value.toString();
    if(inputString===""){
        DisplayQuestionsInList();
    }else{
        // QuestionsList.innerHTML = "<li><h1>No Match Found</h1></li>";
        var regex = new RegExp(inputString,'i');
        var flagCheck=-1;
        DiscussionPortalData = JSON.parse(localStorage.getItem("dataOfPortal"));
        QuestionsList.innerHTML="";
        DiscussionPortalData.forEach(function(value){
            if(value.subject.toString().match(regex) || value.body.toString().match(regex)){
                flagCheck=1;
                let li = document.createElement("li");
            li.id= value.id;
            li.className = "QuestionListClass";
        let h1 = document.createElement("h1");
        h1.id = value.id;
        h1.innerText = value.subject;
        let p = document.createElement("p");
        p.id = value.id;
        p.innerText = value.body;
        li.appendChild(h1);
        li.appendChild(p);
            QuestionsList.appendChild(li);

            }
        });
        if(flagCheck==-1){
            QuestionsList.innerHTML = "<li><h1>No Match Found</h1></li>";
        }else{
            document.querySelectorAll(".QuestionListClass").forEach(function(val){
                val.addEventListener("click",OpenSelectedQuestion);
            });
        }
    }
}



openQuestionformButton.addEventListener("click",QuestionFormFunctionality);
AddQuestionButton.addEventListener("click",SubmitNewQuestion);
resolveButton.addEventListener("click",resolveCurrentQuestion);
SubmitResponseButton.addEventListener("click",addNewResponse);
searchQuestionInput.addEventListener("keyup",searchQuestionsByInput);
DisplayQuestionsInList();