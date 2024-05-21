/*** Please use below convensions to set error
 * 1001 - 1499 generic error
 * 1500 - 2000 generic response
 * 2001 - 2499 customer error
 * 2500 - 3000 customer response
 * 3001 - 3499 device error
 * 3500 - 4000 site error
 * 4001 - 4499   error
 * 4500 - 5000 device_alert error
 * 5001 - 5499 smpt_server error
 * 5500 - 6000 sms_gateway error
 * 6001 - 6499 email_template error
 * 6500 - 7000 sms_template error
 * 7001 - 7499 device_endpoint error
 * 7500 - 6000 account error
**/

const message = {
    1001: {
        "message": "Something went wrong on server",
        "httpCode": 400
    },
    2001:{
        "message": "email is required",
        "httpCode": 400
    },
    2002:{
        "message": "email is invalid",
        "httpCode": 400
    },
    2003:{
        "message": "password is required",
        "httpCode": 400
    },
    2004:{
        "message": "Invalid username or password",
        "httpCode": 400
    },
    2005:{
        "message": "you have been deactivated please contact your admin for more details",
        "httpCode": 400
    },
    2006:{
        "message": "name is required",
        "httpCode": 400
    },
    2007:{
        "message": "Identifier is required",
        "httpCode": 400
    },
    2008:{
        "message": "Expired or invalid link",
        "httpCode": 400
    },
    3001:{
        "message": "Device does not exists",
        "httpCode": 400
    },
    3500:{
        "message": "Site Name can not be empty",
        "httpCode": 400
    },
    3501:{
        "message": "Site Name already exists",
        "httpCode": 400
    },
    3502:{
        "message": "Unable to add site",
        "httpCode": 400
    },
    3503:{
        "message": "Invalid site",
        "httpCode": 400
    },
    4001:{
        "message": "Email already exists",
        "httpCode": 400
    },
    4002:{
        "message": "Email is required",
        "httpCode": 400
    },
    4003:{
        "message": "Mobile number is required",
        "httpCode": 400
    },
    4004:{
        "message": "Password is required",
        "httpCode": 400
    },
    4005:{
        "message": "Invalid user",
        "httpCode": 400
    },
    4006:{
        "message": "Invalid email address",
        "httpCode": 400
    },
    4007:{
        "message": "Unable to add user",
        "httpCode": 400
    },
    4500:{
        "message": "Name is required",
        "httpCode": 400
    },
    4501:{
        "message": "Invalid Alert",
        "httpCode": 400
    },
    4502:{
        "message": "Name already exists",
        "httpCode": 400
    },
    5001:{
        "message": "Name is required",
        "httpCode": 400
    },
    5002:{
        "message": "Name already exists",
        "httpCode": 400
    },
    5003:{
        "message": "Invalid Smtp Server",
        "httpCode": 400
    },
    5004:{
        "message": "Is Default Already",
        "httpCode": 400
    },
    5500:{
        "message": "Name is required",
        "httpCode": 400
    },
    5501:{
        "message": "Name already exists",
        "httpCode": 400
    },
    5502:{
        "message": "Invalid Sms Gateway",
        "httpCode": 400
    },
    5503:{
        "message": "Is Default Already",
        "httpCode": 400
    },
    6001:{
        "message": "Name is required",
        "httpCode": 400
    },
    6002:{
        "message": "Name already exists",
        "httpCode": 400
    },
    6003:{
        "message": "Invalid Template",
        "httpCode": 400
    },
    6004:{
        "message": "Is Default Already",
        "httpCode": 400
    },
    6500:{
        "message": "Name is required",
        "httpCode": 400
    },
    6501:{
        "message": "Name already exists",
        "httpCode": 400
    },
    6502:{
        "message": "Invalid Template",
        "httpCode": 400
    },
    6503:{
        "message": "Is Default Already",
        "httpCode": 400
    },
    7001:{
        "message": "Name is required",
        "httpCode": 400
    },
    7002:{
        "message": "Name already exists",
        "httpCode": 400
    },
    7003:{
        "message": "Invalid Data Source",
        "httpCode": 400
    },
    7501:{
        "message": "Email already exists",
        "httpCode": 400
    },
    7502:{
        "message": "Email is required",
        "httpCode": 400
    },
    7503:{
        "message": "Mobile number is required",
        "httpCode": 400
    },
    7504:{
        "message": "Password is required",
        "httpCode": 400
    },
    7505:{
        "message": "Invalid account",
        "httpCode": 400
    },
    7506:{
        "message": "Invalid email address",
        "httpCode": 400
    },
    7507:{
        "message": "Unable to add account",
        "httpCode": 400
    },
}

module.exports = message