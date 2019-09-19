var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))
var todoList = [
  {
    id: 1,
    todo: 'Implement a REST API'
  },
  {
    id: 2,
    todo: 'Cooking..'
  },
  {
    id: 3,
    todo: 'Something Else...'
  }
]

function getNewId () {
  const idArray = todoList.map(function (todo) {
    return todo.id
  })
  idArray.sort((a, b) => b - a)
  if (idArray.length === 0) {
    return 1
  } else {
    return idArray[0] + 1
  }
}

app.use(function (req, res, next) {
  console.log('Someone is accessing to... ', req.url, req.method)
  next()
})
// GET /api/todos
app.get('/api/todos', function (req, res, next) {
  res.send(todoList)
})

// GET /api/todos/:id
app.get('/api/todos/:id', function (req, res, next) {
  console.log('params ...', req.params)
  const theTodo = todoList.find(function (todo) {
    return todo.id === Number(req.params.id)
  })
  if (theTodo) {
    res.send(theTodo)
  } else {
    console.log('ERROR!!!')
    res.status(404).send('')
    // Question : What redirect to display text message. Cannot GET /api/todos/dkfjlks
    next()
  }
})

// POST /api/todos
app.post('/api/todos', function (req, res, next) {
  console.log(req.body)
  console.log(getNewId())
  const newId = req.body.id ? req.body.id : getNewId()
  const obj = {
    id: newId,
    todo: req.body.todo ? req.body.todo : 'Nothing!'
  }
  todoList.push(obj)
  console.log(todoList)
  res.send(String(newId))
})

// PUT /api/todos/:id

app.put('/api/todos/:id', function (req, res, next) {
  // console.log(req.params)
  const result = todoList.some(function (todo, idx, original) {
    if (String(todo.id) === req.params.id) {
      todoList[idx].isComplete = true
      return true
    }
  })
  // console.log(result)
  if (result) {
    const theTodo = todoList.find(function (todo) {
      return String(todo.id) === req.params.id
    })
    // theTodo.isComplete = true
    // console.log(todoList)
    res.send(theTodo)
  } else {
    res.status(404)
    next()
  }
})

// DELETE /api/todos/:id
app.delete('/api/todos/:id', function(req, res, next){
  const result = todoList.some(function(todo, idx, original){
    if (String(todo.id) === req.params.id){
      todoList.splice(idx, 1)
      return true
    }
  })
  if(result){
    res.send('id: ' + req.params.id + ' was deleted.')
    console.log(todoList)
  } else {
    res.status(404)
    next()
  }
})

app.listen(3000, function () {
  console.log('Todo List API is now listening on port 3000...')
})
