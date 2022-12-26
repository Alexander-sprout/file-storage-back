// Подключение библиотек 
const express = require('express')
const Router = require('./controller')
const bodyParser = require('body-parser')

// Инстанс приложения
const app = express()

// Additional Middlewares
app.use(bodyParser.json())
app.use('/api', Router)

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер успешно запущен')
})