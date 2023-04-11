import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/bands", async (req: Request, res: Response) => {
    try {
        
        const result = await db.raw(`
        SELECT * FROM bands;
        `)
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
    }
});

app.post("/bands", async (req: Request, res: Response) => {
    try {
        
        const id = req.body.id as string
        const name: string = req.body.name

        if(!id || !name){
            res.status(400)
            throw new Error("Dados inválidos")
        }
        
        if(name.length < 3){
            res.status(400)
            throw new Error("Nome muito curto, use mais de 3 caracteres")
        }
        await db.raw(`
        INSERT INTO bands(id, name) VALUES
        ("${id}", "${name}");
        `)
        res.status(200).send({message: "banda criada"})
    } catch (error) {
        console.log(error)

        // if (req.statusCode === 200) {
        //     res.status(500)
        // }

        // if (error instanceof Error) {
        //     res.send(error.message)
        // } else {
        //     res.send("Erro inesperado")
        // }
    }
})

app.put("/bands/:id", async (req: Request, res: Response) => {
    try {
        const id:string= req.params.id
        const name: string = req.body.name

        if(!id){
            res.status(400)
            throw new Error("Id inválidos")
        }
        if(!name){
            res.status(400)
            throw new Error("Name inválidos")
        }
        if(name.length < 3){
            res.status(400)
            throw new Error("Nome muito curto")
        }
        const [band] = await db.raw(`
        SELECT * FROM bands
        WHERE id = "${id}";
        `)
        // band[0]
        if(!band){
            res.status(404)
            throw new Error("Banda não encontrada")
        }
        await db.raw(`
        UPDATE bands
        SET name = "${name}"
        WHERE id = "${id}";     
        `)
        res.status(200).send({message: "banda alterada"})
    } catch (error) {
        console.log(error)

        // if (req.statusCode === 200) {
        //     res.status(500)
        // }

        // if (error instanceof Error) {
        //     res.send(error.message)
        // } else {
        //     res.send("Erro inesperado")
        // }
    }
})
