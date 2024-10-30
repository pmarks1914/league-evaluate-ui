import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { Container, Row, Col, Label, Input, Badge } from 'reactstrap';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import axios from 'axios';
import moment from 'moment';
import { 
  CAvatar, CDropdown,
  // CDropdownDivider,
  CDropdownHeader, CDropdownItem, CDropdownMenu, CDropdownToggle, CBadge, CButton, CNavbar, CImage, CNavbarBrand, CCard, CDropdownDivider, CCardBody, CCollapse, CCardHeader, CCol, CLink, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPopover, CRow, CNav, CNavItem, CTooltip
} from '@coreui/react'
import 'rsuite/dist/rsuite.min.css';
import { DateRangePicker as RSuitDateRangePicker } from 'rsuite';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { TextField, Input as in_put, Button } from '@mui/material';
import Swal from 'sweetalert2';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import '../../datatable/table.css';
import { toast } from 'react-toastify';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import PropTypes, { func } from "prop-types";
import * as XLSX from 'xlsx';

let currentUser = JSON.parse(localStorage.getItem("userDataStore"));



const PassInfoDatatables = (props) => {

  const [ProductMiscellaneouData, setProductMiscellaneouData] = useState({});


  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState({});

  const [pagination, setPagination] = useState({
    next: '',
    previous: ''
  });

  //   payout 
  const [payoutHoldArray, setPayoutHoldArray] = useState([])
  //  export
  const [transactionExport, setTransactionExport] = useState({});

  // modals
  const [modal1, setModal1] = useState(false)
  // view single ProductInfo 
  const [modal2, setModal2] = useState(false)
  const [modal3, setModal3] = useState(false)


  const [viewData, setViewData] = useState({})

  const [pickedProductImageName, setPickedProductImageName] = useState('')
  const [ProductFormData, setProductFormData] = useState({})
  const [ProductData, setProductData] = useState({})
  const [ProductDataError, setProductDataError] = useState({})


  const [ProductInfoStatusInModal, setProductInfoStatusInModal] = useState("");

  useEffect(() => {
    fetchProducts();
    // console.log(" date....", moment(dateRange[0]).format('YYYY-MM-DD') )
  }, [currentPage, pageSize, searchText, dateRange]);

  const fetchProducts = async () => {

    setLoading(true);
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API}/evaluation-paging`, {
          params: {
          page: currentPage,
          per_page: pageSize,
          start_date: dateRange[0] ? moment(dateRange[0]).format('YYYY-MM-DD') : null,
          end_date: dateRange[1] ? moment(dateRange[1]).format('YYYY-MM-DD') : null,
          search: searchText
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
      });

      if (response?.status === 200) {
        // console.log("response ", response?.data)

        const { next, pagination, data } = response?.data;
        setTableData(data);
        setTotalRecords(pagination?.total);
        setPagination({ next: pagination?.next, previous: pagination?.previous });
      }
    } catch (error) {
      // console.error("Error fetching data from server:", error);
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPageSize(newPerPage);
    setCurrentPage(page);
  };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const columns = [
    { name: 'No.', selector: (row, index) => index + 1, width: '5%' }, 
    { name: 'Name', width: '20%', selector: row => row?.name },
    { name: 'Description', selector: row => row?.description },
    {
      name: 'Progress', width: '20%',
      cell: row => (
        <div className="clearfix m-0">
          <div className="float-start m-0">
            <div style={{ width: 50, height: 50 }} >
              <CircularProgressbar
                className='m-1'
                value={row?.progress || 25}
                text={`${row?.progress || 25}%`}
                background
                backgroundPadding={2}
                styles={buildStyles({
                  backgroundColor: "#303c54",
                  textSize: 29,
                  display: "flex",
                  justifyContent: "center",
                  textColor: "#fff",
                  pathColor: "#fff",
                  trailColor: "transparent"
                })}
              />
            </div>
          </div>
        </div>
      )
    },
    { name: 'Date', selector: row => row?.created_on },
    {
      name: 'Action',
      cell: row => (
        <div className="clearfix">
           <Badge color='info' className='wp-cursor-pointer m-2'  onClick={() => funE(row)}> View </Badge>
           <Badge color='danger' className='wp-cursor-pointer m-2' onClick={() => funEvaluationEdit(row)} > Process </Badge>
        </div>
      )
    }
  ];

  function funE(rowIndexData) {
    // console.log("rowIndexData ", rowIndexData)
    localStorage.setItem("applicantData", JSON.stringify(rowIndexData));
    window.location.href = '/evaluation-detail/' + rowIndexData?.id + "/"
  }
  function funEvaluationEdit(rowIndexData) {
    window.location.href = '/evaluation-edit/' + rowIndexData?.id + "/"
  }

  const handleChangeExport = (valSelected) => {
    setTransactionExport(valSelected);
    // restructure data for export 
    let transformData = Object.keys(tableData).map((post, id) => {
      return {
        "ID": id + 1,
        "IDT": tableData[id]?.id,
        // "Current Level": tableData[id]?.source_metadata?.currentLevel,
      }
    })
    if (valSelected === "Export to excel") {
      // 
      downloadExcel(tableData);
    }
    else if (valSelected === "Export to csv") {
      // 
      downloadCSV(transformData);
    }
  };

  function convertArrayOfObjectsToCSV(array) {
    let result;
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(array[0]);
    // // console.log("keys", keys );
    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
      let ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter;
        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });
    return result;
  }

  function downloadCSV(array) {
    const link = document.createElement('a');
    // // console.log("exp downloadCSV==>", array  );
    let csv = convertArrayOfObjectsToCSV(array);
    // console.log("csv", csv);
    if (csv == null) { return };

    const filename = 'CLAexport.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }
  const downloadExcel = (data) => {
    // console.log( data );
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CLAexport");

    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "CLAexport.xlsx");
  };

  // option export
  const optionsExport = [
    // {value: "", label: "Se", icon: "", isDisabled: true },
    { value: "Export to excel", label: "Export to excel" },
    { value: "Export to csv", label: "Export to csv" }
  ];

  const optionsStatusInModal = [
    // {value: "", label: "Se", icon: "", isDisabled: true },
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];
  // ProductMiscellaneouData
  const optionBrandList = Object.keys(ProductMiscellaneouData?.brand || []).map((post, id) => {
    return {
      "value": ProductMiscellaneouData?.brand[id].name,
      "id": ProductMiscellaneouData?.brand[id].id,
      "label": ProductMiscellaneouData?.brand[id].name
    }
  });

  // Product category transform
  const optionInModalList = Object.keys(ProductData?.category || []).map((post, id) => {
    return {
      "value": ProductData?.category[id].name,
      "id": ProductData?.category[id].id,
      "label": ProductData?.category[id].name
    }
  });
  const optionCategoryList = Object.keys(ProductMiscellaneouData?.category || []).map((post, id) => {
    return {
      "value": ProductMiscellaneouData?.category[id].name,
      "id": ProductMiscellaneouData?.category[id].id,
      "label": ProductMiscellaneouData?.category[id].name
    }
  });

  function trackActivity() {
    // e.preventDefault();
    // getSessionTimeout();
    const currentUser_new = JSON.parse(localStorage.getItem("userDataStore"));
    if (currentUser_new) {
      currentUser_new["timeLogout"] = new Date().getTime() + currentUser_new?.counter;
      localStorage.setItem('userDataStore', JSON.stringify(currentUser_new))
    }
  }
  return (
    <div onClick={() => trackActivity()}>

      <CRow>
        {/* search */}
        <CCol xs="12" sm="12" md={3} lg={3} className='m-3' >
          {/*  */}
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
            style={{ width: '258px', padding: '9px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </CCol>
        {/* Date range */}
        <CCol xs="12" sm="12" md={3} lg={3} className='m-2' >
          {/* date range */}
          <FormControl fullWidth>
            <Box
              id='dateRange-control'
              noValidate
              autoComplete="off"
              sx={{ minWidth: 170 }}

            >
              <RSuitDateRangePicker
                appearance="default"
                placeholder={"Select date range"}
                size="lg"
                style={{ width: 260, display: 'block', border: "10px solid #000 !important", cursor: "pointer !important" }}
                className="d-filters"
                // open={openDateRange}
                // toggle={toggle}
                onChange={(range) => setDateRange(range || {})}
                // ranges={dateRange}
                // months={2}
                id="datePicker-0"
              />
            </Box>
          </FormControl>
        </CCol>
        <CCol xs="12" sm="12" md={3} lg={3} className='m-2' >
          {/* export */}
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <Label for="payoutExport" className="label-dc"> </Label>
              <Select
                placeholder={"Select export"}
                options={optionsExport}
                id="payoutExport"
                className='other-input-select d-filters float-item-media wp-cursor-pointer'
                // components={{ Option: paymentOption }}
                onChange={(e) => handleChangeExport(e?.value)}
              />
            </FormControl>
          </Box>
        </CCol>
      </CRow>
      <DataTable
        columns={columns}
        data={tableData}
        pagination
        paginationServer
        paginationPerPage={pageSize}
        paginationTotalRows={totalRecords}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        paginationRowsPerPageOptions={[5, 10, 20, 50, 100, 1000]}
        progressPending={loading}
        persistTableHead
      />




      {/* modal for  view */}
      <CModal visible={modal2} scrollable backdrop="static" fullscreen="xl" onClose={() => setModal2(false)}>
        <CModalHeader>
          <CModalTitle>  Transaction Details  </CModalTitle>
        </CModalHeader>
        <CModalBody className='contentForTransactionPrint'>
          {/* view only data for payout */}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" className='text-white wp-cursor-pointer' onClick={() => setModal2(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>


      {/* modal for delete */}
      <CModal visible={modal3} scrollable backdrop="static" fullscreen="md" onClose={() => setModal3(false)}>
        <CModalHeader>
          <CModalTitle> Delete Product  </CModalTitle>
        </CModalHeader>
        <CModalBody className='contentForProductInfoPrint'>
          <Row>
            <p>
              Do you want to delete {ProductData?.name} ?
            </p>
          </Row>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" className='text-white wp-cursor-pointer' onClick={() => setModal3(false)}>
            Close
          </CButton>

        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PassInfoDatatables;


PassInfoDatatables.propTypes = {
  // passType: PropTypes.string,
  passType: PropTypes.instanceOf(PropTypes.any).isRequired
};