const generatePara = function(text){
    return `<p>${text}</p>`;
}

const generateToDoListOf = (user)=>{
    let titles = user.getTodoTitles();
    let html = titles.map(title=>{
        return generatePara(title);
    })
    return html.join("<br>");
}

exports.getToDoList = (todoTitle)=>{
    let todo = `<div id="${todoTitle}">
    ${todoTitle}
    <br>
    <div class="${todoTitle}">
    </div>
    <div class="addToDoForm${todoTitle}">
    </div>
    <button id="${todoTitle}" onclick="showToDo(this.id)" name="button">view</button>
    <button id="${todoTitle}" onclick="addToDoList(this.id)" name="button">addItem</button>
    <button id="${todoTitle}" onclick="editToDoList(this.id)" name="button">edit</button>
    <button id="${todoTitle}" onclick="deleteToDoList(this.id)" name="button">delete</button>
    </div>`;
    return todo;
  }

exports.generateToDoListOf = generateToDoListOf;