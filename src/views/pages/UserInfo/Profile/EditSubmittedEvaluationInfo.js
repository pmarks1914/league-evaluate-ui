import React, { useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Label, ButtonGroup, Badge } from 'reactstrap'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
    CButton,
    CCardGroup,
    CContainer
} from '@coreui/react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import axios from "axios"
import CIcon from '@coreui/icons-react'; import {
    // cilBell,
    cilCreditCard,
    cilUser,
    cilTask,
    cilEnvelopeOpen,
    // cilFile,
    cilInfo,
    cilCloudDownload,
    cilLockLocked,
    // cilSettings,
    cilWarning,
    cilFilter, cilCheckCircle, cilSettings, cilCalendar, cilSearch,
} from '@coreui/icons'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import Swal from 'sweetalert2';

import 'antd/dist/antd.min.css';

import { message, Upload } from 'antd';

import $ from 'jquery';
import Select, { components } from 'react-select';
import PropTypes, { func } from "prop-types";
import { getSessionTimeout } from '../../../../Utils/Utils';
import moment from 'moment';

let date = new Date();

let evaluation_id = window.location.pathname.split('/')[2];
let countState = 1
const userData = JSON.parse(localStorage.getItem('userDataStore'));

// console.log(userData)
const EditSubmittedEvaluationInfo = (props) => {

    const [getFormDataError, setGetFormDataError] = React.useState({
        "first_name": false,
        "last_name": false,
        "other_name": false,
        "country": false,
        "email": false,
        "phone": false,
        "photo": false,
        "dateOfBirth": false,
        "certificateDate": false,
        "certificate_name": false,
        "transcript_name": false
    })
    const [evaluationData, setEvaluationData] = useState({});

    const [getFormData, setGetFormData] = React.useState({})
    // profile photo loading
    const [uploading, setUploading] = useState(false);
    // console.log(props?.profileManage)
    // certificate    
    const [profileCertificate, setProfileCertificate] = useState(evaluationData?.evaluation_info?.certificate)

    const [certificateList, setCertificateList] = useState([]);
    const [certificate, setCertificate] = useState([]);
    // profile Certificate loading
    const [editorContent, setEditorContent] = useState("");


    useEffect(() => {
        //   getSessionTimeout();
        passConfiguration("get", "get", "address", 419)
    }, [])
    const [familyData, setFamilyData] = useState(null)

    useEffect(() => {
        countState += 1;
        if (countState < 4) {
            // getDataInfo()
        }
        // console.log("familyData", countState)
    }, [])
    useEffect(() => {
        getFuncEvaluation()
    }, [])
    // console.log("evaluationData ", JSON.stringify(evaluationData))
    const handleEditorChange = (content, delta, source, editor) => {
        setEditorContent(content);
    };

    function getFuncEvaluation() {
        // 
        let config = {
            method: 'get',
            url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userData?.token
            },
            data: {}
        };

        axios(config).then(response => {
            //   console.log("data getApplication data api ==", response);

            if (response.status === 200) {
                console.log("data source sch ====", response?.data);
                if (response?.data?.data) {
                    setEvaluationData(response?.data?.data)
                }

            }


        }).catch(function (error) {

            if (error.response) {
                // // console.log("==");
                /*
                * The request was made and the server responded with a
                * status code that falls out of the range of 2xx
                */

            } else if (error.request) {
                /*
                * The request was made but no response was received, `error.request`
                * is an instance of XMLHttpRequest in the browser and an instance
                * of http.ClientRequest in Node.js
                */

            } else {
                // Something happened in setting up the request and triggered an Error

            }
        }
        );
    }

    const props2 = {
        onRemove: (file) => {
            const index = certificateList?.indexOf(file);
            const newFileList = certificateList?.slice();
            newFileList?.splice(index, 1);
            setCertificateList(newFileList);
        },
        beforeUpload: (file) => {
            setCertificateList([file]);
            return false;
        },
        certificateList,
    };

    // certificate Transcript others
    const handleCertificateUpload = (fileType) => {
        setUploading(true)
        const formData2 = new FormData();
        formData2.append('type', fileType);
        for (const key in getFormData) {
            if (getFormData.hasOwnProperty(key)) {
                formData2.append(key, getFormData[key]);
            }
        }
        // formData2.append('slug', getFormData?.certificate_name);

        if (fileType === 1) {
            formData2.append('slug', getFormData?.certificate_name);
        }
        if (fileType === 2) {
            formData2.append('slug', getFormData?.transcript_name);
        }
        if (fileType === 3) {
            formData2.append('slug', getFormData?.identification_name);
        }
        console.log(" >>>>>>>", certificateList)
        if (certificateList?.length > 0) {
            certificateList?.forEach((cert) => {

                // console.log(cert)
                formData2.append('cert', cert);
                formData2.append('evaluation_id', evaluation_id);
                // console.log("rtghrghhrthrhrthrthrthrtrtrtgrt", getFormData, formData2)

                let config = {
                    method: 'PATCH',
                    url: process.env.REACT_APP_BASE_API + '/upload',
                    headers: {
                        "Authorization": `Bearer ${userData?.token}`,

                    },
                    data: formData2
                };
                // console.log(cert.type)
                if (cert.type === 'image/png' || cert.type === 'image/jpg' || cert.type === 'image/jpeg' || cert.type === 'application/pdf') {
                    axios(config).then(function (response) {

                        // console.log(response.status)
                        if (response.data.code === 200) {
                            toast.success(response?.data.message || "Successful", {
                                position: toast?.POSITION?.TOP_CENTER
                            });
                            setUploading(false)
                            getFuncEvaluation()

                        }
                        else {
                            toast.error(response?.data.message || "Failed", {
                                position: toast?.POSITION?.TOP_CENTER
                            });
                            setUploading(false)
                        }

                    })
                        .catch(function (error) {

                            toast.error(error?.response?.data.message, {
                                position: toast?.POSITION?.TOP_CENTER
                            });
                            setUploading(false)

                            // console.log(error);
                        });
                }
                else {
                    //
                    toast.error('Unsupported file type.', {
                        position: toast?.POSITION?.TOP_CENTER
                    });
                    setUploading(false)
                }
            });
        }
        else {
            toast.error('No file selected.', {
                position: toast?.POSITION?.TOP_CENTER
            });
            setUploading(false)
        }
    };
    // generic method
    function genericApiCall(config, section) {
        // 
        axios(config).then(response => {
            // console.log(response.data);

            toast.success(response?.data?.message, {
                position: toast?.POSITION?.TOP_CENTER
            });
            // if (response?.data?.status === true) {
            // if(section === "address"){
            //   setGetFormData({...getFormData, ...{ "address": "", "street_name": "", "town": "", "city": "", "country": "", "code": "", "lon": "", "lat": "", "primary_first_name": "", "primary_other_name": "", "primary_last_name": "", "spouce_first_name": "", "spouce_last_name": "", "spouce_other_name": "", "sibling_first_name": "", "sibling_last_name": "" }})
            // }

            // }
            getFuncEvaluation()

        }).catch(function (error) {

            if (error.response) {
                // // console.log("==>");

                toast.error(error.response?.data?.message, {
                    position: toast?.POSITION?.TOP_CENTER
                });
                /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 2xx
                    */

            } else if (error.request) {
                /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */

            } else {
                // Something happened in setting up the request and triggered an Error
            }
        }
        );
    }
    // execute pass configuration
    function passConfiguration(action, method, section, id) {

        // console.log(method, section, id)
        let config = {};
        let data = {};
        if (section === "personal") {
            if (method === "patch") {
                data = {
                    "first_name": getFormData?.first_name,
                    "last_name": getFormData?.last_name,
                    "country": getFormData?.country,
                    "dob": moment(getFormData?.dateOfBirth || evaluationData?.user?.dob).format('YYYY-MM-DD'),
                }
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
        }
        else if (section === "contact") {
            if (method === "patch") {
                data = { "evaluation_info": getFormData }
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
        }
        else if (section === "address") {
            // console.log(getFormData)
            if (method === "patch") {
                data = { "evaluation_info": getFormData }
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
            if (method === "delete") {
                // 
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/address/" + id + "/",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
            else {
                // toast.error("Address details required ", {
                //     position: toast?.POSITION?.TOP_CENTER
                // });
            }
        }
        else if (section === "certificate") {
            // console.log(getFormData)
            if (method === "delete") {
                // 
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/file/delete/" + id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
            else {
                // toast.error("Address details required ", {
                //     position: toast?.POSITION?.TOP_CENTER
                // });
            }
        }
        else if (section === "purpose_evaluation") {
            // console.log(getFormData)
            if (method === "patch") {
                data = { "evaluation_info": getFormData }
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
        }
        else if (section === "user_preference") {
            // console.log(getFormData)
            if (method === "patch") {
                data = { "evaluation_info": getFormData }
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
        }
        else if (section === "education_background") {
            // console.log(getFormData)
            if (method === "patch") {
                data = { "evaluation_info": getFormData }

                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
        }
        else if (section === "recipient_institution_detail") {
            // console.log(getFormData)   
            if (method === "patch") {
                data = { "evaluation_info": getFormData }
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
        }
        else if (section === "payment_method") {
            // console.log(getFormData)   
            if (method === "patch") {
                data = { "evaluation_info": getFormData }
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
        }
        else if (section === "verification_reference") {
            // console.log("evaluationData", getFormData)   
            data = { "evaluation_info": getFormData }
            if (method === "patch") {
                config = {
                    method: method,
                    url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: data
                };
            }
        }
        else if (section === "evaluator_content") {
            // console.log("evaluationData", getFormData) 
            if (editorContent !== "") {
                //   
                data = { "content": editorContent }
                if (method === "patch") {
                    config = {
                        method: method,
                        url: process.env.REACT_APP_BASE_API + "/evaluation/" + evaluation_id,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + userData?.token
                        },
                        data: data
                    };
                }
            }
        }

        genericApiCall(config, section)
    }
    function completeReject() {
        // 
        Swal.fire({
            title: 'Do you want to proceed?',
            icon: 'info',
            allowOutsideClick: false,
            // allowEscapeKey: false,
            // showCancelButton: true,
            showDenyButton: true,
            showCloseButton: true,
            confirmButtonColor: '#000',
            // cancelButtonColor: '#d33',
            confirmButtonText: 'Complete',
            // cancelButtonText: 'Cancel',
            denyButtonText: 'Reject'
        }).then((result) => {
            if (result.isConfirmed) {
                // 
                setUploading(true)
                let config = {
                    method: "PATCH",
                    url: process.env.REACT_APP_BASE_API + "/status/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: { "status": "COMPLETED" }
                };
                genericApiCall(config, "")
            }
            else if (result.isDenied) {
                // 
                setUploading(true)
                let config = {
                    method: "PATCH",
                    url: process.env.REACT_APP_BASE_API + "/status/evaluation/" + evaluation_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userData?.token
                    },
                    data: { "status": "REJECTED" }
                };
                genericApiCall(config, "")
            }
        }
        );
    }

    function getDataInfo() {
        let config = {
            method: "get",
            maxBodyLength: "Infinity",
            url: process.env.REACT_APP_BASE_API + "/user",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userData?.token
            },
        };
        axios(config).then(response => {
            // console.log(response.data);
            if (response.status === 200) {
                setGetFormData({})
                // setFamilyData(response?.data?.family)
                // setGetFormData({
                //     "first_name": response?.data?.user?.first_name,
                //     "last_name": response?.data?.user?.last_name,
                //     "other_name": response?.data?.user?.other_name,
                //     "country": response?.data?.user?.country,
                //     "email": response?.data?.user?.email,
                //     "phone": response?.data?.user?.phone,
                //     "photo": response?.data?.photo,
                //     "dateOfBirth": response?.data?.dob,
                //     "certificate_name": "",
                //     "transcript_name": "",
                //     "certificateDate": ""
                // })

                let user_new = { ...userData, ...response.data }
                setCertificate(user_new?.user?.file)
                // console.log(user_new?.user?.file, "userData");
                localStorage.setItem("userDataStore", JSON.stringify(user_new));
            }

        }).catch(function (error) {

            if (error.response) {
                // // console.log("==>");
                /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 2xx
                    */

            } else if (error.request) {
                /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */

            } else {
                // Something happened in setting up the request and triggered an Error
            }
        }
        );

    }
    function trackActivity() {
        // e.preventDefault(); 
        getSessionTimeout();
        const currentUser_new = JSON.parse(localStorage.getItem("userDataStore"));
        if (currentUser_new) {
            currentUser_new["timeLogout"] = new Date().getTime() + currentUser_new?.counter;
            localStorage.setItem('userDataStore', JSON.stringify(currentUser_new))
        }
    }
    return (
        <div className="App" onClick={() => trackActivity()}>
            <CRow className='mt-0 mb-0'>
                <CCol lg={12} style={{ textAlign: 'right' }} className='mt-3 mb-0'>
                    <h5 className='mt-0 mb-0'> {evaluationData?.name} </h5>
                    <p className='mt-0 mb-0'>
                        {evaluationData?.description?.length > 15 ? `${(evaluationData?.description)?.slice(0, 15)}...` : evaluationData?.description}
                    </p>
                    {
                        evaluationData?.progress === 75 ?
                            <Button
                                type="submit"
                                // fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => completeReject()}
                                disabled={uploading}
                            >
                                {uploading ? 'Saving' : 'Complete'}
                            </Button>
                            : ""}
                    {
                        evaluationData?.progress === 100 ?
                            <Button
                                type="submit"
                                // fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={true}
                            >
                                {'Completed'}
                            </Button>
                            : ""
                    }
                </CCol>
            </CRow>

            {
                props?.profileManage === "evaluator" ?
                    <CAccordion activeItemKey={1} className="mt-0">
                        <h6> Evaluation Reporting </h6>
                        <CAccordionItem itemKey={1}>
                            <CAccordionHeader> Comments </CAccordionHeader>
                            <CAccordionBody>
                                <div className='m-2'>
                                    <ReactQuill
                                        value={editorContent || evaluationData?.content}
                                        onChange={handleEditorChange}
                                        placeholder="Write comment..."
                                        style={{ "height": "300px" }}
                                        id="evaluator_pass"
                                    />
                                    <InputLabel shrink htmlFor="evaluator_pass"> </InputLabel>
                                    <br /><br />

                                </div>
                                {
                                    editorContent === "" ? "" :
                                        (
                                            evaluationData?.progress === 100 ?
                                                <Button
                                                    type="submit"
                                                    // fullWidth
                                                    variant="contained"
                                                    sx={{ mt: 3, mb: 2 }}
                                                    disabled={true}
                                                >
                                                    {'Completed'}
                                                </Button>
                                                :
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    sx={{ mt: 3, mb: 2 }}
                                                    // style={{ color: "#fff" }}
                                                    // className="bg-text-com-wp"
                                                    onClick={(e) => passConfiguration("add", "patch", "evaluator_content", 419)}
                                                >
                                                    Save
                                                </Button>

                                        )
                                }



                            </CAccordionBody>
                        </CAccordionItem>
                        <CAccordionItem itemKey={2}>
                            <CAccordionHeader> Reporting Document </CAccordionHeader>
                            <CAccordionBody>

                                <div className='mui-control-form' >
                                    <Box
                                        component="form"
                                        noValidate
                                        autoComplete="on"
                                    >
                                        <Row className='ml-4 mt-0 mb-5'>
                                            <Col sm="4" xs="4" md="4" lg="4" xl="4" className='float-left mr-2 ml-5'>
                                            </Col>
                                            <Col sm="12" xs="12" md="12" lg="12" xl="12" className='mt-0 '>

                                                <TextField
                                                    error={getFormDataError?.evaluatorReportDate}
                                                    // value={moment(evaluationData?.evaluation_info?.dob).format("LLLL")}
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="date"
                                                    max={"2000-01-01"}
                                                    value={moment(evaluationData?.evaluation_info?.evaluatorReportDate).format("YYYY-MM-DD")}
                                                    placeholder="Date issued"
                                                    name="evaluatorReportDate"
                                                    autoFocus
                                                    variant="outlined"
                                                    className='mt-1 mb-0'
                                                    onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "evaluatorReportDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormData({ ...getFormData, ...{ "evaluatorReportDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormDataError({ ...getFormDataError, ...{ "evaluatorReportDate": false } }) }}
                                                />
                                                <InputLabel shrink htmlFor="evaluatorReportDate"> Date issued </InputLabel>
                                            </Col>
                                        </Row>
                                    </Box>

                                </div>

                                <strong>Upload report document </strong>
                                <p className='mt-2 mb-1'>Your file size must be less than 1.22 MB</p>
                                {
                                    evaluationData?.progress === 100 ? ""
                                        :
                                        <Upload {...props2} onChange={(e) => { setProfileCertificate(e?.target?.value || null) }} value={profileCertificate} maxCount={1} >
                                            <ButtonGroup variant='outline' spacing='6'>
                                                <Button className='bg-secondary text-white' ><CIcon icon={cilCloudDownload} className="me-2" /> Select a document </Button>
                                            </ButtonGroup>
                                        </Upload>
                                }
                                {

                                    evaluationData?.progress === 100 ?
                                        <Button
                                            type="submit"
                                            // fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                            disabled={true}
                                        >
                                            {'Completed'}
                                        </Button>
                                        : (
                                            evaluationData?.evaluation_info?.evaluatorReport < 0 ? "" :
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    sx={{ mt: 3, mb: 2 }}
                                                    onClick={() => handleCertificateUpload(6)}
                                                    disabled={uploading}
                                                >
                                                    {uploading ? 'Uploading' : 'Submit'}
                                                </Button>
                                        )
                                }


                                <p className='mt-3 mb-1'>
                                    <strong > Evaluator Report document </strong>
                                    {
                                        evaluationData?.evaluation_info?.evaluatorReport ?
                                            <Row>
                                                <Col xs="6" sm="6" md={6} lg={6} className="mt-2" > <a href={evaluationData?.evaluation_info?.evaluatorReport} target='_blank' rel="noreferrer" > View File </a> </Col>
                                                {/* <Col xs="4" sm="4" md={4} lg={4} className="mt-2" >
                                                        <Badge color='primary' className='wp-cursor-pointer' onClick={(e) => { passConfiguration(e, "delete", "report", "file") }} >Delete</Badge>
                                                    </Col> */}
                                            </Row>
                                            : ''
                                    }
                                </p>
                            </CAccordionBody>
                        </CAccordionItem>


                    </CAccordion>
                    : ""
            }
            {
                props?.profileManage === "education" ?
                    <p>
                        <CAccordion activeItemKey={1} className="mt-0">
                            <h6>Educational Information</h6>
                            <CAccordionItem itemKey={1}>
                                <CAccordionHeader>Certificate Information</CAccordionHeader>
                                <CAccordionBody>
                                    <div className='mui-control-form' >

                                        <Select
                                            isDisabled={true}
                                            placeholder={evaluationData?.evaluation_info?.certificate_name || "Type of Certificate "}
                                            defaultInputValue={evaluationData?.evaluation_info?.certificate_name}
                                            options={optionsStateDoc}
                                            disabled={true}
                                            id="certname"
                                            className='other-input-select d-filters wp-cursor-pointer mt-4'
                                            onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "certificate_name": e.value } }); setGetFormData({ ...getFormData, ...{ "certificate_name": e.value } }); setGetFormDataError({ ...getFormDataError, ...{ "certificate_name": false } }) }}
                                        />
                                        <InputLabel shrink htmlFor="certname"> Type of Certificate </InputLabel>

                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="on"
                                        >
                                            <Row className='ml-4 mt-0 mb-5'>

                                                <Col sm="2" xs="2" md="2" lg="2" xl="2" className=''></Col>
                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className=''>


                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.certificateDate}
                                                        // value={moment(evaluationData?.evaluation_info?.dob).format("LLLL")}
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="date"
                                                        max={"2000-01-01"}
                                                        value={moment(evaluationData?.evaluation_info?.certificateDate).format("YYYY-MM-DD")}
                                                        placeholder="Date issued"
                                                        name="certificateDate"
                                                        autoFocus
                                                        variant="outlined"
                                                        className='mt-1 mb-0'
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "certificateDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormData({ ...getFormData, ...{ "certificateDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormDataError({ ...getFormDataError, ...{ "certificateDate": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="certificateDate"> Date issued </InputLabel>
                                                </Col>
                                            </Row>
                                        </Box>

                                    </div>
                                    <p className='mt-3 mb-1'>

                                        <strong >Educational document </strong>
                                        {
                                            evaluationData?.evaluation_info?.certificate ?
                                                <Row>
                                                    <Col xs="6" sm="6" md={6} lg={6} className="mt-2" > <a href={evaluationData?.evaluation_info?.certificate} target='_blank' rel="noreferrer" > View File </a> </Col>
                                                    {/* <Col xs="4" sm="4" md={4} lg={4} className="mt-2" >
                                                        <Badge color='primary' className='wp-cursor-pointer' onClick={(e) => { passConfiguration(e, "delete", "certificate", "file") }} >Delete</Badge>
                                                    </Col> */}
                                                </Row>
                                                : ''
                                        }
                                    </p>
                                </CAccordionBody>
                            </CAccordionItem>
                            <CAccordionItem itemKey={2}>
                                <CAccordionHeader>Transcript Information</CAccordionHeader>
                                <CAccordionBody>

                                    <div className='mui-control-form' >

                                        <Select
                                            isDisabled={true}
                                            placeholder={evaluationData?.evaluation_info?.transcript_name || "Type of Transcript "}
                                            defaultInputValue={evaluationData?.evaluation_info?.transcript_name}
                                            options={optionsStateDoc}
                                            id="transcript_name"
                                            className='other-input-select d-filters wp-cursor-pointer mt-0 mb-0'
                                            onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "transcript_name": e.value } }); setGetFormData({ ...getFormData, ...{ "transcript_name": e.value } }); setGetFormDataError({ ...getFormDataError, ...{ "transcript_name": false } }) }}
                                        />
                                        <InputLabel shrink htmlFor="transcript_name"> Type of Transcript </InputLabel>

                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="on"
                                        >
                                            <Row className='ml-4 mt-0 mb-5'>
                                                <Col sm="4" xs="4" md="4" lg="4" xl="4" className='float-left mr-2 ml-5'>
                                                </Col>
                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className=''>


                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.transcriptDate}
                                                        // value={moment(evaluationData?.evaluation_info?.dob).format("LLLL")}
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="date"
                                                        max={"2000-01-01"}
                                                        value={moment(evaluationData?.evaluation_info?.transcriptDate).format("YYYY-MM-DD")}
                                                        placeholder="Date issued"
                                                        name="transcriptDate"
                                                        autoFocus
                                                        variant="outlined"
                                                        className='mt-0 mb-0'
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "transcriptDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormData({ ...getFormData, ...{ "transcriptDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormDataError({ ...getFormDataError, ...{ "transcriptDate": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="transcriptDate"> Date issued </InputLabel>
                                                </Col>
                                            </Row>
                                        </Box>

                                    </div>
                                    <p className='mt-3 mb-1'>
                                        <strong >Educational document(s)</strong>
                                        {
                                            evaluationData?.evaluation_info?.transcript ?
                                                <Row>
                                                    <Col xs="6" sm="6" md={6} lg={6} className="mt-2" > <a href={evaluationData?.evaluation_info?.transcript} target='_blank' rel="noreferrer" > View File </a> </Col>
                                                    {/* <Col xs="4" sm="4" md={4} lg={4} className="mt-2" > 
                                                        <Badge color='primary' className='wp-cursor-pointer' onClick={(e) => { passConfiguration(e, "delete", "transcript", "file") }} >Delete</Badge>
                                                    </Col> */}
                                                </Row>
                                                : ''
                                        }
                                    </p>
                                </CAccordionBody>
                            </CAccordionItem>
                            <CAccordionItem itemKey={3}>
                                <CAccordionHeader>Educational Background </CAccordionHeader>
                                <CAccordionBody>

                                    <div className='mui-control-form' >
                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="on"
                                        >
                                            <Row className='ml-4 mt-4 mb-5'>
                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className='float-left mb-5 mr-2 ml-5'>

                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.degree_obtained}
                                                        value={evaluationData?.evaluation_info?.degree_obtained}
                                                        id="degree_obtained"
                                                        name="degree_obtained"
                                                        placeholder="Degree(s) Obtained"
                                                        variant="outlined"
                                                        className='mt-1 mb-0'
                                                        margin="normal"
                                                        type="text"
                                                        fullWidth
                                                        required
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "degree_obtained": e.target.value } }); setGetFormData({ ...getFormData, ...{ "degree_obtained": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "degree_obtained": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="degree_obtained"> Degree Obtained </InputLabel>
                                                </Col>

                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className='float-left mb-5 mr-2 ml-5'>

                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.major_study}
                                                        value={evaluationData?.evaluation_info?.major_study}
                                                        id="major_study"
                                                        name="major_study"
                                                        placeholder="Major/Field of Study"
                                                        variant="outlined"
                                                        className='mt-1 mb-0'
                                                        margin="normal"
                                                        type="text"
                                                        fullWidth
                                                        required
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "major_study": e.target.value } }); setGetFormData({ ...getFormData, ...{ "major_study": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "major_study": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="major_study"> Major Study </InputLabel>
                                                </Col>
                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className='float-left mb-5 mr-2 ml-5'>

                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.gpa}
                                                        value={evaluationData?.evaluation_info?.gpa}
                                                        id="gpa"
                                                        name="gpa"
                                                        placeholder="GPA"
                                                        variant="outlined"
                                                        className='mt-1 mb-0'
                                                        margin="normal"
                                                        type="number"
                                                        inputProps={{ min: 0, max: 5 }}
                                                        fullWidth
                                                        required
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "gpa": e.target.value } }); setGetFormData({ ...getFormData, ...{ "gpa": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "gpa": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="gpa"> GPA </InputLabel>
                                                </Col>

                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className='mb-5'>

                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.school_year_from}
                                                        // value={moment(evaluationData?.evaluation_info?.school_year_from).format("LLLL")}
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="date"
                                                        max={"2000-01-01"}
                                                        defaultValue={moment(evaluationData?.evaluation_info?.school_year_from).format("YYYY-MM-DD")}
                                                        placeholder="Date from"
                                                        name="school_year_from"
                                                        autoFocus
                                                        variant="outlined"
                                                        className='mt-1 mb-0'
                                                        // className='mb-5 '
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "school_year_from": e.target.value } }); setGetFormData({ ...getFormData, ...{ "school_year_from": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "school_year_from": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="school_year_from"> Date from </InputLabel>
                                                </Col>

                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className=''>

                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.school_year_to}
                                                        // value={moment(evaluationData?.evaluation_info?.school_year_to).format("LLLL")}
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="date"
                                                        max={"2000-01-01"}
                                                        defaultValue={moment(evaluationData?.evaluation_info?.school_year_to).format("YYYY-MM-DD")}
                                                        placeholder="Date to"
                                                        name="school_year_to"
                                                        autoFocus
                                                        variant="outlined"
                                                        className='mt-1 mb-0'
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "school_year_to": e.target.value } }); setGetFormData({ ...getFormData, ...{ "school_year_to": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "school_year_to": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="school_year_to"> Date to </InputLabel>
                                                </Col>
                                            </Row>
                                        </Box>

                                    </div>

                                </CAccordionBody>
                            </CAccordionItem>
                        </CAccordion>
                    </p>
                    : ""
            }
            {
                props?.profileManage === "additional" ?
                    <p>
                        <CAccordion activeItemKey={1} className="mt-0">
                            <h6>Additional Documents</h6>
                            <CAccordionItem itemKey={1}>
                                <CAccordionHeader>Identification Documents (Passport, ID Card) </CAccordionHeader>
                                <CAccordionBody>

                                    <div className='mui-control-form' >

                                        <Select
                                            isDisabled={true}
                                            placeholder={evaluationData?.evaluation_info?.identification_name || "Type of Identification Documents "}
                                            defaultInputValue={evaluationData?.evaluation_info?.identification_name}
                                            options={optionsIdDoc}
                                            id="identification_name"
                                            className='other-input-select d-filters wp-cursor-pointer mt-4 mb-0'
                                            onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "identification_name": e.value } }); setGetFormData({ ...getFormData, ...{ "identification_name": e.value } }); setGetFormDataError({ ...getFormDataError, ...{ "identification_name": false } }) }}
                                        />
                                        <InputLabel shrink htmlFor="identification_name"> Type of Identification Documents </InputLabel>

                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="on"
                                        >
                                            <Row className='ml-4 mt-0 mb-5'>
                                                <Col sm="2" xs="2" md="2" lg="2" xl="2" className=''></Col>
                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className=''>


                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.identificationDate}
                                                        // value={moment(evaluationData?.evaluation_info?.dob).format("LLLL")}
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="date"
                                                        max={"2000-01-01"}
                                                        value={moment(evaluationData?.evaluation_info?.identificationDate).format("YYYY-MM-DD")}
                                                        placeholder="Date issued"
                                                        name="identificationDate"
                                                        autoFocus
                                                        variant="outlined"
                                                        className='mt-0 mb-0'
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "identificationDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormData({ ...getFormData, ...{ "identificationDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormDataError({ ...getFormDataError, ...{ "identificationDate": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="identificationDate"> Date issued </InputLabel>
                                                </Col>
                                            </Row>
                                        </Box>

                                    </div>
                                    <p className='mt-3 mb-1'>
                                        <strong >Educational document(s)</strong>
                                        {
                                            evaluationData?.evaluation_info?.identification ?
                                                <Row>
                                                    <Col xs="6" sm="6" md={6} lg={6} className="mt-2" > <a href={evaluationData?.evaluation_info?.identification} target='_blank' rel="noreferrer" > View File </a> </Col>
                                                    {/* <Col xs="4" sm="4" md={4} lg={4} className="mt-2" >
                                                        <Badge color='primary' className='wp-cursor-pointer' onClick={(e) => { passConfiguration(e, "delete", "identification", "file") }} >Delete</Badge>
                                                    </Col> */}
                                                </Row>
                                                : ''
                                        }
                                    </p>
                                </CAccordionBody>
                            </CAccordionItem>
                            <CAccordionItem itemKey={2}>
                                <CAccordionHeader> Previous Credential Evaluation Reports (if any) </CAccordionHeader>
                                <CAccordionBody>

                                    <div className='mui-control-form' >
                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="on"
                                        >
                                            <Row className='ml-4 mt-0 mb-5'>
                                                <Col sm="4" xs="4" md="4" lg="4" xl="4" className='float-left mr-2 ml-5'>
                                                </Col>
                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className='mt-0 '>


                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.reportDate}
                                                        // value={moment(evaluationData?.evaluation_info?.dob).format("LLLL")}
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="date"
                                                        max={"2000-01-01"}
                                                        value={moment(evaluationData?.evaluation_info?.reportDate).format("YYYY-MM-DD")}
                                                        placeholder="Date issued"
                                                        name="reportDate"
                                                        autoFocus
                                                        variant="outlined"
                                                        className='mt-1 mb-0'
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "reportDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormData({ ...getFormData, ...{ "reportDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormDataError({ ...getFormDataError, ...{ "reportDate": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="reportDate"> Date issued </InputLabel>
                                                </Col>
                                            </Row>
                                        </Box>

                                    </div>
                                    <p className='mt-3 mb-1'>
                                        <strong >Educational document(s)</strong>
                                        {
                                            evaluationData?.evaluation_info?.report ?
                                                <Row>
                                                    <Col xs="6" sm="6" md={6} lg={6} className="mt-2" > <a href={evaluationData?.evaluation_info?.report} target='_blank' rel="noreferrer" > View File </a> </Col>
                                                    {/* <Col xs="4" sm="4" md={4} lg={4} className="mt-2" >
                                                        <Badge color='primary' className='wp-cursor-pointer' onClick={(e) => { passConfiguration(e, "delete", "report", "file") }} >Delete</Badge>
                                                    </Col> */}
                                                </Row>
                                                : ''
                                        }
                                    </p>
                                </CAccordionBody>
                            </CAccordionItem>
                            <CAccordionItem itemKey={3}>
                                <CAccordionHeader> Letter of Recommendation (if applicable) </CAccordionHeader>
                                <CAccordionBody>

                                    <div className='mui-control-form' >
                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="on"
                                        >
                                            <Row className='ml-4 mt-0 mb-5'>
                                                <Col sm="4" xs="4" md="4" lg="4" xl="4" className='float-left mr-2 ml-5'>
                                                </Col>
                                                <Col sm="12" xs="12" md="12" lg="12" xl="12" className=''>


                                                    <TextField
                                                        disabled={true}
                                                        error={getFormDataError?.letterRecommendationDate}
                                                        // value={moment(evaluationData?.evaluation_info?.dob).format("LLLL")}
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="date"
                                                        max={"2000-01-01"}
                                                        value={moment(evaluationData?.evaluation_info?.letterRecommendationDate).format("YYYY-MM-DD")}
                                                        placeholder="Date issued"
                                                        name="letterRecommendationDate"
                                                        autoFocus
                                                        variant="outlined"
                                                        className='mt-1 mb-0'
                                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "letterRecommendationDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormData({ ...getFormData, ...{ "letterRecommendationDate": moment(e.target.value).format('YYYY-MM-DD') } }); setGetFormDataError({ ...getFormDataError, ...{ "letterRecommendationDate": false } }) }}
                                                    />
                                                    <InputLabel shrink htmlFor="letterRecommendationDate"> Date issued </InputLabel>
                                                </Col>
                                                {/* <Col sm="2" xs="2" md="2" lg="2" xl="2" className='float-left ml-2'> {evaluationData?.evaluation_info?.letterRecommendationDate} </Col> */}
                                            </Row>
                                        </Box>

                                    </div>
                                    <p className='mt-3 mb-1'>
                                        <strong >Educational document(s)</strong>
                                        {
                                            evaluationData?.evaluation_info?.recommendation ?
                                                <Row>
                                                    <Col xs="6" sm="6" md={6} lg={6} className="mt-2" > <a href={evaluationData?.evaluation_info?.recommendation} target='_blank' rel="noreferrer" > View File </a> </Col>
                                                    {/* <Col xs="4" sm="4" md={4} lg={4} className="mt-2" >
                                                        <Badge color='primary' className='wp-cursor-pointer' onClick={(e) => { passConfiguration(e, "delete", "recommendation", "file") }} >Delete</Badge>
                                                    </Col> */}
                                                </Row>
                                                : ''
                                        }
                                    </p>
                                </CAccordionBody>
                            </CAccordionItem>

                        </CAccordion>
                    </p>
                    : ""
            }
            {
                props?.profileManage === "other" ?
                    <CAccordion activeItemKey={1} className="mt-0">
                        <h6>Other Information</h6>
                        <CAccordionItem itemKey={1}>
                            <CAccordionHeader> Purpose of Evaluation </CAccordionHeader>
                            <CAccordionBody>

                                <div className='mui-control-form' >
                                    <Select
                                        isDisabled={true}
                                        placeholder={evaluationData?.evaluation_info?.purpose_evaluation}
                                        defaultInputValue={evaluationData?.evaluation_info?.purpose_evaluation}
                                        options={purposeEvaluation}
                                        id="purpose_evaluation"
                                        className='other-input-select d-filters wp-cursor-pointer mb-0'
                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "purpose_evaluation": e.value } }); setGetFormData({ ...getFormData, ...{ "purpose_evaluation": e.value } }); setGetFormDataError({ ...getFormDataError, ...{ "purpose_evaluation": false } }) }}
                                    />
                                    <InputLabel shrink htmlFor="purpose_evaluation"> Purpose of Evaluation </InputLabel>
                                </div>
                            </CAccordionBody>
                        </CAccordionItem>
                        <CAccordionItem itemKey={2}>
                            <CAccordionHeader> User Preferences </CAccordionHeader>
                            <CAccordionBody>

                                <CCol xs="12" sm="12" md={12} lg={12} className="mt-1" >
                                    <div className='mui-control-form' >
                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="on"
                                        >

                                            <TextField
                                                disabled={true}
                                                error={getFormDataError?.user_preference_email}
                                                value={evaluationData?.evaluation_info?.user_preference_email || evaluationData?.evaluation_info?.email}
                                                id="user_preference_email"
                                                name="user_preference_email"
                                                placeholder="Your email"
                                                variant="outlined"
                                                className='mt-3 mb-0'
                                                margin="normal"
                                                type="email"
                                                fullWidth
                                                required
                                                onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "user_preference_email": e.target.value } }); setGetFormData({ ...getFormData, ...{ "user_preference_email": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "user_preference_email": false } }) }}
                                            />
                                            <InputLabel shrink htmlFor="user_preference_email"> Preference Contact Email </InputLabel>


                                            <TextField
                                                disabled={true}
                                                error={getFormDataError?.user_preference_phone}
                                                value={evaluationData?.evaluation_info?.user_preference_phone || evaluationData?.evaluation_info?.phone}
                                                margin="normal"
                                                required
                                                fullWidth
                                                type="text"
                                                placeholder="Phone number"
                                                name="user_preference_phone"
                                                autoFocus
                                                variant="outlined"
                                                className='mt-3 mb-0'
                                                onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "user_preference_phone": e.target.value } }); setGetFormData({ ...getFormData, ...{ "user_preference_phone": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "user_preference_phone": false } }) }}
                                            />
                                            <InputLabel shrink htmlFor="user_preference_phone"> Preference Contact Phone Number </InputLabel>
                                        </Box>
                                    </div>
                                </CCol>
                            </CAccordionBody>
                        </CAccordionItem>
                        <CAccordionItem itemKey={3}>
                            <CAccordionHeader> Recipient Institution Details </CAccordionHeader>
                            <CAccordionBody>

                                <CCol xs="12" sm="12" md={12} lg={12} className="mt-1" >
                                    <div className='mui-control-form' >
                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="on"
                                        >

                                            <TextField
                                                disabled={true}
                                                error={getFormDataError?.institution_name}
                                                value={evaluationData?.evaluation_info?.institution_name}
                                                id="institution_name"
                                                name="institution_name"
                                                placeholder="Name of Institution"
                                                variant="outlined"
                                                margin="normal"
                                                className='mt-3 mb-0'
                                                type="text"
                                                fullWidth
                                                required
                                                onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "institution_name": e.target.value } }); setGetFormData({ ...getFormData, ...{ "institution_name": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "institution_name": false } }) }}
                                            />
                                            <InputLabel shrink htmlFor="institution_name"> Name of Institution </InputLabel>

                                            <TextField
                                                disabled={true}
                                                error={getFormDataError?.department_office}
                                                value={evaluationData?.evaluation_info?.department_office}
                                                margin="normal"
                                                required
                                                fullWidth
                                                type="text"
                                                placeholder="Department/Office (if applicable)"
                                                name="department_office"
                                                autoFocus
                                                variant="outlined"
                                                className='mt-4 mb-0'
                                                onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "department_office": e.target.value } }); setGetFormData({ ...getFormData, ...{ "department_office": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "department_office": false } }) }}
                                            />
                                            <InputLabel shrink htmlFor="department_office"> Department/Office (if applicable) </InputLabel>


                                            <TextField
                                                disabled={true}
                                                error={getFormDataError?.institution_contact_phone}
                                                value={evaluationData?.evaluation_info?.institution_contact_phone || evaluationData?.evaluation_info?.contact_person}
                                                margin="normal"
                                                required
                                                fullWidth
                                                type="text"
                                                placeholder="Phone number (if applicable)"
                                                name="institution_contact_phone"
                                                autoFocus
                                                variant="outlined"
                                                className='mt-4 mb-0'
                                                onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "institution_contact_phone": e.target.value } }); setGetFormData({ ...getFormData, ...{ "institution_contact_phone": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "institution_contact_phone": false } }) }}
                                            />
                                            <InputLabel shrink htmlFor="institution_contact_phone"> Contact Phone (if applicable) </InputLabel>



                                            <TextField
                                                disabled={true}
                                                error={getFormDataError?.institution_contact_person_email}
                                                value={evaluationData?.evaluation_info?.institution_contact_person_email || evaluationData?.evaluation_info?.contact_person_email}
                                                margin="normal"
                                                required
                                                fullWidth
                                                type="text"
                                                placeholder="Email (if applicable)"
                                                name="institution_contact_person_email"
                                                autoFocus
                                                variant="outlined"
                                                className='mt-4 mb-0'
                                                onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "institution_contact_person_email": e.target.value } }); setGetFormData({ ...getFormData, ...{ "institution_contact_person_email": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "institution_contact_person_email": false } }) }}
                                            />
                                            <InputLabel shrink htmlFor="institution_contact_person_email"> Contact Email (if applicable) </InputLabel>
                                        </Box>
                                    </div>
                                </CCol>
                            </CAccordionBody>
                        </CAccordionItem>
                        <CAccordionItem itemKey={4}>
                            <CAccordionHeader> Payment Method </CAccordionHeader>
                            <CAccordionBody>

                                <div className='mui-control-form' >
                                    <Select
                                        isDisabled={true}
                                        placeholder={evaluationData?.evaluation_info?.payment_method}
                                        defaultInputValue={evaluationData?.evaluation_info?.payment_method}
                                        options={optionsPaymentMethod}
                                        id="payment_method"
                                        className='other-input-select d-filters wp-cursor-pointer mb-0'
                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "payment_method": e.value } }); setGetFormData({ ...getFormData, ...{ "payment_method": e.value } }); setGetFormDataError({ ...getFormDataError, ...{ "payment_method": false } }) }}
                                    />
                                    <InputLabel shrink htmlFor="payment_method"> Payment Method </InputLabel>
                                </div>

                                <div className='mui-control-form' >
                                    <Box
                                        component="form"
                                        noValidate
                                        autoComplete="on"
                                    >

                                        <TextField
                                            disabled={true}
                                            error={getFormDataError?.billing_address}
                                            value={evaluationData?.evaluation_info?.billing_address}
                                            id="billing_address"
                                            name="billing_address"
                                            placeholder="Your billing address"
                                            variant="outlined"
                                            className='mt-3 mb-0'
                                            margin="normal"
                                            type="billing_address"
                                            fullWidth
                                            required
                                            onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "billing_address": e.target.value } }); setGetFormData({ ...getFormData, ...{ "billing_address": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "billing_address": false } }) }}
                                        />
                                        <InputLabel shrink htmlFor="billing_address"> Billing address </InputLabel>
                                    </Box>
                                </div>
                            </CAccordionBody>
                        </CAccordionItem>
                        <CAccordionItem itemKey={5}>
                            <CAccordionHeader> Reference - Verification Information  </CAccordionHeader>
                            <CAccordionBody>
                                <div className='mui-control-form' >
                                    <Box
                                        component="form"
                                        noValidate
                                        autoComplete="on"
                                    >

                                        <TextField
                                            disabled={true}
                                            error={getFormDataError?.reference_email}
                                            value={evaluationData?.evaluation_info?.reference_email}
                                            id="reference_email"
                                            name="reference_email"
                                            placeholder="Your reference email"
                                            variant="outlined"
                                            margin="normal"
                                            type="reference_email"
                                            className='mt-4 mb-0'
                                            fullWidth
                                            required
                                            onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "reference_email": e.target.value } }); setGetFormData({ ...getFormData, ...{ "reference_email": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "reference_email": false } }) }}
                                        />
                                        <InputLabel shrink htmlFor="reference_email"> Reference Email </InputLabel>


                                        <TextField
                                            disabled={true}
                                            error={getFormDataError?.reference_phone}
                                            value={evaluationData?.evaluation_info?.reference_phone}
                                            id="reference_phone"
                                            name="reference_phone"
                                            placeholder="Your reference phone number"
                                            variant="outlined"
                                            margin="normal"
                                            type="reference_phone"
                                            fullWidth
                                            required
                                            className='mt-4 mb-0'
                                            onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "reference_phone": e.target.value } }); setGetFormData({ ...getFormData, ...{ "reference_phone": e.target.value } }); setGetFormDataError({ ...getFormDataError, ...{ "reference_phone": false } }) }}
                                        />
                                        <InputLabel shrink htmlFor="reference_phone"> Reference Phone </InputLabel>

                                    </Box>
                                </div>
                            </CAccordionBody>
                        </CAccordionItem>
                        <CAccordionItem itemKey={6}>
                            <CAccordionHeader> Consent  </CAccordionHeader>
                            <CAccordionBody>

                                <div className='mui-control-form' >
                                    <Label for="verification_status" className="label-dc"> </Label>
                                    <Select
                                        isDisabled={true}
                                        placeholder={evaluationData?.evaluation_info?.verification_status}
                                        defaultInputValue={evaluationData?.evaluation_info?.verification_status}
                                        options={optionsVerificationState}
                                        id="verification_status"
                                        className='other-input-select d-filters wp-cursor-pointer mb-0 '
                                        onChange={(e) => { setEvaluationData({ ...evaluationData, evaluation_info: { ...evaluationData.evaluation_info, "verification_status": e.value } }); setGetFormData({ ...getFormData, ...{ "verification_status": e.value } }); setGetFormDataError({ ...getFormDataError, ...{ "verification_status": false } }) }}
                                    />
                                    <InputLabel shrink htmlFor="verification_status"> Give consent </InputLabel>
                                </div>
                            </CAccordionBody>
                        </CAccordionItem>

                    </CAccordion>
                    : ""
            }

        </div>
    );
};

