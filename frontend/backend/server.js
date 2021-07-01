const express = require('express');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;
const cors = require('cors');

const app = express();
app.use(express.json());
const port = 4001;  

app.use(cors());

app.post('/api/post', (req,res) => {
    let body = req.body; 

    let pythonChild = spawn('python', ['./sample.py',JSON.stringify(body)]);
    console.log("processing")

    pythonChild.stdout.on('data', (data) => {
        console.log(JSON.parse(data.toString()),"data sent on success");
        res.status(200).json(JSON.parse(data.toString()));
    });

    pythonChild.stderr.on('data', (data) => {
        console.log(data.toString(),"data sent on failure");
        // res.status(404).send(data);
    });

    setTimeout(function(){
        res.status(400).send("Some error")
    },body.numberResumes * 5000)

});


const callPythonScript = () => {
    let childPython = spawn('python',['./resumeParse/sample.py','ATS resumes screening']);
            
    childPython.stdout.on('data', data => {
        console.log(data,"Output has been printed from sample.py");
    });

    childPython.stderr.on('data', data => {
        console.log(data,"error from sample.py");
    });

    childPython.on('close', (code) => {
        console.log("sample.py unexpectedly closed on code", code);
    });    
}

app.listen(port, () => {
    console.log("server started")
});


