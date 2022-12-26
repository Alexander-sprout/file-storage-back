const express = require('express')
const multer = require('multer')
const { promises } = require('fs')
// Подключение моделей
const { File, Folder } = require('./model')

const router = express.Router()

// MIDDLEWARE для загрузки файла
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/')
    },
    filename: function (req, file, cb) {
        const fileName = `${Math.random().toString(36).substr(2, 9)}${Date.now()}`
        cb(null, 'userpic-' + fileName + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
})
const upload = multer({ storage })


// Настройки роутов

// CRUD Folder
// CREATE READ UPDATE DELETE
/*
 В Теле запроса передавать folderName: string,
*/
router.post('/folder', async (request, response) => {
    await Folder.create({ name: request.body.folderName });
    response.send('Директория создана!')
})


router.delete('/folder/:ZZZ', async (request, response) => {
    await Folder.destroy({
        where: { id: request.params.ZZZ },
    });
    response.send('Удалено успешно')
})

router.get('/folder', async (request, response) => {
    const folders = await Folder.findAll()
    response.json(folders)
})

// CRUD Файлы

router.get('/folder/:id', async (requset, response) => {
    const files = await File.findAll({
        where: {
            folderId: requset.params.id
        }
    })
    response.json(files)
})

router.post('/folder/:id',
    upload.single('file'),
    async (request, response) => {
        console.log(request.file)
        const file = await File.create({
            filename: request.file.filename,
            size: request.file.size,
            FolderId: request.params.id
        })
        response.send('Файл отправлен')
    },
)

router.delete('/file/:fileid', async (request, response) => {
    const file = await File.findOne({
        where: {
            id: request.params.fileid
        }
    })
    if (!file) {
        response.status(404).send("Файл не найден")
        return;
    }
    // Удаление файла физически по пути
    try {
        await promises.rm(__dirname + '/files/' + file.filename)
    } catch (err) {
        console.error('Файла физически нет , сорь')
    }
    await File.destroy({
        where: {
            id: request.params.fileid
        }
    })
    response.send('Файл удален')
})



router.get('/:filename', (request, response) => {
    response.sendFile(__dirname + '/files/' + request.params.filename)
})


module.exports = router