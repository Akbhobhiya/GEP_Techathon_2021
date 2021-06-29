import React from 'react'
import InputTag from './InputTag'
export const Home = () => {
    return (

        <div className="card-group">
            
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Resume Screening</h4>
                    <p className="card-text">Please Upload the Resumes below</p>
                    <input directory="" webkitdirectory="" type="file" />
                </div>
            </div>
            <div className="card">
                <div className="card">
                    <div className="card-body" >
                        <h4 className="card-title">Job Description</h4>
                        <p className="card-text">
                            Enter the Suitable description of Jobs for getting the releavent Resumes
                        </p>
                        <div className="m-1 bg-primary d-inline-block">
                            <InputTag />

                        </div>
                        <button type="button" class="btn btn-primary btn-sm">Submit</button>

                    </div>

                </div>

            </div>
        </div>




    )
}
export const Home2 = () => {
    return (

        <div class="jumbotron">
            <h1 class="display-3">Hello, HR's</h1>

            <p class="lead">We're committed to your privacy. Your Resumes are processed securely on our servers and is private to you.</p>
            <hr class="my-2" />
            <p>Upload the Resumes,provide the Job Description and then click below</p>
            <p class="lead">
                <a class="btn btn-primary btn-lg" href="#!" role="button">Fetch Relevant Resumes</a>
            </p>
        </div>



    )
}
