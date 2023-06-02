import './style.css'
import Editor from './Editor'

/* Obtem os elementos DOM dos dois canvas sobrepostos */
const canvas = <HTMLCanvasElement> document.getElementById("editor-canvas")
const bg = <HTMLCanvasElement> document.getElementById("editor-background")

const editor = new Editor("teste", canvas, bg, 0.75, 0.8)
let lineId = editor.line(0, 0, 300, 400)
editor.text("Olá mundo", 500, 200, "32px sans-serif")

addEventListener("load", () => {
    editor.resize()
    editor.update()
})

/* Atualizar tamanho do canvas caso tamanho do navegador se altere */
addEventListener("resize", () => {
    editor.resize()
})

addEventListener("mousemove", ({clientX, clientY}) => {
    editor.setMousePosition(clientX, clientY)
})

canvas.addEventListener("click", () => {
    // var rect = canvas.getBoundingClientRect()
    // editor.node(clientX - rect.top, clientY - rect.left)
    editor.onclick()
})

addEventListener('keypress', () => {
    editor.node()
})