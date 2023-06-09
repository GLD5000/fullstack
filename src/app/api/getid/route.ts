import prisma from "@/lib/prisma";
// PUBLISH /api/publish/:id
/* eslint-disable import/prefer-default-export */

async function handler(req: Request) {
  const postId = `${req.json()}`;

  const result = await prisma.post.findFirst({
    where: { id: postId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return new Response(JSON.stringify(result));
}

export { handler as GET };
