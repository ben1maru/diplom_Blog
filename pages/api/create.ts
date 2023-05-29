import { prisma } from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const{title,content,imageLink} =req.body

    try{
        await prisma.post.create({
            data:{
                title,
                content,
                imageLink
            }
        })
        res.status(200).json({message:'Пост додано'})
    }catch(error){
            console.log('помилка')
    }
}