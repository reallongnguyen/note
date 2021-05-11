import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

// DELETE /api/notes/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const keyword = String(req.query.keyword)

  if (req.method === 'GET') {
    const result = await prisma.note.findMany({
      where: {
        title: { contains: keyword },
      },
    })

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'NOT_FOUNDED',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'SUCCESS',
      data: {
        items: result,
      },
    })

    return
  }

  throw new Error(
    `The HTTP ${req.method} method is not supported at this route.`
  )
}
