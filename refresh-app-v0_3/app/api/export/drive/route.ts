
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { getDrive } from '@/lib/drive';

export async function POST(req: NextRequest) {
  try {
    const { title, markdown } = await req.json();

    // Create PDF bytes (reusing same simple layout)
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    const wrap = (text:string, max=90) => text.split('\n').flatMap(line => {
      const words = line.split(' ');
      let out:string[] = [];
      let cur='';
      for (const w of words){
        if ((cur + ' ' + w).trim().length > max) { out.push(cur); cur = w; }
        else cur = (cur ? cur + ' ' : '') + w;
      }
      out.push(cur);
      return out;
    });

    const lines = wrap(`# ${title}\n\n` + markdown, 90);
    let y = height - 50;
    for (const l of lines){
      if (y < 50) { y = height - 50; page = pdfDoc.addPage(); }
      page.drawText(l, { x: 50, y, size: fontSize, font });
      y -= 16;
    }

    const bytes = await pdfDoc.save();

    // Upload to Drive
    const drive = getDrive();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;
    const fileName = `${title.replace(/[^a-z0-9-_]+/gi,'_')}.pdf`;
    const res = await drive.files.create({
      requestBody: { name: fileName, parents: [folderId], mimeType: 'application/pdf' },
      media: { mimeType: 'application/pdf', body: Buffer.from(bytes) as any }
    });
    return NextResponse.json({ ok: true, fileId: res.data.id, fileName });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message }, { status: 400 });
  }
}
