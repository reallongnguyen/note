import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// DELETE /api/notes/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const noteId = req.query.id

  if (req.method === 'DELETE') {
    const note = await prisma.note.delete({
      where: { id: Number(noteId) },
    })
    res.status(200).json({
      success: true,
      message: 'SUCCESS',
      data: note,
    })

    return
  }

  if (req.method === 'PATCH') {
    const { content } = req.body

    const execArr = /^#\s+(.+?)\s*(\n|$)/.exec(content)
    const title = execArr && execArr[1]

    const note = await prisma.note.update({
      where: { id: Number(noteId) },
      data: {
        title,
        content,
      },
    })

    if (!note) {
      res.status(404).json({
        success: false,
        message: 'NOT_FOUNDED',
      })

      return
    }

    res.status(200).json({
      success: true,
      message: 'SUCCESS',
      data: note,
    })

    return
  }

  if (req.method === 'GET') {
    const note = await prisma.note.findUnique({
      where: { id: Number(noteId) },
    })

    if (!note) {
      res.status(404).json({
        success: false,
        message: 'NOT_FOUNDED',
      })

      return
    }

    res.status(200).json({
      success: true,
      message: 'SUCCESS',
      data: note,
    })

    return
  }

  throw new Error(
    `The HTTP ${req.method} method is not supported at this route.`
  )
}
