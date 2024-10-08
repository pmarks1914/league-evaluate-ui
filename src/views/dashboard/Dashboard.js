import React, { useEffect, useState } from 'react'

import {
  CAvatar,
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
} from '@coreui/react'
import { CChartBar, CChartPie } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cil4k,
  cilAlbum,
} from '@coreui/icons'

import moment from 'moment';

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
// import Datatable from '../datatable/DatatableMain'
import { getSchData, getDashEvaluation } from './DashboardData'
import { getSessionTimeout } from '../../Utils/Utils';
import { Badge } from 'reactstrap'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios"
import Swal from 'sweetalert2'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

// console.log(" >>><<<", userData)
const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem("userDataStore"));

  const [schDetails, setSchDetails] = useState(null)
  const [evaDetails, setEvaDetails] = useState(null)
  const [applicationAction, setApplicationAction] = useState(1)

  useEffect(() => {
    // 

    // let schData = getSchData();
    // schData?.list?.then(value => { setSchDetails(value) });

    let stuData = getDashEvaluation();
    stuData?.list?.then(value => { setEvaDetails(value) });

    trackActivity();

  }, [applicationAction])

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const progressExample = [
    { title: 'Total', value: '29', percent: 40, color: 'success' },
    { title: 'Unique', value: '24', percent: 20, color: 'info' },
    // { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    // { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    // { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]
  function declineConfirm(programId, action) {

    Swal.fire({
      // title: 'Successfully created!',
      text: action,
      icon: "info",
      allowOutsideClick: false,
      // allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonColor: 'danger',
      confirmButtonColor: 'primary',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        declineApply(programId)
      }
    });
  }
  function declineApply(programId) {

    let config = {
      method: "DELETE",
      url: process.env.REACT_APP_BASE_API + "/application/" + programId,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userData?.token
      },
      body: {}
    };
    axios(config).then(response => {
      setApplicationAction(applicationAction + 1)
      toast.success(response?.data?.message, {
        position: toast?.POSITION?.TOP_CENTER
      });
      // setSchoolInformation(response?.data)
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
  function requestEvaluation() {
    // 
    if(evaDetails?.count_stats?.profile === 100){
      Swal.fire({
        // title: 'Successfully created!',
        text: "Proceed to request for evaluation, provide a description",
        icon: "info",
        allowOutsideClick: false,
        // allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonColor: 'danger',
        confirmButtonColor: 'primary',
        confirmButtonText: 'Confirm',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showLoaderOnConfirm: true,
        preConfirm: (description) => {
          // otpCodecription = otpCode
          if (description === "") {
            Swal.showValidationMessage(
              `Request failed! description is required.`
            )
          }
          else {
            evaluationApply(description)
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
    else{
      Swal.fire({
        // title: 'Successfully created!',
        text: `Complete your profile, currently ${evaDetails?.count_stats?.profile || 0} percent.`,
        icon: "warning",
        allowOutsideClick: true,
        // allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonColor: 'danger',
        cancelButtonText: 'OK',
        showConfirmButton: false,
        showLoaderOnConfirm: false,
      }).then((result) => {
      });
    }
}
function evaluationApply(description) {
    let config = {
        method: "post",
        url: process.env.REACT_APP_BASE_API + "/evaluation",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userData?.token
        },
        data: {
            "name": userData?.user?.first_name?.trim() + " " + "Evaluation Request",
            "description": description?.trim()
        }
    };
    axios(config).then(response => {
      setApplicationAction(applicationAction + 1)
        toast.success(response?.data?.message, {
            position: toast?.POSITION?.TOP_CENTER
        });
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

  window.onclick = function (event) {
    trackActivity()
  }

  function funE(rowIndexData) {
    localStorage.setItem("applicantData", JSON.stringify(rowIndexData));

    window.location.href = '/application-detail/' + userData?.organization_id + "/"

  }

  return (
    <>

      <ToastContainer />

      <CRow className='m-3'>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsB
            className="mb-4"
            progress={{ color: 'info', value: 100 }}
            text="Evaluation request"
            title="Evaluation Count"
            value={evaDetails?.count_stats?.evaluation_count_total || "0"}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsB
            className="mb-4"
            progress={{ color: 'danger', value: 100 }}
            text="Rejected Evaluation Request"
            title="Rejected Count"
            value={evaDetails?.count_stats?.evaluation_count_rejected || "0"}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsB
            className="mb-4"
            progress={{ color: 'warning', value: 100 }}
            text="Evaluation Request Started"
            title="In progress Count"
            value={evaDetails?.count_stats?.evaluation_count_started || "0"}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsB
            className="mb-4"
            progress={{ color: 'success', value: 100 }}
            text="Completed Evaluation Request"
            title="Completed Count"
            value={evaDetails?.count_stats?.evaluation_count_completed || "0"}
          />
        </CCol>

      </CRow>

      {/* table for student */}
      {
        userData?.type === 'Student' ?
          <CRow className='m-3' style={{ width: "100%" }}>

            <CCol xs={12} sm={12} lg={12} >

              <CCard className="mb-4">
                <CCardHeader> Evaluation Overview </CCardHeader>
                <CCardBody>
                  <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell className="text-center">
                          <CIcon icon={cilAlbum} />
                        </CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                        <CTableHeaderCell> </CTableHeaderCell>
                        <CTableHeaderCell> </CTableHeaderCell>
                        <CTableHeaderCell> </CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {evaDetails?.data?.map((item, index) => (
                        <CTableRow v-for="item in tableItems" key={index}>
                          <CTableDataCell className="text-center">
                            <CAvatar size="md" src={item?.evaluation_info?.photo} status={"success"} />
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>{item?.name}</div>
                            <a href={`evaluation-edit/${item?.id}`} > Evaluate </a>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div> {item?.description?.slice(0, 35)} </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="small text-medium-emphasis">
                              <span>{'New '}</span> | Applied:{' '}
                              {moment(item?.created_on).format("YYYY-MM-DD")}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={item?.status === "COMPLETED" ? "success" : ( item?.status === "REJECTED" ? "danger" : (item?.status === "PENDING" ? "info" : (item?.status === null ? "info" : "warning" ) ) ) }  > {item?.status || "PENDING" }  </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="clearfix">
                              <div className="float-start ">
                                <div style={{ width: 50, height: 50 }}>
                                  <CircularProgressbar
                                    value={item?.progress|| 25}
                                    text={`${item?.progress || 25}%`}
                                    background
                                    backgroundPadding={6}
                                    styles={buildStyles({
                                      backgroundColor: "#303c54",
                                      textColor: "#fff",
                                      pathColor: "#fff",
                                      trailColor: "transparent"
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>

          </CRow>
          : ""
      }

    </>
  )
}

export default Dashboard
