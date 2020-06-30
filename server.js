if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

  const express = require('express')

const mysql = require('mysql2');
const db = mysql.createPool({
  host     : 'localhost', // MYSQL HOST NAME
  user     : 'root',        // MYSQL USERNAME
  password : '12345678',    // MYSQL PASSWORD
  database : 'faceid'      // MYSQL DB NAME
}).promise();
module.exports = db;

  const app = express()
  app.set('port', (process.env.PORT || 3000));
    app.listen(app.get('port'), function() {
    console.log('Server started on port '+app.get('port'));
});

// declaring tools
  const path = require('path');
  const cookieSession = require('cookie-session');
  const bcrypt = require('bcrypt')
  const flash = require('express-flash')
  const session = require('express-session')
  const bodyParser = require('body-parser')
  const {google} = require('googleapis');
  const googleCalenderService =require('/Users/RiaNarang/Desktop/FACEID_CURRENT/utils/google-calendar.service.js');


  const { body, validationResult } = require('express-validator');
 
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json({limit: '2mb'}))

  
 // SET OUR VIEWS AND VIEW ENGINE
 app.use('/public', express.static('public'))
 app.use('/models', express.static('models'))
 app.use('/static', express.static('static'))

//  var log = console.log;
//  console.log = function() {
//      log.apply(console, arguments);
//      // Print the stack trace
//      console.trace();
//  };


app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  3600 * 1000 // 1hr
}));
  app.use(session({
    key: 'user_email',
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }))

// https://medium.com/@isuru71/google-calendar-api-with-oauth2-and-node-js-25f17521c1f3
//https://developers.google.com/calendar/overview
// the above instructions and documentations were followed to connect to google calender
  const oauth2Client = new google.auth.OAuth2(
    "*client ID goes here",
    "*key goes here",
    "*link to your redirecting page goes here*"
  ); // the client id, key and the redirecting page
  
  
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
  
    scope: 'https://www.googleapis.com/auth/calendar.events'
  }); // defining the scope of permissions required

  app.get('/googleLogin', (req, res) => {
    res.redirect(url)
}); // redirecting the user to the url to log into google account

oauth2Client.setCredentials({
    refresh_token: `STORED_REFRESH_TOKEN`
  }); // refreshing tokens

  app.get('/landing', async (req, res) => {

    const code = req.query.code; //getting the code from the url
    console.log("code: "+ code)
    const {tokens} = await oauth2Client.getToken(code) //exchanging code and tokens
    oauth2Client.setCredentials(tokens) //setting credentials

    oauth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
          console.log("ref token: "+tokens.refresh_token);
        }
        console.log("access token" +tokens.access_token);

      })

      googleCalenderService.listEvents(oauth2Client, (events) => {  
        for (var i = 0; i < events.length; i++){
            const event_name = events[i].summary  
            const event_startDateTime = events[i].start.dateTime.split("T")
            const event_date = event_startDateTime[0]
            const event_startTimeZone = event_startDateTime[1].split("+")
            const event_startTime = event_startTimeZone[0]
            const event_endDateTime = events[i].end.dateTime.split("T")
            const event_endDateTimeZone = event_endDateTime[1].split("+")
            const event_endTime = event_endDateTimeZone[0]
            const user = req.session.user
            // stroing extracted events in the database
            console.log(event_name, event_date, event_startTime, event_endTime, user )
            db.execute("INSERT IGNORE INTO calender_events (event_name, event_date, event_startTime, event_endTime, user) VALUES (?, ?, ?, ?, ?) " ,
            [event_name, event_date, event_startTime, event_endTime, user]).then(result => {
                console.log("done")
            }).catch(err => {
                if (err) throw err 
            })

        }
     // printing event information on the page
        const data = {
            events : events
        }
        res.render('landing.ejs', data)
       
    });

  })

  // DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
  if(!req.session.isLoggedIn){
      return res.render('register');
  }
  next();
}

const ifLoggedin = (req,res,next) => {
  if(req.session.isLoggedIn){
      return res.redirect('/');
  }
  next();
}
// END OF CUSTOM MIDDLEWARE
 
  
  app.get('/', ifNotLoggedin, (req, res) => { // getting home page
    res.render('index.ejs')
    console.log(req.session.user)

  })

  

  
