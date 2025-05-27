npm init -y

//Backend//
const mysql = require('mysql');
const express = require('express');
const app    = express();
const port   = 3000;
app.use(express.static('public'));       

const conn = mysql.createConnection( {
  host: '127.0.0.1',          
  user: '',                
  port: "",
  password: '',
  database: ''    
});

//Post/
app.post('/eadat',(req, res) => {
  var sql = "SELECT adat1, adat2, adat3, FROM eadat";  
  Send_to_JSON(req, res, sql);
});

app.post('/adat/:atadottadat',(req, res) => {
  var atadottadat = (req.params.atadottadat? req.params.atadottadat : "");
  var sql = `SELECT adat1 from adatok WHERE adat2 = ${atadottadat}`;
  Send_to_JSON(req, res, sql);
});

function Send_to_JSON (req, res, sql) {
  conn.query(sql, (err, results) => 
  {
      var data = err ? "" : results;           
      var msg =  err ? err : "ok";            
      var json_data = JSON.stringify({ "message":msg, "rows":data } ); 
      res.set('Content-Type', 'application/json; charset=UTF-8');       
      res.send(json_data);  
      res.end();
  }); 
}

app.listen(port, function () { console.log(`http://localhost:${port}`); });

//Frontend Global JS//
function üzen( mit, tip)
{
  alerts.forEach((element) => { $("#rekord1").removeClass( "alert-"+element ); });
  $("#rekord1").addClass( "alert-"+tip );
  $("#rekord1").html(mit);    
}

function ajax_get( urlsor, hova, tipus, aszinkron ) {
  $.ajax({url: urlsor, type:"get", async:aszinkron, cache:false, dataType:tipus===0?'html':'json',
      beforeSend:(xhr)   => {  },
      success:   (data)  => { $(hova).html(data); },
      error:     (jqXHR, textStatus, errorThrown) => {üzen(jqXHR.responseText, "danger");},
      complete:  ()      => {  }  
  });
  return true;
};

function ajax_post( urlsor, tipus  ) {
  var s = "";
  $.ajax({url: urlsor, type:"post", async:false, cache:false, dataType:tipus===0?'html':'json',
      beforeSend:function(xhr)   {  },
      success:   function(data)  { s = data; },
      error:     function(jqXHR, textStatus, errorThrown) {üzen(jqXHR.responseText, "danger");},
      complete:  function()      {  }
  });
  return s;
};  

//Frontend JS//
function randomTabla() {
  let listItems = ""
  var k_json = ajax_post("eadat", 1)
  var header = "<tr> <th>Adat 1</th>   <th>Adat 2</th>    <th>Adat 3</th>"

  for (var i = 0; i < k_json.rows.length; ++i) {
    listItems += `<tr> 
                <td>${kerulet_json.rows[i].adat1}</td> 
                <td>${kerulet_json.rows[i].adat2}</td>  
                <td>${kerulet_json.rows[i].adat3}</td>
                </tr>`
  }
  $("#myTable thead").html(header)
  $("#myTable tbody").html(listItems)
  $("#myTable").DataTable()
}


function loadSelector()
{
    let listItems = "<option selected >Válasszon mozit!</option>";
    var mozi_json = ajax_post("moziDataOrderBy", 1)

    for (var i = 0; i < mozi_json.rows.length; ++i) {
        listItems += `<option value="${mozi_json.rows[i].id}">${mozi_json.rows[i].nev}, ${mozi_json.rows[i].irszam} ${mozi_json.rows[i].varos} ${mozi_json.rows[i].cim}</option>`
      }
    
      $("#Selector").append(listItems);
}

function szabadhelyTabla() {
    const selectedMozi = $("#vetitesekSelector").val();
    console.log(selectedMozi);
    
    if ($.fn.DataTable.isDataTable("#szabadhelyTabla")) {
      $("#szabadhelyTabla").DataTable().destroy();
    }
  
    $("#szabadhelyTabla thead").html("");
    $("#szabadhelyTabla tbody").html("");
    $("#szabadCard").hide();
    $("#noSzabadText").hide();

    if (selectedMozi && selectedMozi !== "Válasszon mozit!") {
      let listItems = "";
      var szabad_json = ajax_post(`szabadData/${selectedMozi}`, 1);
      var header = "<tr> <th>Kezdés</th> <th>Szinkron</th> </tr>";
        
      if (szabad_json.rows.length > 0) {
        for (var i = 0; i < szabad_json.rows.length; ++i) {
          listItems += `<tr> 
                      <td>${szabad_json.rows[i].kezdes}</td> 
                      <td>${szabad_json.rows[i].szinkron}</td>  
                      </tr>`;
        }
        $("#szabadhelyTabla thead").html(header);
        $("#szabadhelyTabla tbody").html(listItems);
        $("#szabadhelyTabla").DataTable();
        $("#szabadCard").show();
      } else {
        $("#noSzabadText").show();
      }
    } else {
        $("#noSzabadText").show();
    }
}

//HTML//
<!DOCTYPE html>
<html>
<head>
    <title>asd</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <script>
      $(document).ready(function () {
        loadMoziTabla();
        loadEloadasTabla();
        loadVetitesekSelector();
        loadSzinkronTabla();
        $("#eloadasokContainer").hide();
        $("#szinkronContainer").hide();

        $("#tablaButton").click(function() {
          $("#defaultTablak").show();
          $("#eloadasokContainer").hide();
          $("#szinkronContainer").hide();
        });
        
        $("#eloadasokButton").click(function() {
          $("#defaultTablak").hide();
          $("#eloadasokContainer").show();
          $("#szinkronContainer").hide();
        });
        
        $("#szinkronButton").click(function() {
          $("#defaultTablak").hide();
          $("#eloadasokContainer").hide();
          $("#szinkronContainer").show();
        });

      });
    </script>
</head>
<body>
    <header>
        <nav class="navbar navbar-expand-lg navbar-primary bg-light">
            <div class="container-fluid">
                <div id="navbarNav">
                    <button type="button" class="btn btn-primary btn-lg" id="tablaButton">Táblák</button>
                </div>
            </div>
        </nav>
    </header>

    <div class="container-fluid mt-4">
        <div id="defaultTablak" class="row justify-content-center gx-3">
          <div class="col-md-4">
            <div class="card">
              <div class="card-header bg-light">
                <h5 class="mb-0">Mozi Tábla</h5>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table id="moziTabla" class="table table-striped table-hover border-bottom mb-0">
                    <thead></thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div id="eloadasokContainer" class="row justify-content-center gx-3">
            <label for="vetitesekSelector">Válasszon mozit!</label>
            <select class="form-select" id="vetitesekSelector" aria-label="Válasszon mozit!" onchange="changeSzabadhelyTabla()"></select>

            <div class="col-md-4 mt-5" >
                <p id="noSzabadText">Nincs szabad hely!</p>
                <div class="card" id="szabadCard">
                  <div class="card-header bg-light">
                    <h5 class="mb-0">Ezekre az előadásokra van szabad hely</h5>
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table id="szabadhelyTabla" class="table table-striped table-hover border-bottom mb-0">
                        <thead></thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                </div>
            </div>

        </div>

    </div>
</body>
</html>
