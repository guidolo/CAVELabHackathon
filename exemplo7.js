var table, linea;


var deltax = 0;
var deltay = 0 ;
var mouseXpressed;
var mouseYpressed;
var olddeltax;
var olddeltay;

var scalevalue = 0;
var move = false;
var selected = false;
var slider, radio;
var valueslider;
var optionColor;
var maxBranchColor, minBranchColor;

var selectedNodeid;
var selectedCost;
var selectedTime;
var flaghistogram = false;

var costoTotal, tiempoTotal, selectedBranchCost;

function preload() {
  table = loadTable("data/CAVE_Hackathon_Data.csv", 'csv', "header");
  linea = loadTable("data/cereal_edges.csv", 'csv', "header");
}


function setup() {
  createCanvas(1400, 800);
  table.addColumn("CostoTotal");
  table.addColumn("TiempoTotal");
  table.addColumn("BranchSelected");
  table.addColumn("Supply");
  linea.addColumn("BranchSelected");

  //crate SLIDER
  //slider = createSlider(0, 255, 100);
  //slider.position(width-150, 700);
  //slider.style('width', '100px');

  //create radio
  radio = createRadio();
  radio.position(width-180, 200);
  radio.option(' Node ', 1);
  radio.option(' CostU', 4);
  radio.option(' Cost ', 2);
  radio.option(' TimeU', 5);
  radio.option(' Time ', 3);
  radio.style('width', '80px');
  radio.style('font-size', '18px');
  radio.style('color', 'RGB(0, 102, 153)');
  radio.style('font-type', 'Helvetica');

  totalCost();
  maxBranchColor = (sort(table.getColumn("CostoTotal"))[50]); 
  minBranchColor = (sort(table.getColumn("CostoTotal"))[0]);
  maxBranchColort = (sort(table.getColumn("TiempoTotal"))[50]); 
  minBranchColort = (sort(table.getColumn("TiempoTotal"))[0]);
  maxNodeCost = (sort(table.getColumn("stageCost"))[50]); 
  minNodeCost = (sort(table.getColumn("stageCost"))[0]);
  maxNodeTime = (sort(table.getColumn("stageTime"))[50]); 
  minNodeTime = (sort(table.getColumn("stageTime"))[0]);
}

