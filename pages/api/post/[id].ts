import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req:NextApiRequest, res:NextApiResponse) {
   const postId = req.query.id

   if(req.method === "DELETE"){
    console.log(Number(postId))
        const post = await prisma.post.delete({
          where:  {id:Number(postId)}
        })
        res.json(post)
   }else{
    console.log("Post could not be created")
   }

}