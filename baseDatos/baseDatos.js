const fs = require('fs')
const { Router, response, request } = require('express')
const { status } = require('express/lib/response')
const realizaSorteo = require('./sorteo')

const router = Router()

const consultaBBDD = () => {
    archivoBBDD = [
        { participante: 'Padre', suerte: null },
        { participante: 'Madre', suerte: null },
        { participante: 'Maria', suerte: null },
        { participante: 'Santos', suerte: null },
    ]

    if (!fs.existsSync('./baseDatos/baseDatos.json')) {
        let archivoBBDD_Sorteado = realizaSorteo(archivoBBDD)
        fs.writeFileSync('./baseDatos/baseDatos.json', JSON.stringify(archivoBBDD_Sorteado))
        return archivoBBDD_Sorteado
    }

    return JSON.parse(fs.readFileSync('./baseDatos/baseDatos.json', { encoding: 'UTF-8' }))
}

const grabaBBDD = (archivo) => {
    fs.writeFileSync('./baseDatos/baseDatos.json', JSON.stringify(archivo))
}

const borraBBDD = () => {
    fs.rmSync('./baseDatos/baseDatos.json')
}

router.get('/', (req = request, res = response) => {
    const archivoBBDD = consultaBBDD()
    res.json(archivoBBDD)
})

router.post('/', (req = request, res = response) => {
    console.log(req.body)
    grabaBBDD(req.body)

    res.json({ msg: 'todo Ok' })
})

router.post('/borrar', (req, res) => {
    borraBBDD()
    res.json({ msg: 'BBDD borrada' })
})

module.exports = router
