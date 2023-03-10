import crypto from 'crypto'
import multer from 'multer'

import {extname, resolve} from 'path'

export default {
    upload(folder: string){
        return {
            storage: multer.diskStorage({
                destination: resolve(__dirname, '..', '..', folder), //primeiro passo é informar qual será o caminho para salvar os uploads
                filename: (request, file, callback) => {
                    const fileHas = crypto.randomBytes(4).toString('hex')
                    const fileName = `${fileHas}-${file.originalname}`

                    return callback(null, fileName)
                }
            })
        }
    }
}

