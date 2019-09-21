const btnAdd = document.querySelector('#btn-add')
const inputTodo = document.querySelector('#input-todo')
const ulTodo = document.querySelector('#todoList')
console.assert(inputTodo)

document.addEventListener('DOMContentLoaded', loadTodos)
btnAdd.addEventListener('click', addTodo)
ulTodo.addEventListener('click', clickEachTodo)

function loadTodos () {
  inputTodo.innerHTML = 'aaa'
  fetch('/api/todos')
    .then(function (res) {
      return res.json()
    })
    .then(function (todos) {
      const todosHTML = todos.map(function (todo) {
        return `
        <li id="li-${todo.id}" class="${todo.isComplete ? 'completed' : ''}">
            ${todo.todo}
            <button 
                class="btn-completed ${todo.isComplete ? 'hidden' : ''}" 
                id="btn-completed-${todo.id}"
            >Completed</button>
            <button 
                class="btn-delete" 
                id="btn-delete-${todo.id}"
            >Delete</button>
        </li>`
      })
      ulTodo.innerHTML = todosHTML.join('')
    })
    .catch(function (err) {
      console.log(err)
    })
}

function addTodo () {
  const data = {
    todo: inputTodo.value
  }
  fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then(function (res) {
    if (res.status === 200) {
      loadTodos()
    }
  }).catch(function(err){
      console.error(err)
  })
}

function clickEachTodo(e){
    if (e.target.tagName !== 'BUTTON'){
        return true
    }
    if (e.target.classList.contains('btn-completed')){
        clickCompleted(e.target.id)
        return true
    } 
    if (e.target.classList.contains('btn-delete')){
        clickDelete(e.target.id)
        return true
    }
}

function clickCompleted(idString){
    console.log('completed clicked id:', idString)
    const todoId = getTodoId(idString)
    fetch(`/api/todos/${todoId}`, {
        method: 'PUT'
    }).then(function(response){
        if(response.status === 200){
            loadTodos()
        }
    })
}

function clickDelete(idString){
    console.log('delete clicked id:', idString)
    const todoId = getTodoId(idString)
    fetch(`/api/todos/${todoId}`, {
        method: 'DELETE'
    }).then(function(response){
        if(response.status === 200){
            loadTodos()
        }
    })
}

function getTodoId(idString){
    const idArray = idString.split('-')
    return idArray[idArray.length - 1]
}

