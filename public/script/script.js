const $containerBotones = document.querySelector('#container-botones')
const $todosBotones = document.querySelectorAll('.boton')
const $containerBotonSorteo = document.querySelector('#container-boton-sorteo')
const $resultado = document.querySelector('#resultado')

//-------------------------
let archivoBBDD = []
let jugador
//-------------------------
const seleccionarJugador = (e) => {
    let $boton = e.target
    if ($boton.classList.contains('bloqueo')) return
    jugador = $boton.textContent
    $boton.classList.toggle('boton-pulsado')
    for (let boton of $todosBotones) {
        if (boton != $boton) boton.classList.remove('boton-pulsado')
    }
    //Gestión de la visibilidad o no del botón del boton de sorteo
    for (let boton of $todosBotones) {
        if (boton.classList.contains('boton-pulsado')) {
            $containerBotonSorteo.classList.add('boton-isActive')
            break
        }
        $containerBotonSorteo.classList.remove('boton-isActive')
    }
}
const encuentraAgraciado = (jugador) => {
    let [{ suerte }] = archivoBBDD.filter((e) => e.participante === jugador)
    return suerte
}
const modificaArchivoBBD = (jugador) => {
    archivoBBDD = archivoBBDD.map((e) => {
        if (e.participante === jugador) {
            e.sorteado = true
            return e
        } else {
            return e
        }
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    //Carga archivo de la base de datos desde el servidor
    const { data } = await axios.get('/api')
    archivoBBDD = data
    //Marca como bloqueado los botones de los jugadores que ya han participado
    archivoBBDD.forEach((element) => {
        if (element.sorteado) {
            $todosBotones.forEach((e) => {
                if (e.textContent == element.participante) {
                    let $botonAnular = e
                    $botonAnular.classList.add('bloqueo')
                }
            })
        }
    })
    //Lógica que hace reiniciar la base de datos si todos los botones se encuentran bloqueados
    let reiniciar = 1

    $todosBotones.forEach((boton) => {
        if (
            !boton.classList.contains('bloqueo') &&
            boton != $containerBotonSorteo.firstElementChild
        ) {
            reiniciar = 0
        }
    })
    if (reiniciar === 1) {
        $resultado.classList.add('resultado-isActive')
        setTimeout(() => {
            $resultado.innerHTML = `<span>Gracias</span>`
        }, 2200)
        $resultado.addEventListener('click', async (e) => {
            const res = await axios.post('/api/borrar', {})
            console.log(res.data)
            window.location.reload()
        })
    }
})

$containerBotones.addEventListener('click', seleccionarJugador)

$containerBotonSorteo.addEventListener('click', async (e) => {
    $containerBotonSorteo.firstElementChild.classList.add('boton-pulsado')
    $containerBotones.removeEventListener('click', seleccionarJugador)

    let agraciado = encuentraAgraciado(jugador)

    modificaArchivoBBD(jugador)

    const res = await axios.post('/api', archivoBBDD)
    console.log(res.data)

    $resultado.classList.add('resultado-isActive')
    setTimeout(() => {
        $resultado.innerHTML = `<span>${agraciado}</span>`
    }, 2200)
    $resultado.addEventListener('click', (e) => {
        window.location.reload()
    })
})
