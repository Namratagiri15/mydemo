const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'device_management_db'
});
 
// connect to database
mc.connect();
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hi' })
});

// Get list of all devices 
app.get('/devices', function (req, res) {
    mc.query('SELECT * FROM devices', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'ALL Devices' });
    });
});

// Get device with id 
app.get('/devices/:id', function (req, res) {
    let device_id = req.params.id;
    mc.query('SELECT * FROM devices where device_id=?', device_id, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

// Search for device with ‘keyword’ in their name
app.get('/devices/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM devices WHERE device_name LIKE ? ", ['%' + keyword + '%'], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

app.post('/devices', function (req, res) {
    var params  = req.body;
    console.log(params);
    mc.query('INSERT INTO devices SET ?', params, function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

 //update device with the help of device id
app.put('/devices', function (req, res) {
    console.log(req.body);
    mc.query('UPDATE `devices` SET `device_name`=?,`device_details`=?,`is_avaliable`=? where `device_id`=?', [req.body.device_name, req.body.device_details, req.body.is_avaliable,req.body.device_id], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

app.delete('/devices', function (req, res) {
    console.log(req.body);
    mc.query('DELETE FROM `devices` WHERE `device_id`=?', [req.body.device_id], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

//  let sql = `CALL onApprove(4)`;

//  mc.query(sql, (error, results, fields) => {
//     if (error) {
//       return console.error(error.message);
//     }
//     console.log(results[0]);
//   });

app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});