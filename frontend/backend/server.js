const express = require('express');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;
const cors = require('cors');
const nodemailer= require('nodemailer')

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

        console.log(body.isChecked)
        let list = (JSON.parse(data.toString())).finalList;
        if(body.isChecked)
            mailCandidates(list,body);

        res.status(200).json(JSON.parse(data.toString()));
    });

    pythonChild.stderr.on('data', (data) => {
        console.log(data.toString(),"data sent on failure");
        // res.status(404).send(data);
    });

});

   
sendmail = (email,message) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mudassirakhil@gmail.com', // TODO: your gmail account
            pass: 'akhil.aalu' // TODO: your gmail password
        }
    });

    let mailOptions = {
        from: 'mudassirakhil@gmail.com', // TODO: email sender
        to: email, // TODO: email receiver
        subject: 'GEP JOBS -- for testing of ATS',
        text: message
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('Error occured while sending mail');
        }
        return console.log('Email sent!!!');
    });
    console.log("email sent to")
    console.log(email)
}

mailCandidates = (list,body) => {
    // send first 'limit' candidates success mail
    const pos_message1= "Hi candidate,\n" + body.successMail;
    const normal_message = '\n\nDo not respond to this mail, It is auto generated \n\n Thanks for your interest\n';
    const  pos_message = pos_message1+normal_message;
    for (let i = 0; i < body.limit; i++) {
        sendmail(list[i][3][0],pos_message)
    }
           
    // send the rest failure mail
    const neg_message1 = "Hi candidate,\n" + body.failureMail;
    const neg_message = neg_message1+normal_message;
    for (let i = body.limit; i < list.length; i++) {
        sendmail(list[i][3][0],neg_message)
    }

    console.log('mails sent')
}


app.listen(port, () => {
    console.log("server started")
});


