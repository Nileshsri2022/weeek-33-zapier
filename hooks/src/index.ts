import  express  from "express";
const app = express();
import {PrismaClient} from "@prisma/client";
const client = new PrismaClient();
// https://hooks.zapier.com/hooks/catch/22100415/2lqt8c7/
// password logic

app.use(express.json())
app.post("/hooks/catch/:userId/:zapId",async(req,res)=>{
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;
  // store in db a new trigger
  await client.$transaction(async tx =>{
    const run = await tx.zapRun.create({
      data:{
        zapId:zapId,
        metadata:body
      }
    });

    await tx.zapRunOutbox.create({
      data:{
        zapRunId:run.id
      }
    })
  })

  // push it onto a queue(kafka/redis)
  res.json({
    message:"webhook recieved"
  })

})
app.listen(3002)