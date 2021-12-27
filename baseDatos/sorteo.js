const realizaSorteo = (archivoBBDD) => {
    let participantes = []

    for (let participante of archivoBBDD) {
        participantes.push(participante.participante)
    }

    function fisher_yates(array) {
        var i = array.length
        while (i--) {
            var j = Math.floor(Math.random() * (i + 1))
            var tmp = array[i]
            array[i] = array[j]
            array[j] = tmp
        }
    }

    fisher_yates(participantes)

    let primero = participantes.slice(0, 2)
    let segundo = participantes.slice(2, 4)

    archivoBBDD = [
        { participante: primero[0], suerte: segundo[1], sorteado: false },
        { participante: primero[1], suerte: segundo[0], sorteado: false },
        { participante: segundo[0], suerte: primero[0], sorteado: false },
        { participante: segundo[1], suerte: primero[1], sorteado: false },
    ]
    return archivoBBDD
}

module.exports = realizaSorteo
