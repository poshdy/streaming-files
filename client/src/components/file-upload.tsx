"use client";
import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState<number>();
  const [uploadedFiles, setUploadedFiles] = useState<number>(0);
  const handleClick = async () => {
    if (files) {
      // we can upload multiple files in parallel by this loop
      // for (let fileIndex = 0; fileIndex < files?.length; fileIndex++) {
      //   const file = files[fileIndex];
      const file = files[0];
      const fileName = Math.random() * 1000 + file.name;
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const ChunkSize = 7000; // 7kb
        const totalChunks = event.loaded / ChunkSize;
        for (
          let chunkNumber = 0;
          chunkNumber < totalChunks + 1;
          chunkNumber++
        ) {
          // slice array buffer bytes to start with 0 * 7000 , 0 * 7000 + 7000 which equals in the first iteration slice(0,7000) and second slice(7000,14000) and so on
          const chunk = event.target?.result?.slice(
            chunkNumber * ChunkSize,
            chunkNumber * ChunkSize + ChunkSize
          ) as ArrayBuffer;
          await uploadChunk(chunk, fileName);
          setProgress(Math.round((chunkNumber * 100) / totalChunks));
        }
        setProgress(0);
        // setUploadedFiles((prev) => prev + 1);
      };
      fileReader.readAsArrayBuffer(file);
      // }
    }
  };
  async function uploadChunk(chunk: ArrayBuffer, fileName: string) {
    await axios.post(
      `http://localhost:4000/file/upload?fileName=${fileName}`,
      chunk,
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": chunk.byteLength,
        },
      }
    );
  }
  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e?.target?.files)}
      />
      <button onClick={handleClick}>upload</button>
      {progress && (
        <div className="flex items-center gap-2 ">
          <progress value={progress} max={100} />
          <span> {progress}%</span>
        </div>
      )}
      {/* {uploadedFiles && <>{uploadedFiles}</>} */}
    </div>
  );
};

export default FileUpload;