function draw() {

  var optionColor = radio.value();
  if (optionColor!=1 & optionColor!=2 & optionColor!=3 & optionColor != 4 & optionColor != 5) {
    optionColor=1;
  } 

  background(255);
  if (move) {
    deltax = olddeltax - (mouseXpressed - mouseX);
    deltay = olddeltay - (mouseYpressed - mouseY);
  }

  textFont('Helvetica'); 
  textSize(26); 
  fill(0, 102, 153); 
  noStroke(); 
  text('Cave Lab Hackathon: Supply Network      Cereal Co. ', 10, 10, 300, 300); 

  //ARCOS
  for (var i = 0; i < linea.getRowCount(); i++) {
    var xsource = linea.getNum(i, "x_source");
    var ysource = linea.getNum(i, "y_source");
    var xdest = linea.getNum(i, "x_dest");
    var ydest = linea.getNum(i, "y_dest");
    stroke(158, 188, 218);
    strokeWeight(3);
    if (selected) {
      if (linea.getNum(i, "BranchSelected")==1) {
        stroke(99, 99, 99);
      }
    }
    arcXY(xsource, ysource, xdest, ydest, deltax, deltay, scalevalue);
  }

  //NODOS
  for (var i = 0; i < table.getRowCount(); i++) {
    var x = table.getNum(i, "xPosition");
    var y = table.getNum(i, "yPosition");

    if (optionColor == 1) {
      if (table.getString(i, "stageClassification") == "Dist") {
        var c = color(72, 133, 237);
      }
      if (table.getString(i, "stageClassification") == "Manuf") {
        var c = color(60, 186, 84);
      }
      if (table.getString(i, "stageClassification") == "Part") {
        var c = color(219, 50, 54);
      }
      if (table.getString(i, "stageClassification") == "Trans") { 
        var c = color(244, 194, 13);
      }

      if (selected) {
        if (table.get(i, "BranchSelected")==0) {
          var c=color(189, 189, 189);
        }
      }
      var text_nodo = table.getNum(i, "Node_id");
    }

    //Color por Costo
    if (optionColor==2) {
      if (table.getNum(i, "relDepth")==0) {
        var alfa = map(table.getNum(i, "CostoTotal"), minBranchColor, maxBranchColor, 50, 200);
        var c = color(103, 0, 13, alfa);
      } else {
        if (table.get(i, "BranchSelected")==0) {
          var c=color(189, 189, 189);
        } else {
          var c = color(89, 89, 89);
        }
      }
      var text_nodo = table.get(i, "CostoTotal");
      if (text_nodo==undefined) {
        text_nodo=0
      } else {
        text_nodo=round(text_nodo);
      }
    }

    //Color por Tiempo
    if (optionColor==3) {
      if (table.getNum(i, "relDepth")==0) {
        var alfa = map(table.getNum(i, "TiempoTotal"), minBranchColort, maxBranchColort, 50, 200);
        var c = color(8, 81, 156, alfa);
      } else {
        if (table.get(i, "BranchSelected")==0) {
          var c=color(189, 189, 189);
        } else {
          var c = color(89, 89, 89);
        }
      }
      if (flaghistogram) {
        //print("adentro");
        histogram();
      }
      var text_nodo = table.get(i, "TiempoTotal");
      if (text_nodo==undefined) {
        text_nodo=0
      }
    }

    //Unit cost
    if (optionColor==4) {
      var alfa = map(table.getNum(i, "stageCost"), minNodeCost, maxNodeCost, 50, 200);
      var c = color(103, 0, 13, alfa);
      var text_nodo = table.get(i, "stageCost");
      if (text_nodo==undefined) {
        text_nodo=0
      }
    }

    //Unit time
    if (optionColor==5) {
      var alfa = map(table.getNum(i, "stageTime"), minNodeTime, maxNodeTime, 50, 200);
      var c = color(8, 81, 156, alfa);
      var text_nodo = table.get(i, "stageTime");
      if (text_nodo==undefined) {
        text_nodo=0
      }
    }

    stroke(c);
    fill(c);
    setXY(x, y, deltax, deltay, scalevalue, text_nodo);
  }

  //----------------------PANELS ------------------------

  noStroke();
  fill(239, 237, 245);
  rect(0, height- 20, width, height); // botom pannel//vb
  rect(width - 200, 0, width, height); //right panel

  textFont('Helvetica');
  textSize(19);
  fill(0, 102, 153);
  text("Total Supply Network Data: ", width-180, 20, 160, 160); //vb

  var n_dist = 51; //vb
  textFont('Helvetica');//vb
  textSize(16); //vb
  fill(0, 102, 153);//vb
  text("Cost: " + round(costoTotal, 2), width-180, 90); //vb
  text("Avg. Cost: " + round(costoTotal/n_dist, 2), width-180, 110); //vb

  text("Time: " + round(tiempoTotal, 2), width-180, 140); //vb
  text("Avg. Time: " + round(tiempoTotal/n_dist, 2), width-180, 160); //vb

  if (optionColor==1) {
    //REFERENCIAS
    //PART
    stroke(219, 50, 54);
    fill(219, 50, 54);
    ellipse(width-180, height-200, 10, 10);  
    noStroke();
    textSize(15);
    fill(0, 102, 153);
    text("Product/Raw Materials ", width-170, height-195);

    //TRANSPORT
    stroke(244, 194, 13);
    fill(244, 194, 13);
    ellipse(width-180, height-180, 10, 10);  
    noStroke();
    textSize(15);
    fill(0, 102, 153);
    text("Transport ", width-170, height-175);

    //MANUFACT
    stroke(60, 186, 84);
    fill(60, 186, 84);
    ellipse(width-180, height-160, 10, 10);  
    noStroke();
    textSize(15);
    fill(0, 102, 153);
    text("Manufacturing ", width-170, height-155);

    //DISTRIBUTION
    stroke(72, 133, 237);
    fill(72, 133, 237);
    ellipse(width-180, height-140, 10, 10);  
    noStroke();
    textSize(15);
    fill(0, 102, 153);
    text("Distribution ", width-170, height-135);
  }

  //HISTOGRAMA TIEMPO
  if (optionColor==3) {
    if (flaghistogram) {
      //print("adentro");
      histogram();
    }
  }

  //TIME
  if (optionColor==3) {
    //valueslider = slider.value();
    //text("Time: "+valueslider, width-130, 530);
  }

  if (selected) {
    textFont('Helvetica');
    textSize(16);
    fill(0, 102, 153);
    noStroke();
    text("Stage Name: " + selectedNodeid, width-180, 340, 150, 100 ); 
    text("Unitary Cost: " + selectedCost, width-180, 390, 150, 100); 
    text("Unitary Stage Time: " + selectedTime, width-180, 420, 150, 100);
  }
}

