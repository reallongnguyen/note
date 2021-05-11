import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// POST /api/post
// Optional fields in body: title
// Required fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    const { content } = req.body

    const result = await prisma.note.create({
      data: {
        content: content,
      },
    })

    res.status(201).json({
      success: true,
      message: 'SUCCESS',
      data: result,
    })

    return
  }

  if (req.method === 'GET') {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.status(200).json({
      success: true,
      message: 'SUCCESS',
      data: {
        items: notes,
      },
    })

    return
  }

  throw new Error(
    `The HTTP ${req.method} method is not supported at this route.`
  )
}
