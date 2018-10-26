const express = require("express")
const Clarifai = require("clarifai")
const multer = require("multer")
const pug = require("pug")

const app = express()
const port = 3000

const upload = multer()
const resultsTemplate = pug.compileFile("results.pug")

const clarifai = new Clarifai.App({
  apiKey: "[API KEY GOES HERE]"
})

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname
  })
})

app.post("/upload", upload.single("photo"), (req, res) => {
  const base64String = Buffer.from(req.file.buffer).toString("base64")

  clarifai.models.predict("stickers", base64String).then(
   response => {
      res.send(resultsTemplate({
        concepts: response.outputs[0].data.concepts,
        image: base64String
      }))
    },
    err => {
      console.log(err)
    }
  )
})

app.use(express.static("public"))
app.listen(port, () => console.log(`Running on http://localhost:${port}/`))