//NODOS
function setXY(puntox, puntoy, deltax, deltay, scalevalue, texto) {
  var x = map(puntox, 16 - deltax, 340 - deltax - scalevalue, 50, height - 100);
  var y = map(puntoy, 16 - deltay, 1200 - deltay - scalevalue, 50, width - 100);
  ellipse(x, y, 20, 20);
  textFont('Helvetica');
  textSize(14);
  fill(117, 107, 177);
  noStroke();
  text(texto, x +7, y - 7);
}

function arcXY(xsource, ysource, xdest, ydest, deltax, deltay, scalevalue) {
  var x1 = map(xsource, 16 - deltax, 340 - deltax - scalevalue, 50, height - 100); 
  var x2 = map(xdest, 16 - deltax, 340 - deltax - scalevalue, 50, height - 100); 
  var y1 = map(ysource, 16 - deltay, 1200 - deltay - scalevalue, 50, width - 100); 
  var y2 = map(ydest, 16 - deltay, 1200 - deltay - scalevalue, 50, width - 100); 
  line(x1, y1, x2, y2);
}

function mouseDragged() {
  move = true;
}

function mousePressed() {
  mouseXpressed = mouseX;
  mouseYpressed = mouseY;
  olddeltax = deltax;
  olddeltay = deltay;
}

function mouseReleased() {
  move = false;
  if (selected & optionColor==3) {
    selectedrow = table.findRows(selectedNodeid, "Stage Name");
    //print(selectedrow);
    selectedrow[0].set("stageTime", valueslider);
    //assignDemand(val);
  }
}

function doubleClicked() {
  scalevalue ++;
}

function mouseWheel(event) {
  scalevalue = scalevalue + event.delta / 2;
}

function mouseClicked() {

  if (mouseX<width - 200) {
    selected = false;
  }

  for (var i = 0; i < table.getRowCount(); i++) {
    var puntox = table.getNum(i, "xPosition");
    var puntoy = table.getNum(i, "yPosition");
    var x = map(puntox, 16 - deltax, 340 - deltax - scalevalue, 50, height - 100); 
    var y = map(puntoy, 16 - deltay, 1200 - deltay - scalevalue, 50, width - 100); 
    var d = dist(mouseX, mouseY, x, y);
    if (d<10) {
      selected = true;
      selectedNodeid = table.getString(i, "Stage Name");
      index = table.getNum(i, "index");
      selectedCost = table.getNum(i, "stageCost");
      selectedTime = table.getNum(i, "stageTime");
      selectedBranchCost = table.get(i, "CostoTotal");
      selectedDeph = table.get(i, "relDepth");
      if (selectedBranchCost!=undefined) {
        selectedBranchCost = float(selectedBranchCost);
      } else {
        selectedBranchCost=0
      }

      //selectedBranchCost = table.getNum(i, "CostoTotal");

      if (selectedDeph==0) {
        selectBranch(selectedNodeid, index);
      }

      //plot histograma
      var selectedstegatime1 = table.get(i, "stageTime_1");
      flaghistogram=false;
      if (selectedstegatime1 != "") {
        //print("flag histogram true");
        flaghistogram = true;
      }
    }
  }
}

