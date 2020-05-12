const fs = require("fs");

function addLayerToLambda(lambdaApi, functionName, layerArn, resolve, reject) {
  const params = {
    FunctionName: functionName,
    Layers: [layerArn],
    Runtime: "provided",
  };
  lambdaApi.updateFunctionConfiguration(params, (err) => {
    if (err) {
      console.error(err);
      reject();
    }
    console.log("Relay layer added");
    resolve();
  });
}

function createAndAddLambdaLayer(lambdaApi, functionName) {
  console.log("Uploading Lamba Layer...");
  let data;
  try {
    data = fs.readFileSync("resources/layer.zip");
  } catch (err) {
    console.error(err);
  }

  const params = {
    Content: {
      ZipFile: data,
    },
    LayerName: "test-node10-layer",
  };
  return new Promise((resolve, reject) => {
    lambdaApi.publishLayerVersion(params, (err, layer) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        console.log("Layer uploaded. Adding to function...");
        const arn = layer.LayerVersionArn;
        addLayerToLambda(lambdaApi, functionName, arn, resolve, reject);
      }
    });
  });
}

function removeLambdaLayer(lambdaApi, lambdaName) {
  const params = {
    FunctionName: lambdaName,
    Runtime: "nodejs10.x",
  };
  lambdaApi.updateFunctionConfiguration(params, (err, data) => {
    if (err) {
      console.error(err);
    }
    console.log(data);
  });
}

module.exports = {
  createAndAddLambdaLayer,
  removeLambdaLayer,
};