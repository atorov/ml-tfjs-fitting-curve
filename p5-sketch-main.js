const p5Main = new p5((s) => {
  s.setup = () => {
    s.createCanvas(500, 500)
  }

  s.draw = () => {
    s.background(0)
    s.drawGrid()
  }

  // Private renders -----------------------------------------------------------
  s.drawGrid = () => {
    s.stroke(255, 63)
    s.strokeWeight(1)
    for (let y = 0; y < s.height; y += s.height / 10) {
      s.line(0, y, s.width, y)
    }

    s.stroke(255, 31)
    for (let y = s.height / 20; y < s.height; y += s.height / 10) {
      s.line(0, y, s.width, y)
    }

    s.stroke(255, 63)
    for (let x = 0; x < s.height; x += s.height / 10) {
      s.line(x, 0, x, s.height)
    }

    s.stroke(255, 31)
    for (let x = s.height / 20; x < s.height; x += s.height / 10) {
      s.line(x, 0, x, s.height)
    }

    s.stroke(255, 127)
    s.strokeWeight(2)
    s.line(s.width / 2 - s.width / 20, s.height / 2, s.width / 2 + s.width / 20, s.height / 2)
    s.line(s.width / 2, s.height / 2 - s.height / 20, s.width / 2, s.height / 2 + s.height / 20)
  }
}, 'p5-main')

window.p5Main = p5Main
