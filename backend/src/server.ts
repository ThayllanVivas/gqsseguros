import { router } from './routes';
import express, {Request, Response, NextFunction} from 'express'
import cors from 'cors'
import path from 'path'
import 'express-async-errors';

// --- START ---
const app = express();
const PORT = 3333;

app.use(express.json()); //explicitar que iremos usar o express no formato JSON

app.use(cors()); //permitir que qualquer IP faça requisição

app.use(router); //chama o arquivo routes através da constante 'router'

app.use('/files',
express.static(path.resolve(__dirname, '..', 'tmp')))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof Error) {
        //se for uma instancia do tipo error
        return res.status(400).json({
            error: err.message
        })
    }

    // se não for da instância acima, mas for um erro
    return res.status(500).json({
        status: "error",
        message: 'Internal server error.'
    })
})


app.listen(PORT, () => console.log("Servidor online!!")); //ficar "ouvindo" a porta especificada e avisar que está ativo