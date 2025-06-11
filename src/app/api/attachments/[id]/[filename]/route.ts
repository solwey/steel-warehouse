import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; filename: string } }
) {
  try {
    const { id, filename } = await params;
    const searchParams = request.nextUrl.searchParams;
    const isResponse = searchParams.get('type') === 'response';

    const filePath = isResponse
      ? path.join(process.cwd(), 'public/eml-attachments', `response-${id}`, filename)
      : path.join(process.cwd(), 'public/eml-attachments', id, filename);

    console.log('Serving file:', filePath);

    const fileBuffer = await fs.readFile(filePath);
    const extension = filename.split('.').pop()?.toLowerCase();

    const contentType =
      extension === 'xlsx' || extension === 'xls'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Error serving attachment:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
