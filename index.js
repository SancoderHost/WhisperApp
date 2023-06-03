const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const multer = require('multer');
// Configure storage options
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/getfile', (req, res) => {
  const directoryPath = './whisper.cpp/models/';
  const extension = '.bin';

  getFilesWithExtension(directoryPath, extension)
    .then((files) => {
      res.json({ files });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

function getFilesWithExtension(directoryPath, extension) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const filteredFiles = files.filter((file) => {
          const fileExtension = path.extname(file);
          return fileExtension === extension;
        });
        resolve(filteredFiles);
      }
    });
  });
}
// Configure storage options
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle file upload
app.post('/audiofile', upload.single('audioFile'), (req, res) => {
  const fileData = req.file.buffer; // Get the file data from the request
  // Run the exte:wrnal program with file data
  const selectedFile = req.body.selectedFile;
  console.log("selected file is" + selectedFile)
  const command = './whisper.cpp/main';
  const args = ['-f', '-', '-m', './whisper.cpp/models/' + selectedFile]; // Use '-' to represent stdin as the file argument

  // Create a child process
  //const child = spawn(command, args);
  const child = spawn(command, args);
  let commandOutput = '';

  // Pass the file data to the stdin stream of the child process
  child.stdin.write(fileData);
  child.stdin.end();

  // Listen to the output of the external program
  child.stdout.on('data', (data) => {

    commandOutput += data; // Append the output data
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    console.log(commandOutput.toString());
    res.send(commandOutput.toString());

  });

  // Send a response back to the client
});
// ... other routes and middleware

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

