import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import CIcon from '@coreui/icons-react'
import { cilChevronBottom, cilChevronTop, cilDrop, cilLockLocked, cilSearch, cilInfo } from '@coreui/icons'
import { CBadge, CTooltip } from '@coreui/react';
import Swal from 'sweetalert2';
import { Col, Row } from 'reactstrap';


let userData = JSON.parse(localStorage.getItem("userDataStore"));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function SwitchAccount() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [useIcon, setUseIcon] = React.useState(cilChevronBottom)
  const [businessName, setBusinessName] = React.useState( userData?.business_name?.toUpperCase() )

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUseIcon(cilChevronTop)
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUseIcon(cilChevronBottom)
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  function switchActionAccount(e, dataAccount){
      let resetUserData = {
          ...userData, 
          ...{
              "business_name": dataAccount.business_name, 
              "account": dataAccount?.team_account_id, 
              "role_id": dataAccount?.role_id,
              "permission_list": dataAccount?.permission_list || dataAccount?.permisision_list
            }
        };

    // console.log( "perm list",  dataAccount)
    setBusinessName(dataAccount?.business_name?.toUpperCase() )

    localStorage.setItem("userDataStore", JSON.stringify(resetUserData));

    Swal.fire({
        title: 'Account Switched!',
        html: "<div class='pb-0 pt-0'> To " + dataAccount.business_name + " </div>",
        icon: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        // cancelButtonColor: '#d33',
        timer: 2000
    }).then((result) => {
        // 
        window.location.reload();
    })
  }
  return (
    <div>
      <p aria-describedby={id} variant="contained" className='d-flex mb-0' onClick={handleClick} style={{ fontWeight: '200'}}>
        <Row>
            <Col sm='12' md='12' lg='12' xl='12' >
                <CIcon icon={useIcon} className='mt-0' />
                { businessName || ""} 
                <CTooltip content="Click to view list(s) of Accounts(Businesses) and select one to switch between. This will allow you to view transaction(s) for the selected account." placement="top" >
                    <CIcon className='ml-2' icon={cilInfo} />
                </CTooltip> 
            </Col>
        </Row>
      </p>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ pl: 2, pr: 2, pt: 2 }}> { userData?.team_list?.length === 1 ?  "Current" : "Switch" } Account </Typography>
        {
        // console.log( "team list",  userData?.team_list)
        }
        <Box sx={{ width: '100%', marginBottom: "0px" }}>
            <hr style={{ margin: "0.3rem 0" }}/>
            {
                userData?.team_list?.length > 0 ?
                (
                    userData?.team_list?.length > 1 ?
                    userData?.team_list?.filter((fil)=> fil.business_name?.toUpperCase() != businessName?.toUpperCase() ).map((post, id) => 
                        <Stack spacing={2} key={id} style={{marginBottom: "10px"}} onClick={(e)=>switchActionAccount(e, post)}>
                            <Item > <a href='#'>{post?.business_name?.toUpperCase()}</a> </Item>

                        </Stack>
                    )
                    :  
                    <Stack spacing={2}>
                        <Item> {(userData?.firstname + " " + userData?.lastname)?.toUpperCase() } </Item>
            
                    </Stack>
                ) : ""
            }
        </Box>
            
        <CBadge className=" bg-text-wp mb-3 mt-3" style={{ width: '100%'}} onClick={(e)=>logoutUser()} >
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
        </CBadge>

      </Popover>
    </div>
  );
}

function logoutUser(){
    window.location.href="/login";
    localStorage.clear();
}