function histogram() {
  if (selected) {
    rowselected = table.findRows(selectedNodeid, "Stage Name");
    textFont('Helvetica');
    textSize(10);
    fill(117, 107, 177);
    noStroke();

    //col 1
    values1 = getValue(rowselected, "stageTime_1", "stageTime_%_1");
    ejey1 = (map(values1[1], 0, 100, 0, 50))*5;  //prob
    ejex1 = map(values1[0], 10, 40, 0, 50); // valor
    text(str(values1[1])+"%", width-180, height-180-ejey1);  //string valor prob
    text(str(values1[0]), width-180-5+25, height-160); // string valor valor
    print("ejex"+ejex1);
    print("ejey"+ejey1);
    rect(width-180+25, height-180, 20, -ejey1);

    //col 2
    values2 = getValue(rowselected, "stageTime_2", "stageTime_%_2");
    ejey2 = (map(values2[1], 0, 100, 0, 50))*5;  //prob
    ejex2 = map(values2[0], 10, 40, 0, 50); // valor
    text(str(values2[1])+"%", width-180, height-180-ejey2);  //string valor prob
    text(str(values2[0]), width-180-5+45, height-160); // string valor valor
    print("ejex"+ejex2);
    print("ejey"+ejey2);
    rect(width-180+45, height-180, 20, -ejey2);

    //col 3
    values3 = getValue(rowselected, "stageTime_3", "stageTime_%_3");
    ejey3 = (map(values3[1], 0, 100, 0, 50))*5;  //prob
    ejex3 = map(values3[0], 10, 40, 0, 50); // valor
    text(str(values3[1])+"%", width-180, height-180-ejey3);  //string valor prob
    text(str(values3[0]), width-180-5+65, height-160); // string valor valor
    print("ejex"+ejex3);
    print("ejey"+ejey3);
    rect(width-180+65, height-180, 20, -ejey3);

    //col 4
    values4 = getValue(rowselected, "stageTime_4", "stageTime_%_4");
    ejey4 = (map(values4[1], 0, 100, 0, 50))*5;  //prob
    ejex4 = map(values4[0], 10, 40, 0, 50); // valor
    text(str(values4[1])+"%", width-180, height-180-ejey4);  //string valor prob
    text(str(values4[0]), width-180-5+85, height-160); // string valor valor
    print("ejex"+ejex4);
    print("ejey"+ejey4);
    rect(width-180+85, height-180, 20, -ejey4);

    //col 5
    values5 = getValue(rowselected, "stageTime_5", "stageTime_%_5");
    ejey5 = (map(values5[1], 0, 100, 0, 50))*5;  //prob
    ejex5 = map(values5[0], 10, 40, 0, 50); // valor
    text(str(values5[1])+"%", width-180, height-180-ejey5);  //string valor prob
    text(str(values5[0]), width-180-5+105, height-160); // string valor valor
    print("ejex"+ejex5);
    print("ejey"+ejey5);
    rect(width-180+105, height-180, 20, -ejey5);

    //col 6
    values6 = getValue(rowselected, "stageTime_6", "stageTime_%_6");
    ejey6 = (map(values6[1], 0, 100, 0, 50))*5;  //prob
    ejex6 = map(values6[0], 10, 40, 0, 50); // valor
    text(str(values6[1])+"%", width-180, height-180-ejey6);  //string valor prob
    text(str(values6[0]), width-180-5+125, height-160); // string valor valor
    print("ejex"+ejex6);
    print("ejey"+ejey6);
    rect(width-180+125, height-180, 20, -ejey6);
  }

  function getValue(rowselected, columnName, probName) {
    value = rowselected[0].get(columnName);
    if (value != undefined) {
      value = float(value);
    } else {
      value =0;
    }

    prob = rowselected[0].get(probName);
    if (prob != undefined) {
      prob = float(prob);
    } else {
      prob =0;
    }
    return [value, prob];
  }
}



