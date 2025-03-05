//  const { exec } = require("child_process");
//   const fs = require("fs");
//   const path = require("path");
  
//   const outputPath = path.join(__dirname, "outputs");
  
//   if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, { recursive: true });
//   }
  
//   const executeCpp = (filepath, input) => {
//       const jobId = path.basename(filepath).split(".")[0];
//       const outPath = path.join(outputPath, `${jobId}.exe`); // Windows executable (.exe)
  
//       return new Promise((resolve, reject) => {
//           const process = exec(
//               `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && "${jobId}.exe"`,
//               (error, stdout, stderr) => {
//                   if (error) {
//                       reject({ error, stderr });
//                   } else if (stderr) {
//                       reject(stderr);
//                   } else {
//                       resolve(stdout);
//                   }
//               }
//           );
  
       
//           if (input) {
//               process.stdin.write(input + '\n');  
//           }
  
//           process.stdin.end();  
  
//           process.on('exit', () => {
            
//               setTimeout(() => {
//                   try {
                    
//                       if (fs.existsSync(filepath)) fs.unlinkSync(filepath);  
//                       if (fs.existsSync(outPath)) fs.unlinkSync(outPath);  
//              ;
//                   } catch (cleanupError) {
//                       console.error("Error cleaning up files:", cleanupError);
//                   }
//               }, 2000);  
//           });
//       });
//   };
  
//   module.exports = {
//     executeCpp,
//   };
// const { exec, execFile } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const outputPath = path.join(__dirname, "outputs");

// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath, { recursive: true });
// }

// const executeCpp = (filepath, input) => {
//   return new Promise((resolve, reject) => {
//     const jobId = path.basename(filepath).split(".")[0];
//     const outPath = path.join(outputPath, `${jobId}.exe`); // Windows executable (.exe)

//     exec(`g++ "${filepath}" -o "${outPath}"`, (compileError, _, compileStderr) => {
//       if (compileError) {
//         return reject({ error: "Compilation error", stderr: compileStderr });
//       }

//       const process = execFile(outPath, { timeout: 2000 }, (error, stdout, stderr) => {
     
        
//         if (error) {
//           if (error.killed) {
           
            
//             return reject({ error: "Execution timed out. Possible infinite loop." });
//           }
//           return reject({ error, stderr });
//         }
//         if (stderr) {
//           return reject(stderr);
//         }
//         resolve(stdout);
//       });

//       if (input) {
//         process.stdin.write(input + '\n');
//       }
//       process.stdin.end();

//       process.on("exit", () => {
//         setTimeout(() => {
//           try {
//             if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
//             if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
//           } catch (cleanupError) {
//             console.error("Error cleaning up files:", cleanupError);
//           }
//         }, 2000);
//       });
//     });
//   });
// };

// module.exports = { executeCpp };
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, input) => {
  return new Promise((resolve, reject) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);

    // Compile the C++ file
    const compileProcess = spawn('g++', [filepath, '-o', outPath]);

    compileProcess.stderr.on('data', (data) => {
      reject({ error: "Compilation error", stderr: data.toString() });
    });

    compileProcess.on('close', (code) => {
      if (code !== 0) {
        return reject({ error: "Compilation failed" });
      }

      // Execute the compiled program with resource limits
      const executeProcess = spawn(outPath, [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 2000, // 2 seconds timeout
        env: {
          ...process.env,
          RLIMIT_CPU: "1", // 1 second CPU time limit
          RLIMIT_AS: "50000000", // 50MB memory limit
          RLIMIT_FSIZE: "10000000", // 10MB file size limit
        }
      });

      let stdout = '';
      let stderr = '';

      executeProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      executeProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      if (input) {
        executeProcess.stdin.write(input + '\n');
        executeProcess.stdin.end();
      }

      executeProcess.on('close', (code) => {
        if (code !== 0) {
          reject({ error: "Execution failed", stderr });
        } else {
          resolve(stdout);
        }

        // Clean up files
        setTimeout(() => {
          try {
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
            if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
          } catch (cleanupError) {
            console.error("Error cleaning up files:", cleanupError);
          }a
        }, 2000);
      });

      executeProcess.on('error', (error) => {
        if (error.code === 'ETIMEDOUT') {
          reject({ error: "Execution timed out. Possible infinite loop." });
        } else {
          reject({ error: error.messge });
        }
      });
    });
  });
};

module.exports = { executeCpp };
