import multer from "multer"
import * as path from "path"
import * as url from "url"
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

console.log(__dirname, __filename)

const diskStorage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, path.join(__dirname, "public", "images"))
    },
    filename: function (request, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

const uploadMiddleware = multer({storage: diskStorage})

export default uploadMiddleware