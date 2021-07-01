import { spawn } from 'child_process'

const childPython = spawn('python',['./test.py','ATS resumes screening']);
        
childPython.stdout.on('data', data => {
    console.log($(data),"Output has been printed from sample.py");
});

childPython.stderr.on('data', data => {
    console.log($(data),"error from sample.py");
});

childPython.on('close', (code) => {
    console.log("sample.py unexpectedly closed on code", $(code));
});       