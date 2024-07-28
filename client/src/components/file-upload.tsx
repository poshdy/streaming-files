"use client";
import React, { useState } from "react";
import axios from "axios";
type Props = {};

const FileUpload = (props: Props) => {
  const [files, setFiles] = useState<FileList>();
  const [progress, setProgress] = useState<number>();
  const [uploadedFiles, setUploadedFiles] = useState<number>(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target?.files);
    }
  };

  const handleClick = () => {
    if (files) {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        const fileName = Math.random() * 100 + file.name;

        const reader = new FileReader();

        reader.onload = async (event) => {
          const chunkSize = 7000; // 1MB chunks
          const totalSize = event.loaded / chunkSize;
          console.log(event);
          console.log(totalSize);

          for (let chunkId = 0; chunkId < totalSize + 1; chunkId++) {
            const chunk = event.target?.result?.slice(
              chunkId * chunkSize,
              chunkId * chunkSize + chunkSize
            ) as any;
            await axios.post(
              `http://localhost:4000/file/upload?fileName=${fileName}`,
              chunk,
              {
                headers: {
                  "Content-Type": "application/octet-stream",
                  "Content-Length": chunk.length,
                },
              }
            );
            setProgress(Math.round((chunkId * 100) / totalSize));
          }
          setProgress(0);
          setUploadedFiles((prev) => prev + 1);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleChange} />
      <button onClick={handleClick}>upload</button>
      {progress && <div>{progress}%</div>}

      <div>number of files uploaded:{uploadedFiles}</div>
    </div>
  );
};

export default FileUpload;
// if (files) {
//   for (let fileIndex = 0; fileIndex < files?.length; fileIndex++) {
//     const file = files[fileIndex];
//     const fileReader = new FileReader();
//     fileReader.onload = async (event) => {
//       const CHUNK_SIZE = 5000; // 5 kb
//       const chunkCount = event.loaded / CHUNK_SIZE;
//       const fileName = Math.random() * 100 + file.name;
//       for (let chunkId = 0; chunkId < chunkCount + 1; chunkId++) {
//         const chunk = event.target?.result?.slice(
//           chunkId * CHUNK_SIZE,
//           chunkId * CHUNK_SIZE + CHUNK_SIZE
//         );
//         await axios.post(
//           `http://localhost:4000/file/upload?fileName=${fileName}`,
//           chunk,
//           {
//             withCredentials: true,
//             headers: {
//               // "Content-Disposition": `attachment; filename=${fileName}`,
//               "Content-Type": "",
//             },
//           }
//         );

//         setProgress(Math.round((chunkId * 100) / chunkCount));
//       }
//       setProgress(0);
//       setUploadedFiles((prev) => prev + 1);
//     };
//     fileReader.readAsArrayBuffer(file);
//   }
// }