// LOGIN PAGE
app.post('/login', [
  body('email').custom((value) => { // checking if user exists
      return db.execute('SELECT email FROM user WHERE email=?', [value])
      .then(([rows]) => {
          if(rows.length == 1){
              return true;
              
          }
          return Promise.reject('Invalid Email Address!');
          
      });
  }),
  body('password','Password is empty!').trim().not().isEmpty(),
], (req, res) => {    
  const validation_result = validationResult(req);
  const {password, email} = req.body;
  if(validation_result.isEmpty()){
      
      db.execute("SELECT password FROM user WHERE email=?",[email])
      .then(([rows]) => {
          //comparing password using bcrypt
          bcrypt.compare(password, rows[0].password).then(compare_result => {
              if(compare_result === true){
                  req.session.isLoggedIn = true;
                  req.session.user = email;

                  res.redirect('/');
              }
              else{
                  res.render('register',{
                      login_errors:['Invalid Password!']
                  });
              }
          })
          .catch(err => {
              if (err) throw err;
          });


      }).catch(err => {
          if (err) throw err;
      });
  }
  else{
      let allErrors = validation_result.errors.map((error) => {
          return error.msg;
      });
      // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
      res.render('register',{
          login_errors:allErrors
      });
  }
});

// END OF LOGIN PAGE
  
  app.get('/register', ifLoggedin,  (req, res) => { //getting register page
    res.render('register.ejs')
  })

  app.post('/register', 
// post data validation using express-validator
[
  body('email','Invalid email address!').custom((value) => {
      return db.execute('SELECT email FROM user WHERE email=?', [value])
      .then(([rows]) => {
          if(rows.length > 0){
              return Promise.reject('This E-mail already in use!')
          }
          return true
      });
  }),
  body('name','Username is Empty!').trim().not().isEmpty(),
  body('password','The password must be of minimum length 6 characters')
  .trim().isLength({ min: 6 }),
],// end of post data validation
(req,res,next) => {

    const validation_result = validationResult(req);
    const {name, password, email} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){

        // password encryption (using bcrypt) 
        bcrypt.hash(password, 12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            db.execute("INSERT INTO user(name, email, password) VALUES(?,?,?)",
            [name, email, hash_pass])
            .then(result => {
              console.log("done")
                res.send(`your account has been created successfully, Now you can <a href="/register">Login</a>`);
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH VALIDATION ERRORS
        res.render('register',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});// END OF REGISTER PAGE


// LOGOUT
app.get('/logout',(req,res)=>{
  //session destroy
  req.session = null;
  res.redirect('/register');
});
// END OF LOGOUT



var list = {} 
app.get('/add_student', function(req,res){
    db.query("SELECT module_name FROM module",function(err,result){
            if(err){
            throw err
        }
        else {
            list = {listResults: result}
            res.render('add_student', list)
        }
    })
})

// displaying sessions
var list = {}
app.get('/session', function(req,res){

db.query("SELECT distinct event_name,event_date, event_startTime, event_endTime FROM faceid.calender_events where user= ? and event_date = curdate()",[req.session.user]
).then(([result]) => {
    if (result){
        list = {listResults: result} //storing results in list
        res.render('session', list) 
    }
    else if(err){
        throw err

    }
})
})

app.get('/getTime', function(req,res){

    db.query("SELECT distinct event_startTime, event_endTime FROM faceid.calender_events where user= ? and event_name=? and event_date = curdate()",[req.session.user, req.query.selectGroup]
    ).then(([result]) => {
        if (result){
            console.log(result)
            res.send(result);
        }
        else if(err){
            throw err
    
        }
    })
    

    })

app.get('/attendance', (req, res)=>{ // getting attendance

    db.query("SELECT distinct event_name FROM faceid.calender_events where user= ?",[req.session.user]
).then(([result]) => {
    if (result){
        list = {listResults: result}
        res.render('attendance', list)
    }
    else if(err){
        throw err

    }
})
})

app.get('/getData', (req, res) => {

    db.query("SELECT distinct attendance.MISIS, student.student_firstName, TIMEDIFF(check_out, check_in) as att_time_diff, TIMEDIFF(calender_events.event_endTime ,calender_events.event_startTime) as event_time_diff FROM faceid.calender_events, faceid.attendance, faceid.student where calender_events.event_name= ? and `date`=? and faceid.attendance.MISIS=faceid.student.MISIS and calender_events.event_name=attendance.event_name",[req.query.selectGroup, req.query.class_date]
    ).then(([result]) => {
        if (result){
            console.log(result)
        for (var i = 0; i <= result.length ; i++){


            var att_time_diff = JSON.stringify(result[i].att_time_diff)
            var event_time_diff = JSON.stringify(result[i].event_time_diff)

            // var time_diff_withLate = moment(event_time_diff).subtract(10, 'minutes').toDate();
            // var time_diff_withLate = setMinutes(event_time_diff.getMinutes() - 10 );
            console.log("time"+att_time_diff+"time 2: "+ event_time_diff)


            var status ={}
            if(!att_time_diff){
                if(att_time_diff == event_time_diff){
                    console.log("here")

                    status[i] = "Present"
                }
                else{
                    status[i] = "Late"

                }
            }
            else{
                status[i] = "Absent"
            }
            console.log(i+":" + status[i])
        }
        studentInfo = {status: status}
        console.log("djhwja"+ JSON.stringify(studentInfo))
            

            res.send(studentInfo)
        }
        else if(err){
            throw err
    
        }
    })

})



app.get('/check_in_recognition', (req, res) => { //route for checking in

    res.render('check_in_recognition', {selectGroup})
})

app.post('/check_in_recognition', (req, res) => {

   selectGroup = req.body.selectGroup

   res.redirect("check_in_recognition")
})

app.get('/check_out_recognition', (req, res) => { //route for checking out

    res.render('check_out_recognition', {selectGroup})
})

app.post('/check_out_recognition', (req, res) => {

   selectGroup = req.body.selectGroup

   res.redirect("check_out_recognition")
})


app.post('/rec_students', (req, res) => {
    
    const data = req.body //getting data from client side
    console.log(data)
    MISIS = data.detectedStudent // storing MISIS of the detected student
    const group_name = data.groupName //storing group name

    db.execute('SELECT *  FROM attendance WHERE event_name=? and MISIS=? and date=CURDATE() ', [group_name, MISIS ]
    //checking if the record already exists
    ).then(([result]) => {
        console.log("result: "+result)
        if (result.length === 0){ // insert if no records found
            db.execute("INSERT INTO attendance (event_name, MISIS, date, `check_in`) VALUES (?, ?,CURDATE(),CURTIME())", [group_name, MISIS]).then(rows => {
        console.log("done")
        res.send('Check-In stored successfully')
    }).catch(err => {

        if (err) throw err 
    })
        }
        else{
            return
        }
    }).catch(err => {
        if (err) throw err // display errors
    })

    console.log("done")
    res.send('Check-In stored successfully')
})


app.post('/rec_students_check_out', (req, res) => {
    
    const data = req.body
    console.log(data)
    MISIS = data.detectedStudent
    const group_name = data.groupName

//checking if the record already exists
    db.execute('SELECT *  FROM attendance WHERE group_name=? and MISIS=? and date =CURDATE() ', [group_name, MISIS ]

    ).then(([result]) => {
        console.log("result: "+result)
        if (result){
            db.execute("UPDATE attendance SET `check_out` = CURTIME() WHERE group_name=? and MISIS=? and date=CURDATE()",[group_name, MISIS]
            ).then(rows =>{
            // db.execute("INSERT INTO attendance (check_out) VALUES (?)",[check_out]).then(rows => {
        console.log("ok")
        // res.send('Check-In stored successfully')
    }).catch(err => {

        if (err) throw err 
    })
        }
        else{
            return
        }
    }).catch(err => {
        if (err) throw err 
    })

    console.log("done")
    res.send('Check-In stored successfully')
})

// viewing students from the database
app.get('/viewStudents', (req, res) => {

    db.query("SELECT module_name from module").then(([result]) => {
        if (result){
            list = {listResults: result}
            console.log(result)
            res.render('viewStudents', list)

        }
        else if(err){
            throw err
    
        }
    })

})
var students = []
app.get('/getStudents', (req, res) => {

    db.query("SELECT * from student, students_module, module where module_name=? AND module.module_id=students_module.module_id AND students_module.MISIS=student.MISIS order by student_firstName asc",[req.query.selectGroup]).then(([result]) => {
        if (result){
            // list = {listResults: result}
            console.log(result)
            res.send(result);
        }
        else if(err){
            throw err
    
        }
    })

})




app.use('/', (req,res) => {
  res.status(404).send('<h1>404 Page Not Found!</h1>');
});
