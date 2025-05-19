import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import moment from "moment";
import { encrypt } from "@/lib/useAes256";

export const POST = async (req: Request) => {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  file.name.replaceAll(" ", "_");
  const splitFilename = filename.split('.')
  const timestamp = moment().format('MMmmYYHHDDssSSS') 
  const encryptTimestamp = await encrypt(timestamp)
  const newFileName = 'finance/' + encryptTimestamp  + '.' + splitFilename[splitFilename.length -1]
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/images/" + newFileName),
      buffer
    );
    return NextResponse.json({status: "00", message: "Get Data Succesfully", data:{filename: newFileName}}, {status: 200})
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
