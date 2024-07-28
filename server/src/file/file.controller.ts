import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { FileHandle, open, writeFile } from 'fs/promises';
import { Request, Response } from 'express';
import { appendFileSync, writeFileSync, WriteStream } from 'fs';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  async uploadFiles(
    @Req() request: Request,
    @Res() response: Response,
    @Query('fileName') fileName: string,
  ) {
    let fileHandle: FileHandle, fileStream: WriteStream;
    try {
      request.on('data', async (chunk) => {
        if (!fileHandle) {
          request.pause();
          fileHandle = await open(`${fileName}`, 'a');
          fileStream = fileHandle.createWriteStream({ autoClose: false });
          request.resume();
          fileStream.on('drain', () => {
            request.resume();
          });
        } else {
          if (!fileStream.write(chunk)) {
            request.pause();
          }
        }

        if (!fileStream.write(chunk)) {
          request.pause();
        }
      });

      request.on('end', async () => {
        // await fileHandle.close();
        fileHandle = undefined;
        fileStream = undefined;
        console.log('Connection ended');
        response.end(
          JSON.stringify({ message: 'File was uploaded successfully!' }),
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      if (fileHandle) {
        fileHandle.close();
      }
    }
  }
}
