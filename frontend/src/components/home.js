import { Component } from 'react';
import $, { contains } from 'jquery'
import InputTag from './input-tag';
const axios = require('axios');
require('dotenv').config();
const nodemailer= require('nodemailer')
class Home extends Component{
    state = {
        numberResumes: 0,
        dirName: null,
        jobFile: null,
        tags: ["Software Development Engineer"],
        isChecked: false,
        limit: null,
        candidates: [],
        loading: false
    }

    handleCallback = (childData) => {
        this.setState({
            ...StaticRange,
            tags: childData
        });
    }

    toggleValue = () => {
        let newValue = $('#checkbox-id').is(':checked') ? true : false;
        $('.mail-templates').toggleClass('d-none');            
        this.setState(state => {
            return {
                ...state,
                isChecked: newValue
            }
        });
    }

    changeDirectory = () => {
        console.log(document.getElementById("input-directory").files[0], "dir path")
        let dirName = document.getElementById("input-directory").files[0].webkitRelativePath.split('/')[0];

        let numberResumes = 0, array = document.getElementById("input-directory").files;
        for (let file of Array.from(array)){
            let fileName = file.name;
            if(fileName.split('.')[1] === "pdf" || fileName.split('.')[1] === "docx")
                numberResumes++;
        };

        this.setState(state => {
            return({
                ...state,
                dirName,
                numberResumes
            });
        })
    }

    getJobFile = () => {
        let jobFile = document.getElementById('job-file').files[0].name;
        this.setState(state => {
            return({
                ...state,
                jobFile
            });
        });
    }

    changeValue = e => {
        this.setState(state => {
            return({
                ...state,
                [e.target.name]: e.target.value
            });            
        });
    }

