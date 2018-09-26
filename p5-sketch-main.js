const p5Main = new p5((s) => {
    // Create some variables to hold the current best estimate of these values
    // at each step of model training.
    // Assign each of these variables a random number:
    const a = tf.scalar(s.random(-1, 1))
    s.a = tf.variable(a, true)
    a.dispose()
    // s.a.print()

    const b = tf.scalar(s.random(-1, 1))
    s.b = tf.variable(b, true)
    b.dispose()
    // s.b.print()

    const c = tf.scalar(s.random(-1, 1))
    s.c = tf.variable(c, true)
    // s.c.print()
    c.dispose()

    const d = tf.scalar(s.random(-1, 1))
    s.d = tf.variable(d, true)
    // s.d.print()
    d.dispose()

    const e = tf.scalar(s.random(-1, 1))
    s.e = tf.variable(e, true)
    // s.e.print()
    e.dispose()

    const f = tf.scalar(s.random(-1, 1))
    s.f = tf.variable(f, true)
    // s.f.print()
    f.dispose()

    // Constructs a predict function that takes `x` as input and returns `y`:
    s.predict = x => (
        // y = a * x^3 + b * x^2 + c * x + d
        tf.tidy(() => {
            const A = s.a.mul(x.pow(tf.scalar(5))) // a * x^5
            const B = s.b.mul(x.pow(tf.scalar(4))) // + b * x^4
            const C = s.c.mul(x.pow(tf.scalar(3))) // + c * x^3
            const D = s.d.mul(x.square())          // + d * x^2
            const E = s.e.mul(x)                   // + e * x
            const F = s.f                          // + f
            return A.add(B).add(C).add(D).add(E).add(F)
        })
    )

    // Define a MSE loss function as follows:
    // Subtract our labels (actual values) from predictions, square the results,
    // and take the mean.
    s.loss = (predictions, labels) => {
        const meanSquareError = predictions.sub(labels).square().mean()
        return meanSquareError
    }

    // s.optimizer = tf.train.sgd(0.1)
    s.optimizer = tf.train.adam()

    // p5.js setup -------------------------------------------------------------
    s.setup = () => {
        s.createCanvas(500, 500)

        s.xs_data = []
        s.ys_data = []
        for (let i = 0; i <= 1; i += 0.01) {
            s.xs_data.push(i)
            s.ys_data.push(s.map(s.noise(i * 3 + s.frameCount) + s.random(-0.1, 0.1), 0, 1, -0.5, 0.5))
        }
        s.xs = tf.tensor1d(s.xs_data)
        s.ys = tf.tensor1d(s.ys_data)
    }
    // -------------------------------------------------------------------------

    // p5.js draw() ------------------------------------------------------------
    s.draw = async () => {
        const opt = s.optimizer.minimize(
            () => {
                const ys_pred = s.predict(s.xs)
                return s.loss(ys_pred, s.ys)
            },
            true,
            // [s.a, s.b, s.c, s.d, s.e, s.f],
        )
        const opt_data = await opt.data()
        opt.dispose()

        // Use tf.nextFrame to not block the browser.
        await tf.nextFrame()

        const ys_pred = s.predict(s.xs)
        const ys_pred_data = await ys_pred.data()
        ys_pred.dispose()

        s.background(0)
        s.drawGrid()
        s.drawCloud(s.xs_data, s.ys_data)
        s.drawPredCurve(s.xs_data, ys_pred_data)

        if (!(s.frameCount % 100) || s.frameCount === 1) {
            console.log('::: --- --- ---')
            console.log('::: frame:', s.frameCount)
            console.log('::: numTensors:', tf.memory().numTensors)
            console.log('::: MSE:', opt_data[0])
        }

        if (s.frameCount % 2345 === 0) {
            s.xs.dispose()
            s.ys.dispose()
            s.setup()
        }
    }
    // -------------------------------------------------------------------------

    // Private renders ---------------------------------------------------------
    s.drawCloud = (xs, ys) => {
        s.stroke(150, 50, 250)
        s.strokeWeight(6)
        ys.forEach((y, i) => s.point(xs[i] * s.width, s.height / 2 - y * s.height))
    }

    s.drawPredCurve = (xs, ys) => {
        s.beginShape()
        s.stroke(250, 0, 150)
        s.strokeWeight(4)
        s.noFill()
        ys.forEach((y, i) => s.vertex(xs[i] * s.width, s.height / 2 - y * s.height))
        s.endShape()
    }

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
        s.strokeWeight(3)
        const originX = 0
        const originY = s.height / 2
        s.line(originX - s.width / 20, originY, originX + s.width / 20, originY)
        s.line(originX, originY - s.height / 20, originX, originY + s.height / 20)
    }
}, 'p5-main')

window.p5Main = p5Main