function totalCost() {
  var destinationList = linea.findRows("1", "start_flag");
  //print("LENGTH" + str(destinationList.length));
  costoTotal = 0;
  tiempoTotal = 0;

  for (var i = 0; i < destinationList.length; i++) {
    var result = forOne(destinationList[i]);
    costoTotal += result[0]; //costo
    tiempoTotal += result[1]; //tiempo
    index = destinationList[i].getNum("index_destination");
    table.setNum(index, "CostoTotal", result[0]);
    table.setNum(index, "TiempoTotal", result[1]);
  }

  //print("COSTO total" + costoTotal + "Tiempo total", tiempoTotal);

  function recorrer(rows) {
    var ctotal = 0;
    var ttotal = 0;
    var nombreNodo = rows[0].getString("destinationStage");
    var result = recCosto(nombreNodo);
    ctotal += result[0]; //costo
    ttotal += result[1]; //tiempo

    for (var i = 0; i < rows.length; i++) {
      var padre = rows[i].getString("sourceStage");

      //print("RECORRER " + nombreNodo + " costo " + result[0] + "tiempo " + result[1] + " padre " + padre);
      var destlist = linea.findRows(padre, "destinationStage");
      if (destlist.length!=0) {
        var result = recorrer(destlist);
        ctotal += result[0]; //costo
        ttotal += result[1]; //tiempo
      } else {
        var resultPadre = recCosto(padre);
        //print("LAST NODO " + padre + " costo " + resultPadre[0] + "tiempo "+ resultPadre[1]);
        ctotal += resultPadre[0];
        ttotal += resultPadre[1];
      }
    }
    return [ctotal, ttotal];
  }

  function forOne(row) {
    var ctotal = 0;
    var ttotal = 0;

    var result = recCosto(row.getString("destinationStage"));
    ctotal += result[0]; //cost
    ttotal += result[1]; //time

    //print("RECCOSTO "+ result[0]+"tiempo"+result[1]);

    var padre = row.getString("sourceStage");
    var destlist = linea.findRows(padre, "destinationStage");
    if (destlist.length!=0) {
      var result = recorrer(destlist);
      ctotal += result[0]; //costo
      ttotal += result[1]; //tiempo
    }
    return [ctotal, ttotal];
  }

  function recCosto(nombreNodo) {
    var costo = table.findRows(nombreNodo, "Stage Name");
    return [costo[0].getNum("stageCost"), costo[0].getNum("stageTime")];
  }
}

function selectBranch(nombreNodo, index) {
  //blanquea
  for (var i = 0; i < table.getRowCount(); i++) {
    table.setNum(i, "BranchSelected", 0);
  }
  for (var i = 0; i < linea.getRowCount(); i++) {
    linea.setNum(i, "BranchSelected", 0);
  }


  //setea nodo
  table.setNum(index, "BranchSelected", 1);
  var nodo = linea.findRows(nombreNodo, "destinationStage");
  nodo[0].set("BranchSelected", 1);
  var padre = nodo[0].getString("sourceStage");
  var lista = linea.findRows(padre, "destinationStage");
  recursivo(lista);

  function recursivo(lista) {
    for (var i = 0; i < lista.length; i++) {
      lista[i].setNum("BranchSelected", 1);
      index = lista[i].getNum("index_destination");
      //print(index);
      table.setNum(index, "BranchSelected", 1);
      var padre = lista[i].getString("sourceStage");
      var listanueva = linea.findRows(padre, "destinationStage");
      if (listanueva.length > 0) {
        recursivo(listanueva);
      } else {
        indexpadre = table.findRows(padre, "Stage Name")[0].get("index");
        table.setNum(indexpadre, "BranchSelected", 1);
      }
    }
  }
}

//function assignDemand(val) {
//  print(val);
//  var retails = table.findRows(0, "relDepth");

//  //blanquea
//  for (var i = 0; i < retails.length; i++) {
//    retails[i].setNum("Supply", 0);
//  }
//  var loops = 0;
//  while (val>0 & loops < 10000) {
//    //  loop++;
//    for (var i = 0; i < retails.length; i++) {
//      //    if (val>0) {
//      //      print(val);
//      //      oldvalue = retails[i].get("Supply");
//      //      retails[i].setNum("Supply", oldvalue+1);
//      val=val-1;
//    }
//    //  }
//  }
//}