export default EditSubmittedEvaluationInfo;


EditSubmittedEvaluationInfo.propTypes = {
    profileManage: PropTypes.string,
    // getNewPassedWalkAction: PropTypes.instanceOf(PropTypes.any).isRequired
};






const countries = [
    {
        "name": "Afghanistan",
        "code": "AF",
        "capital": "Kabul",
        "region": "AS",
        "currency": {
            "code": "AFN",
            "name": "Afghan afghani",
            "symbol": "؋"
        },
        "language": {
            "code": "ps",
            "name": "Pashto"
        },
        "flag": "https://restcountries.eu/data/afg.svg",
        "dialling_code": "+93",
        "isoCode": "004"
    },
    {
        "name": "Albania",
        "code": "AL",
        "capital": "Tirana",
        "region": "EU",
        "currency": {
            "code": "ALL",
            "name": "Albanian lek",
            "symbol": "L"
        },
        "language": {
            "code": "sq",
            "name": "Albanian"
        },
        "flag": "https://restcountries.eu/data/alb.svg",
        "dialling_code": "+355",
        "isoCode": "008"
    },
    {
        "name": "Algeria",
        "code": "DZ",
        "capital": "Algiers",
        "region": "AF",
        "currency": {
            "code": "DZD",
            "name": "Algerian dinar",
            "symbol": "د.ج"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/dza.svg",
        "dialling_code": "+213",
        "isoCode": "012"
    },
    {
        "name": "American Samoa",
        "code": "AS",
        "capital": "Pago Pago",
        "region": "OC",
        "currency": {
            "code": "USD",
            "name": "United State Dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/asm.svg",
        "dialling_code": "+1",
        "isoCode": "016"
    },
    {
        "name": "Andorra",
        "code": "AD",
        "capital": "Andorra la Vella",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "ca",
            "name": "Catalan"
        },
        "flag": "https://restcountries.eu/data/and.svg",
        "dialling_code": "+376",
        "isoCode": "020"
    },
    {
        "name": "Angola",
        "code": "AO",
        "capital": "Luanda",
        "region": "AF",
        "currency": {
            "code": "AOA",
            "name": "Angolan kwanza",
            "symbol": "Kz"
        },
        "language": {
            "code": "pt",
            "name": "Portuguese"
        },
        "flag": "https://restcountries.eu/data/ago.svg",
        "dialling_code": "+244",
        "isoCode": "024"
    },
    {
        "name": "Anguilla",
        "code": "AI",
        "capital": "The Valley",
        "region": "NA",
        "currency": {
            "code": "XCD",
            "name": "East Caribbean dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/aia.svg",
        "dialling_code": "+43",
        "isoCode": "660"
    },
    {
        "name": "Antigua and Barbuda",
        "code": "AG",
        "capital": "Saint John's",
        "region": "NA",
        "currency": {
            "code": "XCD",
            "name": "East Caribbean dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/atg.svg",
        "dialling_code": "+1",
        "isoCode": "028"
    },
    {
        "name": "Argentina",
        "code": "AR",
        "capital": "Buenos Aires",
        "region": "SA",
        "currency": {
            "code": "ARS",
            "name": "Argentine peso",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/arg.svg",
        "dialling_code": "+54",
        "isoCode": "032"
    },
    {
        "name": "Armenia",
        "code": "AM",
        "capital": "Yerevan",
        "region": "AS",
        "currency": {
            "code": "AMD",
            "name": "Armenian dram",
            "symbol": null
        },
        "language": {
            "code": "hy",
            "name": "Armenian"
        },
        "flag": "https://restcountries.eu/data/arm.svg",
        "dialling_code": "+374",
        "isoCode": "051"
    },
    {
        "name": "Aruba",
        "code": "AW",
        "capital": "Oranjestad",
        "region": "SA",
        "currency": {
            "code": "AWG",
            "name": "Aruban florin",
            "symbol": "ƒ"
        },
        "language": {
            "code": "nl",
            "name": "Dutch"
        },
        "flag": "https://restcountries.eu/data/abw.svg",
        "dialling_code": "+297",
        "isoCode": "533"
    },
    {
        "name": "Australia",
        "code": "AU",
        "capital": "Canberra",
        "region": "OC",
        "currency": {
            "code": "AUD",
            "name": "Australian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/aus.svg",
        "dialling_code": "+61",
        "isoCode": "036"
    },
    {
        "name": "Azerbaijan",
        "code": "AZ",
        "capital": "Baku",
        "region": "AS",
        "currency": {
            "code": "AZN",
            "name": "Azerbaijani manat",
            "symbol": null
        },
        "language": {
            "code": "az",
            "name": "Azerbaijani"
        },
        "flag": "https://restcountries.eu/data/aze.svg",
        "dialling_code": "+994",
        "isoCode": "031"
    },
    {
        "name": "Bahamas",
        "code": "BS",
        "capital": "Nassau",
        "region": "NA",
        "currency": {
            "code": "BSD",
            "name": "Bahamian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/bhs.svg",
        "dialling_code": "+1",
        "isoCode": "044"
    },
    {
        "name": "Bahrain",
        "code": "BH",
        "capital": "Manama",
        "region": "AS",
        "currency": {
            "code": "BHD",
            "name": "Bahraini dinar",
            "symbol": ".د.ب"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/bhr.svg",
        "dialling_code": "+973",
        "isoCode": "048"
    },
    {
        "name": "Bangladesh",
        "code": "BD",
        "capital": "Dhaka",
        "region": "AS",
        "currency": {
            "code": "BDT",
            "name": "Bangladeshi taka",
            "symbol": "৳"
        },
        "language": {
            "code": "bn",
            "name": "Bengali"
        },
        "flag": "https://restcountries.eu/data/bgd.svg",
        "dialling_code": "+880",
        "isoCode": "050"
    },
    {
        "name": "Barbados",
        "code": "BB",
        "capital": "Bridgetown",
        "region": "NA",
        "currency": {
            "code": "BBD",
            "name": "Barbadian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/brb.svg",
        "dialling_code": "+1",
        "isoCode": "052"
    },
    {
        "name": "Belarus",
        "code": "BY",
        "capital": "Minsk",
        "region": "EU",
        "currency": {
            "code": "BYN",
            "name": "New Belarusian ruble",
            "symbol": "Br"
        },
        "language": {
            "code": "be",
            "name": "Belarusian"
        },
        "flag": "https://restcountries.eu/data/blr.svg",
        "dialling_code": "+375",
        "isoCode": "112"
    },
    {
        "name": "Belgium",
        "code": "BE",
        "capital": "Brussels",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "nl",
            "name": "Dutch"
        },
        "flag": "https://restcountries.eu/data/bel.svg",
        "dialling_code": "+32",
        "isoCode": "056"
    },
    {
        "name": "Belize",
        "code": "BZ",
        "capital": "Belmopan",
        "region": "NA",
        "currency": {
            "code": "BZD",
            "name": "Belize dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/blz.svg",
        "dialling_code": "+501",
        "isoCode": "084"
    },
    {
        "name": "Benin",
        "code": "BJ",
        "capital": "Porto-Novo",
        "region": "AF",
        "currency": {
            "code": "XOF",
            "name": "West African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/ben.svg",
        "dialling_code": "+229",
        "isoCode": "204"
    },
    {
        "name": "Bermuda",
        "code": "BM",
        "capital": "Hamilton",
        "region": "NA",
        "currency": {
            "code": "BMD",
            "name": "Bermudian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/bmu.svg",
        "dialling_code": "+1",
        "isoCode": "060"
    },
    {
        "name": "Bhutan",
        "code": "BT",
        "capital": "Thimphu",
        "region": "AS",
        "currency": {
            "code": "BTN",
            "name": "Bhutanese ngultrum",
            "symbol": "Nu."
        },
        "language": {
            "code": "dz",
            "name": "Dzongkha"
        },
        "flag": "https://restcountries.eu/data/btn.svg",
        "dialling_code": "+975",
        "isoCode": "064"
    },
    {
        "name": "Bolivia (Plurinational State of)",
        "code": "BO",
        "capital": "Sucre",
        "region": "SA",
        "currency": {
            "code": "BOB",
            "name": "Bolivian boliviano",
            "symbol": "Bs."
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/bol.svg",
        "dialling_code": "+591",
        "isoCode": "068"
    },
    {
        "name": "Bosnia and Herzegovina",
        "code": "BA",
        "capital": "Sarajevo",
        "region": "EU",
        "currency": {
            "code": "BAM",
            "name": "Bosnia and Herzegovina convertible mark",
            "symbol": null
        },
        "language": {
            "code": "bs",
            "name": "Bosnian"
        },
        "flag": "https://restcountries.eu/data/bih.svg",
        "dialling_code": "+387",
        "isoCode": "070"
    },
    {
        "name": "Botswana",
        "code": "BW",
        "capital": "Gaborone",
        "region": "AF",
        "currency": {
            "code": "BWP",
            "name": "Botswana pula",
            "symbol": "P"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/bwa.svg",
        "dialling_code": "+267",
        "isoCode": "072"
    },
    {
        "name": "Brazil",
        "code": "BR",
        "capital": "Brasília",
        "region": "SA",
        "currency": {
            "code": "BRL",
            "name": "Brazilian real",
            "symbol": "R$"
        },
        "language": {
            "code": "pt",
            "name": "Portuguese"
        },
        "flag": "https://restcountries.eu/data/bra.svg",
        "dialling_code": "+55",
        "isoCode": "076"
    },
    {
        "name": "British Indian Ocean Territory",
        "code": "IO",
        "capital": "Diego Garcia",
        "region": "AF",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/iot.svg",
        "dialling_code": "+246",
        "isoCode": "086"
    },
    {
        "name": "Virgin Islands (British)",
        "code": "VG",
        "capital": "Road Town",
        "region": "NA",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/vgb.svg",
        "dialling_code": "+1",
        "isoCode": "092"
    },
    {
        "name": "Virgin Islands (U.S.)",
        "code": "VI",
        "capital": "Charlotte Amalie",
        "region": "NA",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/vir.svg",
        "dialling_code": "+1",
        "isoCode": "850"
    },
    {
        "name": "Brunei Darussalam",
        "code": "BN",
        "capital": "Bandar Seri Begawan",
        "region": "AS",
        "currency": {
            "code": "BND",
            "name": "Brunei dollar",
            "symbol": "$"
        },
        "language": {
            "code": "ms",
            "name": "Malay"
        },
        "flag": "https://restcountries.eu/data/brn.svg",
        "dialling_code": "+673",
        "isoCode": "096"
    },
    {
        "name": "Bulgaria",
        "code": "BG",
        "capital": "Sofia",
        "region": "EU",
        "currency": {
            "code": "BGN",
            "name": "Bulgarian lev",
            "symbol": "лв"
        },
        "language": {
            "code": "bg",
            "name": "Bulgarian"
        },
        "flag": "https://restcountries.eu/data/bgr.svg",
        "dialling_code": "+359",
        "isoCode": "100"
    },
    {
        "name": "Burkina Faso",
        "code": "BF",
        "capital": "Ouagadougou",
        "region": "AF",
        "currency": {
            "code": "XOF",
            "name": "West African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/bfa.svg",
        "dialling_code": "+226",
        "isoCode": "854"
    },
    {
        "name": "Burundi",
        "code": "BI",
        "capital": "Bujumbura",
        "region": "AF",
        "currency": {
            "code": "BIF",
            "name": "Burundian franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/bdi.svg",
        "dialling_code": "+257",
        "isoCode": "108"
    },
    {
        "name": "Cambodia",
        "code": "KH",
        "capital": "Phnom Penh",
        "region": "AS",
        "currency": {
            "code": "KHR",
            "name": "Cambodian riel",
            "symbol": "៛"
        },
        "language": {
            "code": "km",
            "name": "Khmer"
        },
        "flag": "https://restcountries.eu/data/khm.svg",
        "dialling_code": "+855",
        "isoCode": "116"
    },
    {
        "name": "Cameroon",
        "code": "CM",
        "capital": "Yaoundé",
        "region": "AF",
        "currency": {
            "code": "XAF",
            "name": "Central African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/cmr.svg",
        "dialling_code": "+237",
        "isoCode": "120"
    },
    {
        "name": "Canada",
        "code": "CA",
        "capital": "Ottawa",
        "region": "NA",
        "currency": {
            "code": "CAD",
            "name": "Canadian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/can.svg",
        "dialling_code": "+1",
        "isoCode": "124"
    },
    {
        "name": "Cabo Verde",
        "code": "CV",
        "capital": "Praia",
        "region": "AF",
        "currency": {
            "code": "CVE",
            "name": "Cape Verdean escudo",
            "symbol": "Esc"
        },
        "language": {
            "code": "pt",
            "iso639_2": "por",
            "name": "Portuguese",
            "nativeName": "Português"
        },
        "flag": "https://restcountries.eu/data/cpv.svg",
        "dialling_code": "+238",
        "isoCode": "132"
    },
    {
        "name": "Cayman Islands",
        "code": "KY",
        "capital": "George Town",
        "region": "NA",
        "demonym": "Caymanian",
        "currency": {
            "code": "KYD",
            "name": "Cayman Islands dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/cym.svg",
        "dialling_code": "+1",
        "isoCode": "136"
    },
    {
        "name": "Central African Republic",
        "code": "CF",
        "capital": "Bangui",
        "region": "AF",
        "currency": {
            "code": "XAF",
            "name": "Central African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/caf.svg",
        "dialling_code": "+236",
        "isoCode": "140"
    },
    {
        "name": "Central African Republic",
        "code": "CF",
        "capital": "Bangui",
        "region": "AF",
        "currency": {
            "code": "XAF",
            "name": "Central African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/caf.svg",
        "dialling_code": "+236",
        "isoCode": "140"
    },
    {
        "name": "Chile",
        "code": "CL",
        "capital": "Santiago",
        "region": "SA",
        "currency": {
            "code": "CLP",
            "name": "Chilean peso",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "iso639_2": "spa",
            "name": "Spanish",
            "nativeName": "Español"
        },
        "flag": "https://restcountries.eu/data/chl.svg",
        "dialling_code": "+56",
        "isoCode": "152"
    },
    {
        "name": "China",
        "code": "CN",
        "capital": "Beijing",
        "region": "AS",
        "currency": {
            "code": "CNY",
            "name": "Chinese yuan",
            "symbol": "¥"
        },
        "language": {
            "code": "zh",
            "name": "Chinese"
        },
        "flag": "https://restcountries.eu/data/chn.svg",
        "dialling_code": "+86",
        "isoCode": "156"
    },
    {
        "name": "Colombia",
        "code": "CO",
        "capital": "Bogotá",
        "region": "SA",
        "currency": {
            "code": "COP",
            "name": "Colombian peso",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/col.svg",
        "dialling_code": "+57",
        "isoCode": "170"
    },
    {
        "name": "Comoros",
        "code": "KM",
        "capital": "Moroni",
        "region": "AF",
        "currency": {
            "code": "KMF",
            "name": "Comorian franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/com.svg",
        "dialling_code": "+269",
        "isoCode": "174"
    },
    {
        "name": "Congo",
        "code": "CG",
        "capital": "Brazzaville",
        "region": "AF",
        "currency": {
            "code": "XAF",
            "name": "Central African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/cog.svg",
        "dialling_code": "+242",
        "isoCode": "178"
    },
    {
        "name": "Congo (Democratic Republic of the)",
        "code": "CD",
        "capital": "Kinshasa",
        "region": "AF",
        "currency": {
            "code": "CDF",
            "name": "Congolese franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/cod.svg",
        "dialling_code": "+243",
        "isoCode": "180"
    },
    {
        "name": "Cook Islands",
        "code": "CK",
        "capital": "Avarua",
        "region": "OC",
        "currency": {
            "code": "NZD",
            "name": "New Zealand dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/cok.svg",
        "dialling_code": "+682",
        "isoCode": "184"
    },
    {
        "name": "Costa Rica",
        "code": "CR",
        "capital": "San José",
        "region": "NA",
        "currency": {
            "code": "CRC",
            "name": "Costa Rican colón",
            "symbol": "₡"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/cri.svg",
        "dialling_code": "+506",
        "isoCode": "188"
    },
    {
        "name": "Croatia",
        "code": "HR",
        "capital": "Zagreb",
        "region": "EU",
        "currency": {
            "code": "HRK",
            "name": "Croatian kuna",
            "symbol": "kn"
        },
        "language": {
            "code": "hr",
            "name": "Croatian"
        },
        "flag": "https://restcountries.eu/data/hrv.svg",
        "dialling_code": "+385",
        "isoCode": "191"
    },
    {
        "name": "Cuba",
        "code": "CU",
        "capital": "Havana",
        "region": "NA",
        "currency": {
            "code": "CUC",
            "name": "Cuban convertible peso",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/cub.svg",
        "dialling_code": "+53",
        "isoCode": "192"
    },
    {
        "name": "Cuba",
        "code": "CU",
        "capital": "Havana",
        "region": "NA",
        "currency": {
            "code": "CUC",
            "name": "Cuban convertible peso",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/cub.svg",
        "dialling_code": "+53",
        "isoCode": "192"
    },
    {
        "name": "Cyprus",
        "code": "CY",
        "capital": "Nicosia",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "tr",
            "name": "Turkish"
        },
        "flag": "https://restcountries.eu/data/cyp.svg",
        "dialling_code": "+357",
        "isoCode": "196"
    },
    {
        "name": "Czech Republic",
        "code": "CZ",
        "capital": "Prague",
        "region": "EU",
        "currency": {
            "code": "CZK",
            "name": "Czech koruna",
            "symbol": "Kč"
        },
        "language": {
            "code": "cs",
            "name": "Czech"
        },
        "flag": "https://restcountries.eu/data/cze.svg",
        "dialling_code": "+420",
        "isoCode": "203"
    },
    {
        "name": "Denmark",
        "code": "DK",
        "capital": "Copenhagen",
        "region": "EU",
        "currency": {
            "code": "DKK",
            "name": "Danish krone",
            "symbol": "kr"
        },
        "language": {
            "code": "da",
            "name": "Danish"
        },
        "flag": "https://restcountries.eu/data/dnk.svg",
        "dialling_code": "+45",
        "isoCode": "208"
    },
    {
        "name": "Djibouti",
        "code": "DJ",
        "capital": "Djibouti",
        "region": "AF",
        "currency": {
            "code": "DJF",
            "name": "Djiboutian franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/dji.svg",
        "dialling_code": "+253",
        "isoCode": "262"
    },
    {
        "name": "Dominica",
        "code": "DM",
        "capital": "Roseau",
        "region": "NA",
        "currency": {
            "code": "XCD",
            "name": "East Caribbean dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/dma.svg",
        "dialling_code": "+1",
        "isoCode": "212"
    },
    {
        "name": "Dominican Republic",
        "code": "DO",
        "capital": "Santo Domingo",
        "region": "NA",
        "currency": {
            "code": "DOP",
            "name": "Dominican peso",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/dom.svg",
        "dialling_code": "+1",
        "isoCode": "214"
    },
    {
        "name": "Ecuador",
        "code": "EC",
        "capital": "Quito",
        "region": "SA",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/ecu.svg",
        "dialling_code": "+593",
        "isoCode": "218"
    },
    {
        "name": "Egypt",
        "code": "EG",
        "capital": "Cairo",
        "region": "AF",
        "currency": {
            "code": "EGP",
            "name": "Egyptian pound",
            "symbol": "£"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/egy.svg",
        "dialling_code": "+20",
        "isoCode": "818"
    },
    {
        "name": "El Salvador",
        "code": "SV",
        "capital": "San Salvador",
        "region": "NA",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/slv.svg",
        "dialling_code": "+503",
        "isoCode": "222"
    },
    {
        "name": "Equatorial Guinea",
        "code": "GQ",
        "capital": "Malabo",
        "region": "AF",
        "currency": {
            "code": "XAF",
            "name": "Central African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "es",
            "iso639_2": "spa",
            "name": "Spanish",
            "nativeName": "Español"
        },
        "flag": "https://restcountries.eu/data/gnq.svg",
        "dialling_code": "+240",
        "isoCode": "226"
    },
    {
        "name": "Eritrea",
        "code": "ER",
        "capital": "Asmara",
        "region": "AF",
        "currency": {
            "code": "ERN",
            "name": "Eritrean nakfa",
            "symbol": "Nfk"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/eri.svg",
        "dialling_code": "+291",
        "isoCode": "232"
    },
    {
        "name": "Estonia",
        "code": "EE",
        "capital": "Tallinn",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "et",
            "name": "Estonian"
        },
        "flag": "https://restcountries.eu/data/est.svg",
        "dialling_code": "+372",
        "isoCode": "233"
    },
    {
        "name": "Ethiopia",
        "code": "ET",
        "capital": "Addis Ababa",
        "region": "AF",
        "currency": {
            "code": "ETB",
            "name": "Ethiopian birr",
            "symbol": "Br"
        },
        "language": {
            "code": "am",
            "name": "Amharic"
        },
        "flag": "https://restcountries.eu/data/eth.svg",
        "dialling_code": "+251",
        "isoCode": "231"
    },
    {
        "name": "Falkland Islands (Malvinas)",
        "code": "FK",
        "capital": "Stanley",
        "region": "SA",
        "currency": {
            "code": "FKP",
            "name": "Falkland Islands pound",
            "symbol": "£"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/flk.svg",
        "dialling_code": "+500",
        "isoCode": "238"
    },
    {
        "name": "Faroe Islands",
        "code": "FO",
        "capital": "Tórshavn",
        "region": "EU",
        "currency": {
            "code": "DKK",
            "name": "Danish krone",
            "symbol": "kr"
        },
        "language": {
            "code": "fo",
            "name": "Faroese"
        },
        "flag": "https://restcountries.eu/data/fro.svg",
        "dialling_code": "+298",
        "isoCode": "234"
    },
    {
        "name": "Fiji",
        "code": "FJ",
        "capital": "Suva",
        "region": "OC",
        "currency": {
            "code": "FJD",
            "name": "Fijian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/fji.svg",
        "dialling_code": "+679",
        "isoCode": "242"
    },
    {
        "name": "Finland",
        "code": "FI",
        "capital": "Helsinki",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fi",
            "iso639_2": "fin",
            "name": "Finnish",
            "nativeName": "suomi"
        },
        "flag": "https://restcountries.eu/data/fin.svg",
        "dialling_code": "+358",
        "isoCode": "246"
    },
    {
        "name": "France",
        "code": "FR",
        "capital": "Paris",
        "region": "EU",
        "demonym": "French",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/fra.svg",
        "dialling_code": "+33",
        "isoCode": "250"
    },
    {
        "name": "French Guiana",
        "code": "GF",
        "capital": "Cayenne",
        "region": "SA",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/guf.svg",
        "dialling_code": "+594",
        "isoCode": "254"
    },
    {
        "name": "French Polynesia",
        "code": "PF",
        "capital": "Papeetē",
        "region": "OC",
        "currency": {
            "code": "XPF",
            "name": "CFP franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/pyf.svg",
        "dialling_code": "+689",
        "isoCode": "258"
    },
    {
        "name": "Gabon",
        "code": "GA",
        "capital": "Libreville",
        "region": "AF",
        "currency": {
            "code": "XAF",
            "name": "Central African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/gab.svg",
        "dialling_code": "+241",
        "isoCode": "266"
    },
    {
        "name": "Gambia",
        "code": "GM",
        "capital": "Banjul",
        "region": "AF",
        "currency": {
            "code": "GMD",
            "name": "Gambian dalasi",
            "symbol": "D"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/gmb.svg",
        "dialling_code": "+220",
        "isoCode": "270"
    },
    {
        "name": "Georgia",
        "code": "GE",
        "capital": "Tbilisi",
        "region": "AS",
        "currency": {
            "code": "GEL",
            "name": "Georgian Lari",
            "symbol": "ლ"
        },
        "language": {
            "code": "ka",
            "name": "Georgian"
        },
        "flag": "https://restcountries.eu/data/geo.svg",
        "dialling_code": "+995",
        "isoCode": "268"
    },
    {
        "name": "Germany",
        "code": "DE",
        "capital": "Berlin",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "de",
            "name": "German"
        },
        "flag": "https://restcountries.eu/data/deu.svg",
        "dialling_code": "+49",
        "isoCode": "276"
    },
    {
        "name": "Ghana",
        "code": "GH",
        "capital": "Accra",
        "region": "AF",
        "currency": {
            "code": "GHS",
            "name": "Ghanaian cedi",
            "symbol": "₵"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/gha.svg",
        "dialling_code": "+233",
        "isoCode": "288"
    },
    {
        "name": "Gibraltar",
        "code": "GI",
        "capital": "Gibraltar",
        "region": "EU",
        "currency": {
            "code": "GIP",
            "name": "Gibraltar pound",
            "symbol": "£"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/gib.svg",
        "dialling_code": "+350",
        "isoCode": "292"
    },
    {
        "name": "Greece",
        "code": "GR",
        "capital": "Athens",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "el",
            "name": "Greek (modern)"
        },
        "flag": "https://restcountries.eu/data/grc.svg",
        "dialling_code": "+30",
        "isoCode": "300"
    },
    {
        "name": "Greenland",
        "code": "GL",
        "capital": "Nuuk",
        "region": "NA",
        "currency": {
            "code": "DKK",
            "name": "Danish krone",
            "symbol": "kr"
        },
        "language": {
            "code": "kl",
            "name": "Kalaallisut"
        },
        "flag": "https://restcountries.eu/data/grl.svg",
        "dialling_code": "+299",
        "isoCode": "304"
    },
    {
        "name": "Grenada",
        "code": "GD",
        "capital": "St. George's",
        "region": "NA",
        "currency": {
            "code": "XCD",
            "name": "East Caribbean dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/grd.svg",
        "dialling_code": "+1",
        "isoCode": "308"
    },
    {
        "name": "Guadeloupe",
        "code": "GP",
        "capital": "Basse-Terre",
        "region": "NA",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/glp.svg",
        "dialling_code": "+590",
        "isoCode": "312"
    },
    {
        "name": "Guam",
        "code": "GU",
        "capital": "Hagåtña",
        "region": "OC",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/gum.svg",
        "dialling_code": "+1",
        "isoCode": "316"
    },
    {
        "name": "Guatemala",
        "code": "GT",
        "capital": "Guatemala City",
        "region": "NA",
        "currency": {
            "code": "GTQ",
            "name": "Guatemalan quetzal",
            "symbol": "Q"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/gtm.svg",
        "dialling_code": "+502",
        "isoCode": "320"
    },
    {
        "name": "Guinea",
        "code": "GN",
        "capital": "Conakry",
        "region": "AF",
        "currency": {
            "code": "GNF",
            "name": "Guinean franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/gin.svg",
        "dialling_code": "+224",
        "isoCode": "324"
    },
    {
        "name": "Guinea-Bissau",
        "code": "GW",
        "capital": "Bissau",
        "region": "AF",
        "currency": {
            "code": "XOF",
            "name": "West African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "pt",
            "name": "Portuguese"
        },
        "flag": "https://restcountries.eu/data/gnb.svg",
        "dialling_code": "+245",
        "isoCode": "624"
    },
    {
        "name": "Guyana",
        "code": "GY",
        "capital": "Georgetown",
        "region": "SA",
        "currency": {
            "code": "GYD",
            "name": "Guyanese dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/guy.svg",
        "dialling_code": "+592",
        "isoCode": "328"
    },
    {
        "name": "Haiti",
        "code": "HT",
        "capital": "Port-au-Prince",
        "region": "Americas",
        "currency": {
            "code": "HTG",
            "name": "Haitian gourde",
            "symbol": "G"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/hti.svg",
        "dialling_code": "+509",
        "isoCode": "332"
    },
    {
        "name": "Holy See",
        "code": "VA",
        "capital": "Rome",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/vat.svg",
        "dialling_code": "+39",
        "isoCode": "336"
    },
    {
        "name": "Honduras",
        "code": "HN",
        "capital": "Tegucigalpa",
        "region": "NA",
        "currency": {
            "code": "HNL",
            "name": "Honduran lempira",
            "symbol": "L"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/hnd.svg",
        "dialling_code": "+504",
        "isoCode": "340"
    },
    {
        "name": "Hong Kong",
        "code": "HK",
        "capital": "City of Victoria",
        "region": "AS",
        "currency": {
            "code": "HKD",
            "name": "Hong Kong dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/hkg.svg",
        "dialling_code": "+852",
        "isoCode": "344"
    },
    {
        "name": "Hungary",
        "code": "HU",
        "capital": "Budapest",
        "region": "EU",
        "currency": {
            "code": "HUF",
            "name": "Hungarian forint",
            "symbol": "Ft"
        },
        "language": {
            "code": "hu",
            "name": "Hungarian"
        },
        "flag": "https://restcountries.eu/data/hun.svg",
        "dialling_code": "+36",
        "isoCode": "348"
    },
    {
        "name": "Iceland",
        "code": "IS",
        "capital": "Reykjavík",
        "region": "EU",
        "currency": {
            "code": "ISK",
            "name": "Icelandic króna",
            "symbol": "kr"
        },
        "language": {
            "code": "is",
            "name": "Icelandic"
        },
        "flag": "https://restcountries.eu/data/isl.svg",
        "dialling_code": "+354",
        "isoCode": "352"
    },
    {
        "name": "India",
        "code": "IN",
        "capital": "New Delhi",
        "region": "AS",
        "currency": {
            "code": "INR",
            "name": "Indian rupee",
            "symbol": "₹"
        },
        "language": {
            "code": "hi",
            "name": "Hindi"
        },
        "flag": "https://restcountries.eu/data/ind.svg",
        "dialling_code": "+91",
        "isoCode": "356"
    },
    {
        "name": "Indonesia",
        "code": "ID",
        "capital": "Jakarta",
        "region": "AS",
        "currency": {
            "code": "IDR",
            "name": "Indonesian rupiah",
            "symbol": "Rp"
        },
        "language": {
            "code": "id",
            "name": "Indonesian"
        },
        "flag": "https://restcountries.eu/data/idn.svg",
        "dialling_code": "+62",
        "isoCode": "360"
    },
    {
        "name": "Côte d'Ivoire",
        "code": "CI",
        "capital": "Yamoussoukro",
        "region": "AF",
        "currency": {
            "code": "XOF",
            "name": "West African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/civ.svg",
        "dialling_code": "+225",
        "isoCode": "384"
    },
    {
        "name": "Iran (Islamic Republic of)",
        "code": "IR",
        "capital": "Tehran",
        "region": "AS",
        "currency": {
            "code": "IRR",
            "name": "Iranian rial",
            "symbol": "﷼"
        },
        "language": {
            "code": "fa",
            "name": "Persian (Farsi)"
        },
        "flag": "https://restcountries.eu/data/irn.svg",
        "dialling_code": "+98",
        "isoCode": "364"
    },
    {
        "name": "Iraq",
        "code": "IQ",
        "capital": "Baghdad",
        "region": "AS",
        "currency": {
            "code": "IQD",
            "name": "Iraqi dinar",
            "symbol": "ع.د"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/irq.svg",
        "dialling_code": "+964",
        "isoCode": "368"
    },
    {
        "name": "Ireland",
        "code": "IE",
        "capital": "Dublin",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "ga",
            "name": "Irish"
        },
        "flag": "https://restcountries.eu/data/irl.svg",
        "dialling_code": "+353",
        "isoCode": "372"
    },
    {
        "name": "Israel",
        "code": "IL",
        "capital": "Jerusalem",
        "region": "AS",
        "currency": {
            "code": "ILS",
            "name": "Israeli new shekel",
            "symbol": "₪"
        },
        "language": {
            "code": "he",
            "name": "Hebrew (modern)"
        },
        "flag": "https://restcountries.eu/data/isr.svg",
        "dialling_code": "+972",
        "isoCode": "376"
    },
    {
        "name": "Italy",
        "code": "IT",
        "capital": "Rome",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "it",
            "name": "Italian"
        },
        "flag": "https://restcountries.eu/data/ita.svg",
        "dialling_code": "+39",
        "isoCode": "380"
    },
    {
        "name": "Jamaica",
        "code": "JM",
        "capital": "Kingston",
        "region": "NA",
        "currency": {
            "code": "JMD",
            "name": "Jamaican dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/jam.svg",
        "dialling_code": "+1",
        "isoCode": "388"
    },
    {
        "name": "Japan",
        "code": "JP",
        "capital": "Tokyo",
        "region": "AS",
        "currency": {
            "code": "JPY",
            "name": "Japanese yen",
            "symbol": "¥"
        },
        "language": {
            "code": "ja",
            "name": "Japanese"
        },
        "flag": "https://restcountries.eu/data/jpn.svg",
        "dialling_code": "+81",
        "isoCode": "392"
    },
    {
        "name": "Jordan",
        "code": "JO",
        "capital": "Amman",
        "region": "AS",
        "currency": {
            "code": "JOD",
            "name": "Jordanian dinar",
            "symbol": "د.ا"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/jor.svg",
        "dialling_code": "+962",
        "isoCode": "400"
    },
    {
        "name": "Kazakhstan",
        "code": "KZ",
        "capital": "Astana",
        "region": "AS",
        "currency": {
            "code": "KZT",
            "name": "Kazakhstani tenge",
            "symbol": null
        },
        "language": {
            "code": "kk",
            "name": "Kazakh"
        },
        "flag": "https://restcountries.eu/data/kaz.svg",
        "dialling_code": "+7",
        "isoCode": "398"
    },
    {
        "name": "Kenya",
        "code": "KE",
        "capital": "Nairobi",
        "region": "AF",
        "currency": {
            "code": "KES",
            "name": "Kenyan shilling",
            "symbol": "Sh"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/ken.svg",
        "dialling_code": "+254",
        "isoCode": "404"
    },
    {
        "name": "Kiribati",
        "code": "KI",
        "capital": "South Tarawa",
        "region": "OC",
        "currency": {
            "code": "AUD",
            "name": "Australian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/kir.svg",
        "dialling_code": "+686",
        "isoCode": "296"
    },
    {
        "name": "Kuwait",
        "code": "KW",
        "capital": "Kuwait City",
        "region": "AS",
        "currency": {
            "code": "KWD",
            "name": "Kuwaiti dinar",
            "symbol": "د.ك"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/kwt.svg",
        "dialling_code": "+965",
        "isoCode": "414"
    },
    {
        "name": "Kyrgyzstan",
        "code": "KG",
        "capital": "Bishkek",
        "region": "AS",
        "currency": {
            "code": "KGS",
            "name": "Kyrgyzstani som",
            "symbol": "с"
        },
        "language": {
            "code": "ky",
            "name": "Kyrgyz"
        },
        "flag": "https://restcountries.eu/data/kgz.svg",
        "dialling_code": "+996",
        "isoCode": "417"
    },
    {
        "name": "Lao People's Democratic Republic",
        "code": "LA",
        "capital": "Vientiane",
        "region": "AS",
        "currency": {
            "code": "LAK",
            "name": "Lao kip",
            "symbol": "₭"
        },
        "language": {
            "code": "lo",
            "name": "Lao"
        },
        "flag": "https://restcountries.eu/data/lao.svg",
        "dialling_code": "+856",
        "isoCode": "418"
    },
    {
        "name": "Latvia",
        "code": "LV",
        "capital": "Riga",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "lv",
            "name": "Latvian"
        },
        "flag": "https://restcountries.eu/data/lva.svg",
        "dialling_code": "+371",
        "isoCode": "428"
    },
    {
        "name": "Lebanon",
        "code": "LB",
        "capital": "Beirut",
        "region": "AS",
        "currency": {
            "code": "LBP",
            "name": "Lebanese pound",
            "symbol": "ل.ل"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/lbn.svg",
        "dialling_code": "+961",
        "isoCode": "422"
    },
    {
        "name": "Lesotho",
        "code": "LS",
        "capital": "Maseru",
        "region": "AF",
        "currency": {
            "code": "LSL",
            "name": "Lesotho loti",
            "symbol": "L"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/lso.svg",
        "dialling_code": "+266",
        "isoCode": "426"
    },
    {
        "name": "Liberia",
        "code": "LR",
        "capital": "Monrovia",
        "region": "AF",
        "currency": {
            "code": "LRD",
            "name": "Liberian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/lbr.svg",
        "dialling_code": "+231",
        "isoCode": "430"
    },
    {
        "name": "Libya",
        "code": "LY",
        "capital": "Tripoli",
        "region": "AF",
        "currency": {
            "code": "LYD",
            "name": "Libyan dinar",
            "symbol": "ل.د"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/lby.svg",
        "dialling_code": "+218",
        "isoCode": "434"
    },
    {
        "name": "Liechtenstein",
        "code": "LI",
        "capital": "Vaduz",
        "region": "EU",
        "currency": {
            "code": "CHF",
            "name": "Swiss franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "de",
            "name": "German"
        },
        "flag": "https://restcountries.eu/data/lie.svg",
        "dialling_code": "+423",
        "isoCode": "438"
    },
    {
        "name": "Lithuania",
        "code": "LT",
        "capital": "Vilnius",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "lt",
            "name": "Lithuanian"
        },
        "flag": "https://restcountries.eu/data/ltu.svg",
        "dialling_code": "+370",
        "isoCode": "440"
    },
    {
        "name": "Luxembourg",
        "code": "LU",
        "capital": "Luxembourg",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/lux.svg",
        "dialling_code": "+352",
        "isoCode": "442"
    },
    {
        "name": "Macao",
        "code": "MO",
        "capital": "",
        "region": "AS",
        "currency": {
            "code": "MOP",
            "name": "Macanese pataca",
            "symbol": "P"
        },
        "language": {
            "code": "zh",
            "name": "Chinese"
        },
        "flag": "https://restcountries.eu/data/mac.svg",
        "dialling_code": "+853",
        "isoCode": "446"
    },
    {
        "name": "Macedonia (the former Yugoslav Republic of)",
        "code": "MK",
        "capital": "Skopje",
        "region": "EU",
        "currency": {
            "code": "MKD",
            "name": "Macedonian denar",
            "symbol": "ден"
        },
        "language": {
            "code": "mk",
            "name": "Macedonian"
        },
        "flag": "https://restcountries.eu/data/mkd.svg",
        "dialling_code": "+389",
        "isoCode": "807"
    },
    {
        "name": "Madagascar",
        "code": "MG",
        "capital": "Antananarivo",
        "region": "AF",
        "currency": {
            "code": "MGA",
            "name": "Malagasy ariary",
            "symbol": "Ar"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/mdg.svg",
        "dialling_code": "+261",
        "isoCode": "450"
    },
    {
        "name": "Malawi",
        "code": "MW",
        "capital": "Lilongwe",
        "region": "AF",
        "currency": {
            "code": "MWK",
            "name": "Malawian kwacha",
            "symbol": "MK"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/mwi.svg",
        "dialling_code": "+265",
        "isoCode": "454"
    },
    {
        "name": "Malaysia",
        "code": "MY",
        "capital": "Kuala Lumpur",
        "region": "AS",
        "currency": {
            "code": "MYR",
            "name": "Malaysian ringgit",
            "symbol": "RM"
        },
        "language": {
            "code": null,
            "name": "Malaysian"
        },
        "flag": "https://restcountries.eu/data/mys.svg",
        "dialling_code": "+60",
        "isoCode": "458"
    },
    {
        "name": "Maldives",
        "code": "MV",
        "capital": "Malé",
        "region": "AS",
        "currency": {
            "code": "MVR",
            "name": "Maldivian rufiyaa",
            "symbol": ".ރ"
        },
        "language": {
            "code": "dv",
            "name": "Divehi"
        },
        "flag": "https://restcountries.eu/data/mdv.svg",
        "dialling_code": "+960",
        "isoCode": "462"
    },
    {
        "name": "Mali",
        "code": "ML",
        "capital": "Bamako",
        "region": "AF",
        "currency": {
            "code": "XOF",
            "name": "West African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/mli.svg",
        "dialling_code": "+223",
        "isoCode": "466"
    },
    {
        "name": "Malta",
        "code": "MT",
        "capital": "Valletta",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "mt",
            "name": "Maltese"
        },
        "flag": "https://restcountries.eu/data/mlt.svg",
        "dialling_code": "+356",
        "isoCode": "470"
    },
    {
        "name": "Marshall Islands",
        "code": "MH",
        "capital": "Majuro",
        "region": "OC",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/mhl.svg",
        "dialling_code": "+692",
        "isoCode": "584"
    },
    {
        "name": "Martinique",
        "code": "MQ",
        "capital": "Fort-de-France",
        "region": "Americas",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/mtq.svg",
        "dialling_code": "+596",
        "isoCode": "474"
    },
    {
        "name": "Mauritania",
        "code": "MR",
        "capital": "Nouakchott",
        "region": "AF",
        "currency": {
            "code": "MRO",
            "name": "Mauritanian ouguiya",
            "symbol": "UM"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/mrt.svg",
        "dialling_code": "+222",
        "isoCode": "478"
    },
    {
        "name": "Mauritius",
        "code": "MU",
        "capital": "Port Louis",
        "region": "AF",
        "currency": {
            "code": "MUR",
            "name": "Mauritian rupee",
            "symbol": "₨"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/mus.svg",
        "dialling_code": "+230",
        "isoCode": "480"
    },
    {
        "name": "Mayotte",
        "code": "YT",
        "capital": "Mamoudzou",
        "region": "AF",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/myt.svg",
        "dialling_code": "+262",
        "isoCode": "175"
    },
    {
        "name": "Mexico",
        "code": "MX",
        "capital": "Mexico City",
        "region": "NA",
        "currency": {
            "code": "MXN",
            "name": "Mexican peso",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/mex.svg",
        "dialling_code": "+52",
        "isoCode": "484"
    },
    {
        "name": "Micronesia (Federated States of)",
        "code": "FM",
        "capital": "Palikir",
        "region": "OC",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/fsm.svg",
        "dialling_code": "+691",
        "isoCode": "583"
    },
    {
        "name": "Moldova (Republic of)",
        "code": "MD",
        "capital": "Chișinău",
        "region": "EU",
        "currency": {
            "code": "MDL",
            "name": "Moldovan leu",
            "symbol": "L"
        },
        "language": {
            "code": "ro",
            "name": "Romanian"
        },
        "flag": "https://restcountries.eu/data/mda.svg",
        "dialling_code": "+373",
        "isoCode": "498"
    },
    {
        "name": "Monaco",
        "code": "MC",
        "capital": "Monaco",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/mco.svg",
        "dialling_code": "+377",
        "isoCode": "492"
    },
    {
        "name": "Mongolia",
        "code": "MN",
        "capital": "Ulan Bator",
        "region": "AS",
        "currency": {
            "code": "MNT",
            "name": "Mongolian tögrög",
            "symbol": "₮"
        },
        "language": {
            "code": "mn",
            "name": "Mongolian"
        },
        "flag": "https://restcountries.eu/data/mng.svg",
        "dialling_code": "+976",
        "isoCode": "496"
    },
    {
        "name": "Montenegro",
        "code": "ME",
        "capital": "Podgorica",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "sr",
            "name": "Serbian"
        },
        "flag": "https://restcountries.eu/data/mne.svg",
        "dialling_code": "+382",
        "isoCode": "499"
    },
    {
        "name": "Montserrat",
        "code": "MS",
        "capital": "Plymouth",
        "region": "NA",
        "currency": {
            "code": "XCD",
            "name": "East Caribbean dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/msr.svg",
        "dialling_code": "+1",
        "isoCode": "500"
    },
    {
        "name": "Morocco",
        "code": "MA",
        "capital": "Rabat",
        "region": "AF",
        "currency": {
            "code": "MAD",
            "name": "Moroccan dirham",
            "symbol": "د.م."
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/mar.svg",
        "dialling_code": "+212",
        "isoCode": "504"
    },
    {
        "name": "Mozambique",
        "code": "MZ",
        "capital": "Maputo",
        "region": "AF",
        "currency": {
            "code": "MZN",
            "name": "Mozambican metical",
            "symbol": "MT"
        },
        "language": {
            "code": "pt",
            "name": "Portuguese"
        },
        "flag": "https://restcountries.eu/data/moz.svg",
        "dialling_code": "+258",
        "isoCode": "508"
    },
    {
        "name": "Myanmar",
        "code": "MM",
        "capital": "Naypyidaw",
        "region": "AS",
        "currency": {
            "code": "MMK",
            "name": "Burmese kyat",
            "symbol": "Ks"
        },
        "language": {
            "code": "my",
            "name": "Burmese"
        },
        "flag": "https://restcountries.eu/data/mmr.svg",
        "dialling_code": "+95",
        "isoCode": "104"
    },
    {
        "name": "Namibia",
        "code": "NA",
        "capital": "Windhoek",
        "region": "AF",
        "currency": {
            "code": "NAD",
            "name": "Namibian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/nam.svg",
        "dialling_code": "+264",
        "isoCode": "516"
    },
    {
        "name": "Nauru",
        "code": "NR",
        "capital": "Yaren",
        "region": "OC",
        "currency": {
            "code": "AUD",
            "name": "Australian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/nru.svg",
        "dialling_code": "+674",
        "isoCode": "520"
    },
    {
        "name": "Nepal",
        "code": "NP",
        "capital": "Kathmandu",
        "region": "AS",
        "currency": {
            "code": "NPR",
            "name": "Nepalese rupee",
            "symbol": "₨"
        },
        "language": {
            "code": "ne",
            "name": "Nepali"
        },
        "flag": "https://restcountries.eu/data/npl.svg",
        "dialling_code": "+977",
        "isoCode": "524"
    },
    {
        "name": "Netherlands",
        "code": "NL",
        "capital": "Amsterdam",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "nl",
            "name": "Dutch"
        },
        "flag": "https://restcountries.eu/data/nld.svg",
        "dialling_code": "+31",
        "isoCode": "528"
    },
    {
        "name": "New Caledonia",
        "code": "NC",
        "capital": "Nouméa",
        "region": "OC",
        "currency": {
            "code": "XPF",
            "name": "CFP franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/ncl.svg",
        "dialling_code": "+687",
        "isoCode": "540"
    },
    {
        "name": "New Zealand",
        "code": "NZ",
        "capital": "Wellington",
        "region": "OC",
        "currency": {
            "code": "NZD",
            "name": "New Zealand dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/nzl.svg",
        "dialling_code": "+64",
        "isoCode": "554"
    },
    {
        "name": "Nicaragua",
        "code": "NI",
        "capital": "Managua",
        "region": "NA",
        "currency": {
            "code": "NIO",
            "name": "Nicaraguan córdoba",
            "symbol": "C$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/nic.svg",
        "dialling_code": "+505",
        "isoCode": "558"
    },
    {
        "name": "Niger",
        "code": "NE",
        "capital": "Niamey",
        "region": "AF",
        "currency": {
            "code": "XOF",
            "name": "West African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/ner.svg",
        "dialling_code": "+227",
        "isoCode": "562"
    },
    {
        "name": "Nigeria",
        "code": "NG",
        "capital": "Abuja",
        "region": "AF",
        "currency": {
            "code": "NGN",
            "name": "Nigerian naira",
            "symbol": "₦"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/nga.svg",
        "dialling_code": "+234",
        "isoCode": "566"
    },
    {
        "name": "Niue",
        "code": "NU",
        "capital": "Alofi",
        "region": "OC",
        "currency": {
            "code": "NZD",
            "name": "New Zealand dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/niu.svg",
        "dialling_code": "+683",
        "isoCode": "570"
    },
    {
        "name": "Norfolk Island",
        "code": "NF",
        "capital": "Kingston",
        "region": "OC",
        "currency": {
            "code": "AUD",
            "name": "Australian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/nfk.svg",
        "dialling_code": "+672",
        "isoCode": "574"
    },
    {
        "name": "Korea (Democratic People's Republic of)",
        "code": "KP",
        "capital": "Pyongyang",
        "region": "AS",
        "currency": {
            "code": "KPW",
            "name": "North Korean won",
            "symbol": "₩"
        },
        "language": {
            "code": "ko",
            "name": "Korean"
        },
        "flag": "https://restcountries.eu/data/prk.svg",
        "dialling_code": "+850",
        "isoCode": "408"
    },
    {
        "name": "Northern Mariana Islands",
        "code": "MP",
        "capital": "Saipan",
        "region": "OC",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/mnp.svg",
        "dialling_code": "+1",
        "isoCode": "580"
    },
    {
        "name": "Norway",
        "code": "NO",
        "capital": "Oslo",
        "region": "EU",
        "currency": {
            "code": "NOK",
            "name": "Norwegian krone",
            "symbol": "kr"
        },
        "language": {
            "code": "no",
            "name": "Norwegian"
        },
        "flag": "https://restcountries.eu/data/nor.svg",
        "dialling_code": "+47",
        "isoCode": "578"
    },
    {
        "name": "Oman",
        "code": "OM",
        "capital": "Muscat",
        "region": "AS",
        "currency": {
            "code": "OMR",
            "name": "Omani rial",
            "symbol": "ر.ع."
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/omn.svg",
        "dialling_code": "+968",
        "isoCode": "512"
    },
    {
        "name": "Pakistan",
        "code": "PK",
        "capital": "Islamabad",
        "region": "AS",
        "currency": {
            "code": "PKR",
            "name": "Pakistani rupee",
            "symbol": "₨"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/pak.svg",
        "dialling_code": "+92",
        "isoCode": "586"
    },
    {
        "name": "Palau",
        "code": "PW",
        "capital": "Ngerulmud",
        "region": "OC",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/plw.svg",
        "dialling_code": "+680",
        "isoCode": "585"
    },
    {
        "name": "Palestine, State of",
        "code": "PS",
        "capital": "Ramallah",
        "region": "AS",
        "currency": {
            "code": "ILS",
            "name": "Israeli new sheqel",
            "symbol": "₪"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/pse.svg",
        "dialling_code": "+970",
        "isoCode": "275"
    },
    {
        "name": "Panama",
        "code": "PA",
        "capital": "Panama City",
        "region": "NA",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/pan.svg",
        "dialling_code": "+507",
        "isoCode": "591"
    },
    {
        "name": "Papua New Guinea",
        "code": "PG",
        "capital": "Port Moresby",
        "region": "OC",
        "currency": {
            "code": "PGK",
            "name": "Papua New Guinean kina",
            "symbol": "K"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/png.svg",
        "dialling_code": "+675",
        "isoCode": "598"
    },
    {
        "name": "Paraguay",
        "code": "PY",
        "capital": "Asunción",
        "region": "SA",
        "currency": {
            "code": "PYG",
            "name": "Paraguayan guaraní",
            "symbol": "₲"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/pry.svg",
        "dialling_code": "+595",
        "isoCode": "600"
    },
    {
        "name": "Peru",
        "code": "PE",
        "capital": "Lima",
        "region": "SA",
        "currency": {
            "code": "PEN",
            "name": "Peruvian sol",
            "symbol": "S/."
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/per.svg",
        "dialling_code": "+51",
        "isoCode": "604"
    },
    {
        "name": "Philippines",
        "code": "PH",
        "capital": "Manila",
        "region": "AS",
        "currency": {
            "code": "PHP",
            "name": "Philippine peso",
            "symbol": "₱"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/phl.svg",
        "dialling_code": "+63",
        "isoCode": "608"
    },
    {
        "name": "Poland",
        "code": "PL",
        "capital": "Warsaw",
        "region": "EU",
        "currency": {
            "code": "PLN",
            "name": "Polish złoty",
            "symbol": "zł"
        },
        "language": {
            "code": "pl",
            "name": "Polish"
        },
        "flag": "https://restcountries.eu/data/pol.svg",
        "dialling_code": "+48",
        "isoCode": "616"
    },
    {
        "name": "Portugal",
        "code": "PT",
        "capital": "Lisbon",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "pt",
            "name": "Portuguese"
        },
        "flag": "https://restcountries.eu/data/prt.svg",
        "dialling_code": "+351",
        "isoCode": "620"
    },
    {
        "name": "Puerto Rico",
        "code": "PR",
        "capital": "San Juan",
        "region": "NA",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/pri.svg",
        "dialling_code": "+1",
        "isoCode": "630"
    },
    {
        "name": "Qatar",
        "code": "QA",
        "capital": "Doha",
        "region": "AS",
        "currency": {
            "code": "QAR",
            "name": "Qatari riyal",
            "symbol": "ر.ق"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/qat.svg",
        "dialling_code": "+974",
        "isoCode": "634"
    },
    {
        "name": "Republic of Kosovo",
        "code": "XK",
        "capital": "Pristina",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "sq",
            "name": "Albanian"
        },
        "flag": "https://restcountries.eu/data/kos.svg",
        "dialling_code": "+381",
        "isoCode": "383"
    },
    {
        "name": "Réunion",
        "code": "RE",
        "capital": "Saint-Denis",
        "region": "AF",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/reu.svg",
        "dialling_code": "+262",
        "isoCode": "638"
    },
    {
        "name": "Romania",
        "code": "RO",
        "capital": "Bucharest",
        "region": "EU",
        "currency": {
            "code": "RON",
            "name": "Romanian leu",
            "symbol": "lei"
        },
        "language": {
            "code": "ro",
            "name": "Romanian"
        },
        "flag": "https://restcountries.eu/data/rou.svg",
        "dialling_code": "+40",
        "isoCode": "642"
    },
    {
        "name": "Russian Federation",
        "code": "RU",
        "capital": "Moscow",
        "region": "EU",
        "currency": {
            "code": "RUB",
            "name": "Russian ruble",
            "symbol": "₽"
        },
        "language": {
            "code": "ru",
            "name": "Russian"
        },
        "flag": "https://restcountries.eu/data/rus.svg",
        "dialling_code": "+7",
        "isoCode": "643"
    },
    {
        "name": "Rwanda",
        "code": "RW",
        "capital": "Kigali",
        "region": "AF",
        "currency": {
            "code": "RWF",
            "name": "Rwandan franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "rw",
            "name": "Kinyarwanda"
        },
        "flag": "https://restcountries.eu/data/rwa.svg",
        "dialling_code": "+250",
        "isoCode": "646"
    },
    {
        "name": "Saint Barthélemy",
        "code": "BL",
        "capital": "Gustavia",
        "region": "NA",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/blm.svg",
        "dialling_code": "+590",
        "isoCode": "652"
    },
    {
        "name": "Saint Helena, Ascension and Tristan da Cunha",
        "code": "SH",
        "capital": "Jamestown",
        "region": "AF",
        "currency": {
            "code": "SHP",
            "name": "Saint Helena pound",
            "symbol": "£"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/shn.svg",
        "dialling_code": "+290",
        "isoCode": "654"
    },
    {
        "name": "Saint Kitts and Nevis",
        "code": "KN",
        "capital": "Basseterre",
        "region": "NA",
        "currency": {
            "code": "XCD",
            "name": "East Caribbean dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/kna.svg",
        "dialling_code": "+1",
        "isoCode": "659"
    },
    {
        "name": "Saint Lucia",
        "code": "LC",
        "capital": "Castries",
        "region": "NA",
        "currency": {
            "code": "XCD",
            "name": "East Caribbean dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/lca.svg",
        "dialling_code": "+1",
        "isoCode": "662"
    },
    {
        "name": "Saint Martin (French part)",
        "code": "MF",
        "capital": "Marigot",
        "region": "NA",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/maf.svg",
        "dialling_code": "+590",
        "isoCode": "663"
    },
    {
        "name": "Saint Pierre and Miquelon",
        "code": "PM",
        "capital": "Saint-Pierre",
        "region": "NA",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/spm.svg",
        "dialling_code": "+508",
        "isoCode": "666"
    },
    {
        "name": "Saint Vincent and the Grenadines",
        "code": "VC",
        "capital": "Kingstown",
        "region": "NA",
        "currency": {
            "code": "XCD",
            "name": "East Caribbean dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/vct.svg",
        "dialling_code": "+1",
        "isoCode": "670"
    },
    {
        "name": "Samoa",
        "code": "WS",
        "capital": "Apia",
        "region": "OC",
        "currency": {
            "code": "WST",
            "name": "Samoan tālā",
            "symbol": "T"
        },
        "language": {
            "code": "sm",
            "name": "Samoan"
        },
        "flag": "https://restcountries.eu/data/wsm.svg",
        "dialling_code": "+685",
        "isoCode": "882"
    },
    {
        "name": "San Marino",
        "code": "SM",
        "capital": "City of San Marino",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "it",
            "name": "Italian"
        },
        "flag": "https://restcountries.eu/data/smr.svg",
        "dialling_code": "+378",
        "isoCode": "674"
    },
    {
        "name": "Sao Tome and Principe",
        "code": "ST",
        "capital": "São Tomé",
        "region": "AF",
        "currency": {
            "code": "STD",
            "name": "São Tomé and Príncipe dobra",
            "symbol": "Db"
        },
        "language": {
            "code": "pt",
            "name": "Portuguese"
        },
        "flag": "https://restcountries.eu/data/stp.svg",
        "dialling_code": "+239",
        "isoCode": "678"
    },
    {
        "name": "Saudi Arabia",
        "code": "SA",
        "capital": "Riyadh",
        "region": "AS",
        "currency": {
            "code": "SAR",
            "name": "Saudi riyal",
            "symbol": "ر.س"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/sau.svg",
        "dialling_code": "+966",
        "isoCode": "682"
    },
    {
        "name": "Senegal",
        "code": "SN",
        "capital": "Dakar",
        "region": "AF",
        "currency": {
            "code": "XOF",
            "name": "West African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/sen.svg",
        "dialling_code": "+221",
        "isoCode": "686"
    },
    {
        "name": "Serbia",
        "code": "RS",
        "capital": "Belgrade",
        "region": "EU",
        "currency": {
            "code": "RSD",
            "name": "Serbian dinar",
            "symbol": "дин."
        },
        "language": {
            "code": "sr",
            "name": "Serbian"
        },
        "flag": "https://restcountries.eu/data/srb.svg",
        "dialling_code": "+381",
        "isoCode": "688"
    },
    {
        "name": "Seychelles",
        "code": "SC",
        "capital": "Victoria",
        "region": "AF",
        "currency": {
            "code": "SCR",
            "name": "Seychellois rupee",
            "symbol": "₨"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/syc.svg",
        "dialling_code": "+248",
        "isoCode": "690"
    },
    {
        "name": "Sierra Leone",
        "code": "SL",
        "capital": "Freetown",
        "region": "AF",
        "currency": {
            "code": "SLL",
            "name": "Sierra Leonean leone",
            "symbol": "Le"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/sle.svg",
        "dialling_code": "+232",
        "isoCode": "694"
    },
    {
        "name": "Singapore",
        "code": "SG",
        "capital": "Singapore",
        "region": "AS",
        "currency": {
            "code": "SGD",
            "name": "Singapore dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/sgp.svg",
        "dialling_code": "+65",
        "isoCode": "702"
    },
    {
        "name": "Singapore",
        "code": "SG",
        "capital": "Singapore",
        "region": "AS",
        "currency": {
            "code": "SGD",
            "name": "Singapore dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/sgp.svg",
        "dialling_code": "+65",
        "isoCode": "702"
    },
    {
        "name": "Slovakia",
        "code": "SK",
        "capital": "Bratislava",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "sk",
            "name": "Slovak"
        },
        "flag": "https://restcountries.eu/data/svk.svg",
        "dialling_code": "+421",
        "isoCode": "703"
    },
    {
        "name": "Slovenia",
        "code": "SI",
        "capital": "Ljubljana",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "sl",
            "name": "Slovene"
        },
        "flag": "https://restcountries.eu/data/svn.svg",
        "dialling_code": "+386",
        "isoCode": "705"
    },
    {
        "name": "Solomon Islands",
        "code": "SB",
        "capital": "Honiara",
        "region": "OC",
        "currency": {
            "code": "SBD",
            "name": "Solomon Islands dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/slb.svg",
        "dialling_code": "+677",
        "isoCode": "090"
    },
    {
        "name": "Somalia",
        "code": "SO",
        "capital": "Mogadishu",
        "region": "AF",
        "currency": {
            "code": "SOS",
            "name": "Somali shilling",
            "symbol": "Sh"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/som.svg",
        "dialling_code": "+252",
        "isoCode": "706"
    },
    {
        "name": "South Africa",
        "code": "ZA",
        "capital": "Pretoria",
        "region": "AF",
        "currency": {
            "code": "ZAR",
            "name": "South African rand",
            "symbol": "R"
        },
        "language": {
            "code": "en",
            "iso639_2": "eng",
            "name": "English",
            "nativeName": "English"
        },
        "flag": "https://restcountries.eu/data/zaf.svg",
        "dialling_code": "+27",
        "isoCode": "710"
    },
    {
        "name": "Korea (Republic of)",
        "code": "KR",
        "capital": "Seoul",
        "region": "AS",
        "currency": {
            "code": "KRW",
            "name": "South Korean won",
            "symbol": "₩"
        },
        "language": {
            "code": "ko",
            "name": "Korean"
        },
        "flag": "https://restcountries.eu/data/kor.svg",
        "dialling_code": "+82",
        "isoCode": "410"
    },
    {
        "name": "Spain",
        "code": "ES",
        "capital": "Madrid",
        "region": "EU",
        "currency": {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/esp.svg",
        "dialling_code": "+34",
        "isoCode": "724"
    },
    {
        "name": "Sri Lanka",
        "code": "LK",
        "capital": "Colombo",
        "region": "AS",
        "currency": {
            "code": "LKR",
            "name": "Sri Lankan rupee",
            "symbol": "Rs"
        },
        "language": {
            "code": "si",
            "iso639_2": "sin",
            "name": "Sinhalese",
            "nativeName": "සිංහල"
        },
        "flag": "https://restcountries.eu/data/lka.svg",
        "dialling_code": "+94",
        "isoCode": "144"
    },
    {
        "name": "Sudan",
        "code": "SD",
        "capital": "Khartoum",
        "region": "AF",
        "currency": {
            "code": "SDG",
            "name": "Sudanese pound",
            "symbol": "ج.س."
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/sdn.svg",
        "dialling_code": "+249",
        "isoCode": "729"
    },
    {
        "name": "Suriname",
        "code": "SR",
        "capital": "Paramaribo",
        "region": "SA",
        "currency": {
            "code": "SRD",
            "name": "Surinamese dollar",
            "symbol": "$"
        },
        "language": {
            "code": "nl",
            "name": "Dutch"
        },
        "flag": "https://restcountries.eu/data/sur.svg",
        "dialling_code": "+597",
        "isoCode": "740"
    },
    {
        "name": "Swaziland",
        "code": "SZ",
        "capital": "Lobamba",
        "region": "AF",
        "currency": {
            "code": "SZL",
            "name": "Swazi lilangeni",
            "symbol": "L"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/swz.svg",
        "dialling_code": "+268",
        "isoCode": "748"
    },
    {
        "name": "Sweden",
        "code": "SE",
        "capital": "Stockholm",
        "region": "EU",
        "currency": {
            "code": "SEK",
            "name": "Swedish krona",
            "symbol": "kr"
        },
        "language": {
            "code": "sv",
            "name": "Swedish"
        },
        "flag": "https://restcountries.eu/data/swe.svg",
        "dialling_code": "+46",
        "isoCode": "752"
    },
    {
        "name": "Switzerland",
        "code": "CH",
        "capital": "Bern",
        "region": "EU",
        "currency": {
            "code": "CHF",
            "name": "Swiss franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "de",
            "name": "German"
        },
        "flag": "https://restcountries.eu/data/che.svg",
        "dialling_code": "+41",
        "isoCode": "756"
    },
    {
        "name": "Syrian Arab Republic",
        "code": "SY",
        "capital": "Damascus",
        "region": "AS",
        "currency": {
            "code": "SYP",
            "name": "Syrian pound",
            "symbol": "£"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/syr.svg",
        "dialling_code": "+963",
        "isoCode": "760"
    },
    {
        "name": "Taiwan",
        "code": "TW",
        "capital": "Taipei",
        "region": "AS",
        "currency": {
            "code": "TWD",
            "name": "New Taiwan dollar",
            "symbol": "$"
        },
        "language": {
            "code": "zh",
            "name": "Chinese"
        },
        "flag": "https://restcountries.eu/data/twn.svg",
        "dialling_code": "+886",
        "isoCode": "158"
    },
    {
        "name": "Tajikistan",
        "code": "TJ",
        "capital": "Dushanbe",
        "region": "AS",
        "currency": {
            "code": "TJS",
            "name": "Tajikistani somoni",
            "symbol": "ЅМ"
        },
        "language": {
            "code": "tg",
            "name": "Tajik"
        },
        "flag": "https://restcountries.eu/data/tjk.svg",
        "dialling_code": "+992",
        "isoCode": "762"
    },
    {
        "name": "Tanzania, United Republic of",
        "code": "TZ",
        "capital": "Dodoma",
        "region": "AF",
        "currency": {
            "code": "TZS",
            "name": "Tanzanian shilling",
            "symbol": "Sh"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/tza.svg",
        "dialling_code": "+255",
        "isoCode": "834"
    },
    {
        "name": "Thailand",
        "code": "TH",
        "capital": "Bangkok",
        "region": "AS",
        "currency": {
            "code": "THB",
            "name": "Thai baht",
            "symbol": "฿"
        },
        "language": {
            "code": "th",
            "name": "Thai"
        },
        "flag": "https://restcountries.eu/data/tha.svg",
        "dialling_code": "+66",
        "isoCode": "764"
    },
    {
        "name": "Timor-Leste",
        "code": "TL",
        "capital": "Dili",
        "region": "AS",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "pt",
            "name": "Portuguese"
        },
        "flag": "https://restcountries.eu/data/tls.svg",
        "dialling_code": "+670",
        "isoCode": "626"
    },
    {
        "name": "Togo",
        "code": "TG",
        "capital": "Lomé",
        "region": "AF",
        "currency": {
            "code": "XOF",
            "name": "West African CFA franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/tgo.svg",
        "dialling_code": "+228",
        "isoCode": "768"
    },
    {
        "name": "Tokelau",
        "code": "TK",
        "capital": "Fakaofo",
        "region": "OC",
        "currency": {
            "code": "NZD",
            "name": "New Zealand dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/tkl.svg",
        "dialling_code": "+690",
        "isoCode": "772"
    },
    {
        "name": "Tonga",
        "code": "TO",
        "capital": "Nuku'alofa",
        "region": "OC",
        "currency": {
            "code": "TOP",
            "name": "Tongan paʻanga",
            "symbol": "T$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/ton.svg",
        "dialling_code": "+676",
        "isoCode": "776"
    },
    {
        "name": "Trinidad and Tobago",
        "code": "TT",
        "capital": "Port of Spain",
        "region": "SA",
        "currency": {
            "code": "TTD",
            "name": "Trinidad and Tobago dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/tto.svg",
        "dialling_code": "+1",
        "isoCode": "780"
    },
    {
        "name": "Tunisia",
        "code": "TN",
        "capital": "Tunis",
        "region": "AF",
        "currency": {
            "code": "TND",
            "name": "Tunisian dinar",
            "symbol": "د.ت"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/tun.svg",
        "dialling_code": "+216",
        "isoCode": "788"
    },
    {
        "name": "Turkey",
        "code": "TR",
        "capital": "Ankara",
        "region": "AS",
        "currency": {
            "code": "TRY",
            "name": "Turkish lira",
            "symbol": null
        },
        "language": {
            "code": "tr",
            "name": "Turkish"
        },
        "flag": "https://restcountries.eu/data/tur.svg",
        "dialling_code": "+90",
        "isoCode": "792"
    },
    {
        "name": "Turkmenistan",
        "code": "TM",
        "capital": "Ashgabat",
        "region": "AS",
        "currency": {
            "code": "TMT",
            "name": "Turkmenistan manat",
            "symbol": "m"
        },
        "language": {
            "code": "tk",
            "name": "Turkmen"
        },
        "flag": "https://restcountries.eu/data/tkm.svg",
        "dialling_code": "+993",
        "isoCode": "795"
    },
    {
        "name": "Turks and Caicos Islands",
        "code": "TC",
        "capital": "Cockburn Town",
        "region": "NA",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/tca.svg",
        "dialling_code": "+1",
        "isoCode": "796"
    },
    {
        "name": "Tuvalu",
        "code": "TV",
        "capital": "Funafuti",
        "region": "OC",
        "currency": {
            "code": "AUD",
            "name": "Australian dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/tuv.svg",
        "dialling_code": "+688",
        "isoCode": "798"
    },
    {
        "name": "Uganda",
        "code": "UG",
        "capital": "Kampala",
        "region": "AF",
        "currency": {
            "code": "UGX",
            "name": "Ugandan shilling",
            "symbol": "Sh"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/uga.svg",
        "dialling_code": "+256",
        "isoCode": "800"
    },
    {
        "name": "Ukraine",
        "code": "UA",
        "capital": "Kiev",
        "region": "EU",
        "currency": {
            "code": "UAH",
            "name": "Ukrainian hryvnia",
            "symbol": "₴"
        },
        "language": {
            "code": "uk",
            "name": "Ukrainian"
        },
        "flag": "https://restcountries.eu/data/ukr.svg",
        "dialling_code": "+380",
        "isoCode": "804"
    },
    {
        "name": "United Arab Emirates",
        "code": "AE",
        "capital": "Abu Dhabi",
        "region": "AS",
        "currency": {
            "code": "AED",
            "name": "United Arab Emirates dirham",
            "symbol": "د.إ"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/are.svg",
        "dialling_code": "+971",
        "isoCode": "784"
    },
    {
        "name": "United Kingdom of Great Britain and Northern Ireland",
        "code": "GB",
        "capital": "London",
        "region": "EU",
        "currency": {
            "code": "GBP",
            "name": "British pound",
            "symbol": "£"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/gbr.svg",
        "dialling_code": "+44",
        "isoCode": "826"
    },
    {
        "name": "United States of America",
        "code": "US",
        "capital": "Washington, D.C.",
        "region": "NA",
        "currency": {
            "code": "USD",
            "name": "United States dollar",
            "symbol": "$"
        },
        "language": {
            "code": "en",
            "iso639_2": "eng",
            "name": "English",
            "nativeName": "English"
        },
        "flag": "https://restcountries.eu/data/usa.svg",
        "dialling_code": "+1",
        "isoCode": "840"
    },
    {
        "name": "Uruguay",
        "code": "UY",
        "capital": "Montevideo",
        "region": "SA",
        "currency": {
            "code": "UYU",
            "name": "Uruguayan peso",
            "symbol": "$"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/ury.svg",
        "dialling_code": "+598",
        "isoCode": "858"
    },
    {
        "name": "Uzbekistan",
        "code": "UZ",
        "capital": "Tashkent",
        "region": "AS",
        "currency": {
            "code": "UZS",
            "name": "Uzbekistani so'm",
            "symbol": null
        },
        "language": {
            "code": "uz",
            "name": "Uzbek"
        },
        "flag": "https://restcountries.eu/data/uzb.svg",
        "dialling_code": "+998",
        "isoCode": "860"
    },
    {
        "name": "Vanuatu",
        "code": "VU",
        "capital": "Port Vila",
        "region": "OC",
        "currency": {
            "code": "VUV",
            "name": "Vanuatu vatu",
            "symbol": "Vt"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/vut.svg",
        "dialling_code": "+678",
        "isoCode": "548"
    },
    {
        "name": "Venezuela (Bolivarian Republic of)",
        "code": "VE",
        "capital": "Caracas",
        "region": "SA",
        "currency": {
            "code": "VEF",
            "name": "Venezuelan bolívar",
            "symbol": "Bs F"
        },
        "language": {
            "code": "es",
            "name": "Spanish"
        },
        "flag": "https://restcountries.eu/data/ven.svg",
        "dialling_code": "+58",
        "isoCode": "862"
    },
    {
        "name": "Viet Nam",
        "code": "VN",
        "capital": "Hanoi",
        "region": "AS",
        "currency": {
            "code": "VND",
            "name": "Vietnamese đồng",
            "symbol": "₫"
        },
        "language": {
            "code": "vi",
            "name": "Vietnamese"
        },
        "flag": "https://restcountries.eu/data/vnm.svg",
        "dialling_code": "+84",
        "isoCode": "704"
    },
    {
        "name": "Wallis and Futuna",
        "code": "WF",
        "capital": "Mata-Utu",
        "region": "OC",
        "currency": {
            "code": "XPF",
            "name": "CFP franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/wlf.svg",
        "dialling_code": "+681",
        "isoCode": "876"
    },
    {
        "name": "Wallis and Futuna",
        "code": "WF",
        "capital": "Mata-Utu",
        "region": "OC",
        "currency": {
            "code": "XPF",
            "name": "CFP franc",
            "symbol": "Fr"
        },
        "language": {
            "code": "fr",
            "name": "French"
        },
        "flag": "https://restcountries.eu/data/wlf.svg",
        "dialling_code": "+681",
        "isoCode": "876"
    },
    {
        "name": "Yemen",
        "code": "YE",
        "capital": "Sana'a",
        "region": "AS",
        "currency": {
            "code": "YER",
            "name": "Yemeni rial",
            "symbol": "﷼"
        },
        "language": {
            "code": "ar",
            "name": "Arabic"
        },
        "flag": "https://restcountries.eu/data/yem.svg",
        "dialling_code": "+967",
        "isoCode": "887"
    },
    {
        "name": "Zambia",
        "code": "ZM",
        "capital": "Lusaka",
        "region": "AF",
        "currency": {
            "code": "ZMW",
            "name": "Zambian kwacha",
            "symbol": "ZK"
        },
        "language": {
            "code": "en",
            "name": "English"
        },
        "flag": "https://restcountries.eu/data/zmb.svg",
        "dialling_code": "+260",
        "isoCode": "894"
    },
    {
        "name": "Zimbabwe",
        "code": "ZW",
        "capital": "Harare",
        "region": "AF",
        "currency": {
            "code": "BWP",
            "name": "Botswana pula",
            "symbol": "P"
        },
        "language": {
            "code": "en",
            "iso639_2": "eng",
            "name": "English",
            "nativeName": "English"
        },
        "flag": "https://restcountries.eu/data/zwe.svg",
        "dialling_code": "+263",
        "isoCode": "716"
    }
]


const optionsStatus = [
    // {value: "", label: "Se", icon: "", isDisabled: true },
    { value: "test", label: "Test Key" },
]
const optionsStateDoc = [
    { value: "Official", label: "Official", id: 1 },
    { value: "Unofficial", label: "Unofficial", id: 2 },
]
const optionsIdDoc = [
    { value: "Passport", label: "Passport", id: 1 },
    { value: "ID Card", label: "ID Card", id: 2 },
]
// 
const optionsPaymentMethod = [
    { value: "Credit Card", label: "Credit Card", id: 1 },
    { value: "PayPal", label: "PayPal", id: 2 },
]
const optionsVerificationState = [
    { value: "Give consent", label: "Give consent", icon: "", isDisabled: true },
    { value: "Yes", label: "Yes", id: 1 },
    { value: "No", label: "No", id: 2 },
]

const purposeEvaluation = [
    { value: "Graduate School Application", label: "Graduate School Application", id: 1 },
    { value: "Undergraduate Admission", label: "Undergraduate Admission", id: 2 },
    { value: "Employment", label: "Employment", id: 3 },
    { value: "Professional Licensing", label: "Professional Licensing", id: 4 },
    { value: "Immigration/Visa Application", label: "Immigration/Visa Application", id: 5 },
]
let transformCountriesData = Object.keys(countries || []).map((post, id) => {

    return {
        "id": id + 1,
        "value": countries[id]?.name,
        "label": <div> {countries[id]?.name} </div>,
        "code": countries[id]?.dialling_code
        // "icon": ,
        // "image": countries[id]?.flag
    }
})