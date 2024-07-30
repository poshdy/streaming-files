import { Controller, Post, Query, Req, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { open } from 'fs/promises';
import { Request, Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  async uploadFiles(
    @Req() request: Request,
    @Res() response: Response,
    @Query('fileName') fileName: string,
  ) {
    try {
      // opens the file for appending the file is created if it does not exist.
      const file = await open(fileName, 'a');
      const writeStream = file?.createWriteStream();
      const readStream = request;
      readStream.on('data', (chunk) => {
        // check if it is safe to write to the stream
        if (writeStream.writable) {
          writeStream.write(chunk);
        } else {
          // pausing the data flow until drain event finishes
          request.pause();
        }
      });

      writeStream.on('drain', () => {
        console.log('drained');
        request.resume();
      });
      // close the file after sending the response to prevent memory leaks
      response.on('close', async () => {
        await file.close();
      });
      response.end('uploaded');

      // or instead of the code above we can use pipline method it automatically handles draining for us

      // pipeline(readStream, writeStream, (err) => {
      //   if (err) console.log(err);
      // });
    } catch (error) {
      console.log(error);
    }
  }
}