    renderList = (list) => {
        let candidates = list;
        this.setState(state => {
            return({
                ...state,
                candidates
            });
        });
    }
    sendmail = (email,message) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL, // TODO: your gmail account
                pass: process.env.MAIL_PASS // TODO: your gmail password
            }
        });
    
        let mailOptions = {
            from: 'Automatic Resume Screening', // TODO: email sender
            to: email, // TODO: email receiver
            subject: 'Congratulation!!',
            text: message
        };
    
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                return console.log('Error occurs');
            }
            return console.log('Email sent!!!');
        });
        console.log("email sent to")
        console.log(email)
    }
    


    mailCandidates = (list) => {
        // send first 'limit' candidates success mail
        const pos_message1= 'Hi Candidate \nCongratulations!! \n  Your resume is shortlisted for further round.';
        const normal_message = '\nDo not respond to this mail, It is auto generated \n Thanks for your interest\n';
        const  pos_message = pos_message1+normal_message;
        for (let i = 0; i < this.state.limit; i++) {
            this.sendmail(list[i][3][0],pos_message)
        }
               
        // send the rest failure mail
        const neg_message1 = 'Hi Candidate \nYour resume is not shortlisted for further round.';
        const neg_message = neg_message1+normal_message;
        for (let i = this.state.limit; i < list.length(); i++) {
            this.sendmail(list[i][3][0],neg_message)
        }
    }

    submit = () => {
        // check wheather all inputs are filled
        let s = this.state;
        if(!s.dirName){
            alert('Please choose the Resume folder');
            return;
        }
        if(s.numberResumes === 0){
            alert('Folder contains no relavent resumes');
            return;
        }
        if(!s.limit || s.limit <= 0 || s.limit > s.numberResumes){
            alert('Please Enter the valid limit of Resumes');
            return;
        }
        if(!s.jobFile){
            alert('Please Choose the Job Description');
            return;
        }
        alert("submitted for screening");

        // call the AI model, passing the required data
        
        // set page to be 'loading'
        this.setState(state => {
            return({
                ...state,
                loading: true
            });
        });
        $('.top-tag').toggleClass('d-none');

        // call the APIs to rank resumes
        let reqBody = {
            dirName: this.state.dirName,
            jobFile: this.state.jobFile,
            tags: this.state.tags,
            numberResumes: this.state.numberResumes
        }
        axios.post('http://localhost:4001/api/post',reqBody)
        .then(res => {
            // render the retreived data
            let list = res.data.finalList;
            this.renderList(list);
            this.mailCandidates(list);

            this.setState(state => {
                return({
                    ...state,
                    loading: false
                })
            });
            $('.top-tag').toggleClass('d-none');
        })
        .catch(err => {
            console.log(err);
            this.setState(state => {
                return({
                    ...state,
                    loading: false
                })
            });
            $('.top-tag').toggleClass('d-none');
        })
        
    }
    time_taken = () =>{
        <p class = "text-center">Please wait It will take few seconds...</p>
        if(this.state.limit<=10){
            return 
            <div><p class = "text-center">Please wait It will take few seconds...</p></div>
        }
        else if(this.state.limit<30){
            return <div><p class ="text-center" >Please wait It will take less then 30 seconds...</p></div>
        }
        else if(this.state.limit<60){
            return <div><p class ="text-center" >Please wait It will take less then 1 minute...</p></div>
        }
        else{
            return <div><p class ="text-center" >Please wait It will take few minutes!</p></div>
        }
    }

    render(){
        let listedCandidates = this.state.candidates;
        listedCandidates = listedCandidates.slice(0,this.state.limit);
        listedCandidates = listedCandidates.map((candidate,index) => {
            let href = "file:///C:/WORK/INTERNSHIP/techathon/GEP_Techathon_2021/frontend/userData/" + this.state.dirName + "/" + candidate[0]; 
            return(
                <div key = { index } className = "row">
                    <span class = "col-1">{ index + 1 }</span>
                    <a className = "col-6" href = { href }>{ candidate[0] }</a>
                    <p className = "col-1">{ candidate[1] } Match </p>
                    <p className = "col-4">Email: { candidate[3][0] }</p>
                </div>
            )
        });

        let loadingTag = (
            <div className = "loading">
                <p class = "text-center">SCREENING RESUMES...</p>
                {this.time_taken}
            </div>
        )
        
        return(          
            <div className = "container">
                { this.state.loading ? loadingTag : null }           

                <div className = "top-tag">
                    <div className="card-group">
                        <div className="card m-2">
                            <div className="card-body">
                                <h4 className="card-title">Resume Upload</h4>
                                <p className="card-text">Please Upload the Resumes below</p>
                                <input id = "input-directory" directory="" webkitdirectory="" type="file" onChange = { this.changeDirectory } />
                            </div>
                        </div>
                        <div className="card m-2">
                            <div className="card-body" >
                                <h4 className="card-title">Job Description</h4>
                                <div>
                                    <p className="card-text">
                                        Pick a Job Description file
                                    </p>
                                    <div className="m-1 primary d-inline-block">
                                        <input id = "job-file" type = "file" onChange = { this.getJobFile } />
                                    </div>
                                </div><br/> 
                                <div>
                                    <p className="card-text">
                                        Enter the job tags 
                                    </p>
                                    <div className="m-3">
                                        <InputTag className = "input form-control" parentCallback = { this.handleCallback } />
                                    </div>
                                </div>                                                      
                            </div>
                        </div>
                    </div>

                    <div className="jumbotron">
                        <h1 className="display-3">Hello, HR's</h1>

                        <p className="lead">We're committed to your privacy. Your Resumes are processed securely on our servers and is private to you.</p>
                        <hr className="my-2" />
                        <p>Upload the Resumes,provide the Job Description and then click below</p>
                        <p className="lead">
                            <a className="btn btn-primary btn-md" data-toggle="modal" data-target="#formModal" role="button">Screen Resumes</a>
                        </p>
                    </div>

                    <div className = "card">
                        <div className = "card-body">
                            <div className = "card-title font-weight-bold m-2">
                                SHORTLISTED RESUMES
                            </div>
                            <div className = "card-text">
                                { listedCandidates }
                            </div>
                        </div>
                    </div>

                    <div> 
                        <div className="modal fade" id="formModal" tabindex="-1" role="dialog" aria-labelledby="formModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-md" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className = "text-center modal-title">SCREEN RESUMES</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <h5><span className = "text-bold"> { this.state.numberResumes } </span> resumes have been found</h5><br/>
                                        <div className = "resumeLimitSingle row">
                                            <div className = "col-md-5 col-sm-12">
                                                <label class = "" for = "#limit">RESUME LIMIT</label>
                                            </div>
                                            <div className = "col-md-6 col-sm-12">
                                                <input class = "col-md-6 col-sm-12 input" name = "limit" id = "limit" onChange = { e => this.changeValue(e) } type = "number" />
                                            </div>
                                        </div>

                                        <div className = "mail-templates d-none">
                                            <br/><div className = "mail-success text-left">
                                                <h6>Mail to selected candidates</h6>
                                                <span className = "text-muted mt-2 mb-1">Hello @name,</span>
                                                <textarea className = "form-control text-muted" placeholder = "Mail Body..." row = "10" maxlength = "100">some dummy mail</textarea>
                                            </div>
                                            <br/><div className = "mail-failure text-left">
                                                <h6>Mail to rejected candidates</h6>
                                                <span className = "text-muted mt-2 mb-1">Hello @name,</span>
                                                <textarea className = "form-control text-muted" placeholder = "Mail Body..." row = "10" maxlength = "100">some dummy failure mail</textarea>
                                            </div>
                                        </div>
                                    
                                        <br/><div className = "checkbox">
                                            <div className = "text-justify form-check text-left">   
                                                <input className="form-check-input" type="checkbox" onClick = { this.toggleValue } id="checkbox-id" />                                         
                                                <label className="form-check-label" for="flexCheckDefault">
                                                    Enable automised canditate mailing
                                                </label>                                            
                                            </div>                                        
                                        </div>
                                        
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-success" onClick = { this.submit } data-dismiss="modal">Screen</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Home;