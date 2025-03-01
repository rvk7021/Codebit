 const { exec } = require("child_process");
  const fs = require("fs");
  const path = require("path");
  
  const outputPath = path.join(__dirname, "outputs");
  
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  const executeCpp = (filepath, input) => {
      const jobId = path.basename(filepath).split(".")[0];
      const outPath = path.join(outputPath, `${jobId}.exe`); // Windows executable (.exe)
  
      return new Promise((resolve, reject) => {
          const process = exec(
              `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && "${jobId}.exe"`,
              (error, stdout, stderr) => {
                  if (error) {
                      reject({ error, stderr });
                  } else if (stderr) {
                      reject(stderr);
                  } else {
                      resolve(stdout);
                  }
              }
          );
  
       
          if (input) {
              process.stdin.write(input + '\n');  
          }
  
          process.stdin.end();  
  
          process.on('exit', () => {
            
              setTimeout(() => {
                  try {
                    
                      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);  
                      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);  
             ;
                  } catch (cleanupError) {
                      console.error("Error cleaning up files:", cleanupError);
                  }
              }, 2000);  
          });
      });
  };
  
  module.exports = {
    executeCpp,
  };
  