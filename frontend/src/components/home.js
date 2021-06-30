import { Component } from 'react';
import $ from 'jquery'

import InputTag from './input-tag';

class Home extends Component{
    state = {
        numberResumes: 0,
        dirName: null,
        jobInput: true,
        jobFile: null,
        tags: ["Software Development Engineer"],
        isChecked: false,
        limit: null
    }

    handleCallback = (childData) => {
        let jobInput = true;
        if(childData.length == 0)
            jobInput = false;

        this.setState({
            ...StaticRange,
            jobInput,
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
        if(!s.limit || s.limit <= 0){
            alert('Please Enter the valid limit of Resumes');
            return;
        }
        if(!(s.jobFile || s.jobInput)){
            alert('Please Choose the Job Description');
            return;
        }
        alert("submitted for screening");

        // call the AI model passing required data  
        
    }

    render(){
        
        return(          
            <div className = "container">

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
                                    Enter the job tags 
                                </p>
                                <div className="m-3">
                                    <InputTag className = "input form-control" parentCallback = { this.handleCallback } />
                                </div>
                            </div>
                            <span></span>
                            <div>
                                <p className="card-text">
                                    Pick a Job Description file
                                </p>
                                <div className="m-1 primary d-inline-block">
                                    <input id = "job-file" type = "file" onChange = { this.getJobFile } />
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

                <p>Selected Dir is : { this.state.dirName }</p>

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
        )
    }
}

export default Home;