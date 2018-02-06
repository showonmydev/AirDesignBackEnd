var express = require('express');
var router = express.Router();
var request = require('superagent');
var md5 = require('md5');
var emailExistence = require('email-existence');

var mailchimpInstance   = 'us1',
InvitesBonusCardAdmin   = '5ab60f0ddc',
listUniqueIdOptIn       = 'e1dac4e180',
listUniqueIdInvites     = '26a98d9683',
listUniqueIdInviteAdmin = 'a5618bc5ed',
mailchimpApiKey         = '21f0056f6afddbdeca9fb2da807bd254-us1';

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.query);
  res.send('respond with a resource'+req.query.email);
});

//Add user to Opt In list
router.get('/AddOptInUser', function (req, res) {
  let UserEmail = req.query.email
  let UserFirstName = req.query.first
  let UserLastName = req.query.last
  request
      .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueIdOptIn + '/members/')
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
      .send({
        'email_address': UserEmail,
        'status': 'subscribed',
        'merge_fields': {
          'FNAME': UserFirstName,
          'LNAME': UserLastName
        }
      })
      .end(function(err, response) {
        if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
          res.send('Add Member Successfully');
        } else {
          res.send('Oops Somthing Wrong');
        }
    });
});

//Add Batch User to invites list
router.get('/AddInviteUser', function (req, res) {
  var data=req.query.data;
  var MainArr = [];
  data.forEach(function (entry) {
    let data = JSON.parse(entry);
    if(data.email != ""){
      tempdata={"method" : "POST","path" : "lists/"+listUniqueIdInvites+"/members", "body": "{\"email_address\":\""+data.email+"\", \"status\":\"subscribed\", \"merge_fields\": {\"FNAME\": \""+data.first+"\",\"LNAME\": \""+data.last+"\"}}"};
      MainArr.push(tempdata);
    }
  });
  request
      .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/batches')
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
      .send({"operations" : MainArr})
      .end(function(err, response) {
        if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
          res.send('Add All Member Successfully');
        } else {
          res.send('Oops Somthing Wrong');
        }
    });
});

//Add Invite Admin to InviteAdmin list
router.get('/AddInviteAdmin', function (req, res) {
  let UserEmail = req.query.email
  let UserFirstName = req.query.first
  let UserLastName = req.query.last
  let Usercount = req.query.count
  request
      .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueIdInviteAdmin + '/members/')
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
      .send({
        'email_address': UserEmail,
        'status': 'subscribed',
        'merge_fields': {
          'FNAME': UserFirstName,
          'LNAME': UserLastName,
          'NO': Usercount,
        }
      })
      .end(function(err, response) {
        if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
          res.send('Add Member Successfully');
        } else {
          res.send('Oops Somthing Wrong');
        }
    });
});

//Add Invites Bonus Card Admin to InvitesBonusCardAdmin list
router.get('/AddInviteBonusCard', function (req, res) {
  let UserEmail = req.query.email
  let UserFirstName = req.query.first
  let UserLastName = req.query.last
  request
      .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + InvitesBonusCardAdmin + '/members/')
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
      .send({
        'email_address': UserEmail,
        'status': 'subscribed',
        'merge_fields': {
          'FNAME': UserFirstName,
          'LNAME': UserLastName,
        }
      })
      .end(function(err, response) {
        if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
          res.send('Add Member Successfully');
        } else {
          res.send('Oops Somthing Wrong');
        }
    });
});

//Check user into invites list
router.get('/CheckInviteUser', function (req, res) {
  let UserEmail = req.query.email
  request
      .get('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueIdInvites + '/members/' + md5(UserEmail))
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
      .end(function(err, response) {
        if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
          //Member Exists
          res.send(JSON.stringify('0'));
        } else {
          //Member Not Exists
          res.send(JSON.stringify('1'));
        }
    });
});

//Check user into Opt-In list
router.get('/CheckOptInUser', function (req, res) {
  let UserEmail = req.query.email
  request
      .get('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueIdOptIn + '/members/' + md5(UserEmail))
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
      .end(function(err, response) {
        if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
          //Member Exists
          res.send(JSON.stringify('0'));
        } else {
          //Member Not Exists
          res.send(JSON.stringify('1'));
        }
    });
});

module.exports = router;
