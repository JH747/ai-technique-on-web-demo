import { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { text } = req.body;

  fs.appendFileSync("./speech.txt", "[" + text + "]\n");
  res.status(200).json(text);
};
