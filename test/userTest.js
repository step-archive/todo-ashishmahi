const User = require('../lib/user.js');
const ToDoList = require('../lib/todoList.js');
const chai = require('chai');
const assert = chai.assert;

describe('user', () => {
  describe('todoList', () => {
    it('should edit title of existing todo ', () => {
      let user = new User("ashish");
      let newTodo = new ToDoList("at Home", "some home stuffs")
      user.addTodo("at Home", "some home stuffs");
      user.editTitleOf("at Home", "at Office");
      let todos = user.todos["at Home"];
      assert.notInclude(user.todos, newTodo);
    });
    it('should add a todo to users existing todos', () => {
      let user = new User("ashish");
      let newTodo = new ToDoList("at Home", "some home stuff")
      user.addTodo("at Home", "some home stuff");
      assert.include(user.getTodoTitles(), "at Home");
    });
    it('should remove a todolist from users list of todos ', () => {
      let user = new User("ashish");
      let newTodo = new ToDoList("at Home", "some home stuffs")
      user.addTodo("at Home", "some home stuffs");
      assert.include(user.getTodoTitles(), "at Home");
      user.removeTodo("at Home");
      assert.notInclude(user.getTodoTitles(), "at Home");
    });
    it('should get all titles todo list of user', () => {
      let user = new User("ashish");
      user.addTodo("at Home", "some home stuffs");
      user.addTodo("at Office", "some more home stuffs");
      user.addTodo("at PG", "some less home stuffs");
      let allToDos = ["at Home", "at Office", "at PG"];
      assert.deepEqual(user.getTodoTitles(), allToDos);
    });
    it('should get all items of a todo list', () => {
      let user = new User("ashish");
      user.addTodo("at Home", "some home stuffs");
      user.addTodoItem("do", "at Home");
      user.addTodoItem("dont do", "at Home");
      let allToDoItem = ["do", "dont do"];
      assert.deepEqual(user.getToDoItemsTextOf("at Home"), allToDoItem);
    });
    it('should edit text of todoItem', () => {
      let user = new User("ashish");
      user.addTodo("at Home", "some home stuffs");
      user.addTodoItem("do", "at Home");
      user.editTodoItemText("do","dont","at Home");
      assert.notInclude(user.getToDoItemsTextOf("at Home"),"do");
      assert.include(user.getToDoItemsTextOf("at Home"), "dont");
    });
  });
  describe('toDoItem', () => {
    it('should remove a todoitem of a todo list', () => {
      let user = new User("ashish");
      user.addTodo("at Home", "some home stuffs");
      user.addTodoItem("do", "at Home");
      user.addTodoItem("dont do", "at Home");
      user.removeTodoItem("do", "at Home");
      assert.notInclude(user.getToDoItemsOf("at Home"), "do");
    });
    it('should mark a item as done', () => {
      let user = new User("ashish");
      user.addTodo("at Home", "some home stuffs");
      user.addTodoItem("do", "at Home");
      user.markAsDone("at Home","do");
      assert.isOk(user.isDone("at Home","do"));
    });
    it('should mark any item as undone', () => {
      let user = new User("ashish");
      user.addTodo("at Home", "some home stuffs");
      user.addTodoItem("do", "at Home");
      user.markAsNotDone("at Home", "do");
      assert.isNotOk(user.isDone("at Home", "do"));
    });
  });
});
