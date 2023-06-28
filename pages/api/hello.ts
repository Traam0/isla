// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // console.log('cookies',req.headers.cookie?.split('=')[req.headers.cookie?.split('=').indexOf('ATS')+1])
  console.log("=====================")
	console.log(req.cookies);
	console.log("=====================")
	console.log(req.headers.cookie);
	console.log("=====================")
	console.log(getCookie("ATS", { req, res }));
	console.log("=====================")

  res.status(200).json({ name: 'John Doe' })
}


