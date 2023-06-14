import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req:NextApiRequest, res:NextApiResponse) {
   const commentId = req.query.commentId

   if(req.method === "DELETE"){
    console.log(Number(commentId))
        const comment = await prisma.comment.delete({
          where:  {id:Number(commentId)}
        })
        res.json(comment)
   }else{
    console.log("Post could not be created")
   }

}