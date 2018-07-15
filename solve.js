// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
// Imports the Simplex Solver package
const simplex = require('simplex-solver');

// Creates an authenticated client
const client = new vision.ImageAnnotatorClient({
  keyFilename: './[path-for-your-auth-file].json'
});

var system;         // A system is a set of several equations
var equations = [];
var eqMax;          // eqMax is the equation to be maximized

// Look for image path in the arguments
var imagePath = process.argv[2];
if(!imagePath)
  console.log("ERROR: Image path not especified.");
else {
  // Performs text detection on image
  client.textDetection(imagePath).then(results => {
  
    if(results[0].error) {
      console.log(results[0].error.message);
    }
    else {
      system = results[0].fullTextAnnotation.text.split('\n');
  
      system = system.filter(function (equation) {
          return equation.match(/[0-9]/g);
      });
      eqMax = system.shift();
  
      if (eqMax.toUpperCase().includes('MAX')) {
          eqMax = eqMax.replace('MAX', '');
          createSystem();
      }
      else if (eqMax.toUpperCase().includes('MAXIMIZE')) {
          eqMax = eqMax.replace('MAXIMIZE', '');
          createSystem();
      }
      else {
        console.log('ERROR: MAX or MAXIMIZE command could not be found.');
      }
    }
  }).catch(err => {
    console.error(err);
  });
}

createEquation = function (line, isEqMax) {
  var regex;
  var regexBuild;
  var variable;
  var equation = '';

  line = line.replace('O', '0');

  for (var j = 1; ; j++) {
      regexBuild = `[0-9]+[a-zA-Z]${j}`;
      regex = new RegExp(regexBuild, 'g');

      variable = line.match(regex);
      if (!variable) {
          if (!isEqMax) {
              variable = line.match(/[<>=][ ]?[0-9]+/g);
              equation += ' ';
              equation += variable || '<= ' + line.match(/(\d+)(?!.*\d)/g);
              equation = equation.replace('<', '<=').replace('>', '>=');
          }
          break;
      }
      equation += j == 1 ? variable : ' + ' + variable;
      line = line.replace(variable, '');
  }
  return equation;
};

createSystem = function () {
  for (var i = 0; i < system.length; i++) {
      equations[i] = '';
      equations[i] = createEquation(system[i]);
  }
  eqMax = createEquation(eqMax, true);

  console.log("MAX " + eqMax + "\nSUBJECT TO:");
  console.log(equations);

  // Using the Simplex Solver
  var answer = simplex.maximize(eqMax, equations);
  if(!answer)
    console.log("ERROR: Unable to solve this system.");
  else {
    console.log("\nANSWER:\nMAX: " + answer.max + "\nVARIABLES:");
    var steps = answer.tableaus;
    delete answer.max;
    delete answer.tableaus;
    console.log(answer);

    // Look for step-by-step argument
    if(process.argv[3] == "--step-by-step") {
      console.log("STEPS:");
      steps.forEach(function(e) {
        console.log("VARIABLES: " + e.variables + "\nROWS: ");
        console.log(e.rows);
        if(e.pivot)
          console.log("PIVOT ROW : " + e.pivot.row + " PIVOT COLUMN:" + e.pivot.column);
      });
    }
  }
};