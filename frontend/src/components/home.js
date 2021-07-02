import { Component } from 'react';
import $ from 'jquery'
import InputTag from './input-tag';
import Loader from "react-loader-spinner";

require('dotenv').config();
const axios = require('axios');



class Home extends Component{
    state = {
        numberResumes: 0,
        dirName: null,
        jobFile: null,
        tags: ["Software Development Engineer"],
        isChecked: false,
        limit: null,
        candidates: [],
        successMail: "Congratulations!! \n  Your resume is shortlisted for further rounds.",
        failureMail: "Your resume is not shortlisted for further rounds.",
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
            if(fileName.split('.')[1] == "pdf" || fileName.split('.')[1] == "docx")
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

    // service: 'gmail'

    
    submit = () => {
        // check wheather all inputs are filled
        let s = this.state;
        if(!s.dirName){
            alert('Please choose the Resume folder');
            return;
        }
        if(s.numberResumes == 0){
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
        console.log("submitted for screening");

        // call the AI model, passing the required data
        
        // set page to be 'loading'
        this.setState(state => {
            return({
                ...state,
                loading: true
            });
        });
        $('.shortlisted-resumes').toggleClass('d-none');

        // call the APIs to rank resumes
        let reqBody = this.state;
        axios.post('http://localhost:4001/api/post',reqBody)
        .then(res => {
            // render the retreived data
            let list = res.data.finalList;
            this.renderList(list);
            console.log(this.state.isChecked,"isChecked")
            

            this.setState(state => {
                return({
                    ...state,
                    loading: false
                })
            });
            $('.shortlisted-resumes').toggleClass('d-none');
        })
        .catch(err => {
            console.log(err);
            this.setState(state => {
                return({
                    ...state,
                    loading: false
                })
            });
            $('.shortlisted-resumes').toggleClass('d-none');
        })
        
    }

    render(){
        let listedCandidates = this.state.candidates;
        listedCandidates = listedCandidates.slice(0,this.state.limit);
        listedCandidates = listedCandidates.map((candidate,index) => {
            let href = "/userData/" + this.state.dirName + "/" + candidate[0]; 
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
               <Loader
                    className = "text-center"
                    type="TailSpin"
                    color="rgb(155, 236, 34)"
                    height={150}
                    width={150}
                />
            </div>
        )
        
        return(          
            <div className = "container">
                          

                <div className = "top-tag">
                    <div className="card-group">
                        <div className="card m-2">
                            <div className="card-body">
                                <h4 className="card-title">Resume Upload</h4>
                                <p className="card-text">Please Upload the Resumes Folder below</p>
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
                        <h1 className="display-3">Hello,</h1>

                        <p className="lead">We're committed to your privacy. Your Resumes are processed securely on our servers and are private to you.</p>
                        <hr className="my-2" />
                        <p>Upload the Resumes,provide the Job Description and then click below</p>
                        <p className="lead">
                            <a className="btn btn-primary btn-md" data-toggle="modal" data-target="#formModal" role="button">Screen Resumes</a>
                        </p>
                    </div>

                    <div>
                        { this.state.loading ? loadingTag : null }  
                        <div className = "card shortlisted-resumes">
                            <div className = "card-body">
                                <div className = "card-title font-weight-bold m-2">
                                    SHORTLISTED RESUMES
                                </div>
                                <div className = "card-text">
                                    { listedCandidates }
                                </div>
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
                                                <span className = "text-muted mt-2 mb-1">Hello candidate,</span>
                                                <textarea className = "form-control text-muted" placeholder = "Mail Body..." row = "10" maxlength = "100">{ this.state.successMail }</textarea>
                                            </div>
                                            <br/><div className = "mail-failure text-left">
                                                <h6>Mail to rejected candidates</h6>
                                                <span className = "text-muted mt-2 mb-1">Hello candidate,</span>
                                                <textarea className = "form-control text-muted" placeholder = "Mail Body..." row = "10" maxlength = "100">{ this.state.failureMail }</textarea>
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