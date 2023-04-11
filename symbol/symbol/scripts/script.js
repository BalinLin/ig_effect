/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Meta Spark Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// Meta Spark Studio extension for VS Code - https://fb.me/spark-vscode-plugin
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

// How to load in modules
const Scene = require('Scene');
const FaceTracking = require('FaceTracking');
const Reactive = require('Reactive');
const Animation = require('Animation');
const Time = require('Time');
const Random = require('Random');

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');
export const timeInMilliseconds = 100;
export const timeDriverParameters = {
  durationMilliseconds: 1000,
  loopCount: Infinity,
  mirror: false
};

// Use import keyword to import a symbol from another file
import { makesymbol } from './tools.js'

let _objs = {};
let _snapShot = {};

let count = 0;
let numOfText = 10;
let jitterRatio = 30;
let textOffset = 0.01;

(async function () {  // Enables async/await in JS [part 1]

  Diagnostics.log('Console message logged from the script.');

  await Start();
  const interval = Time.setIntervalWithSnapshot(_snapShot, outputSymbol, timeInMilliseconds);

})(); // Enables async/await in JS [part 2]

async function Start () {
  _objs.face = FaceTracking.face(0);
  _objs.symbols = await Scene.root.findByPath('Device/Camera/Focal Distance/faceTracker0/**');


  _snapShot.faceRotationX = _objs.face.cameraTransform.rotationX;
  _snapShot.faceRotationY = _objs.face.cameraTransform.rotationY;
  _snapShot.faceRotationZ = _objs.face.cameraTransform.rotationZ;

  _snapShot.mouthCenter = _objs.face.mouth.center;
  _snapShot.mouthOpenness = _objs.face.mouth.openness;
}

function outputSymbol (time, data) {

  let hid = Reactive.lt(data.mouthOpenness, 0.2);
  let symbol = _objs.symbols[count];
  count = (count + 1) % numOfText;
  symbol.text = makesymbol(1);
  symbol.hidden = hid;

  symbol.transform.rotationX = data.faceRotationX;
  symbol.transform.rotationY = data.faceRotationY;
  symbol.transform.rotationZ = data.faceRotationZ;

  // Create a time driver using the parameters
  const timeDriver = Animation.timeDriver(timeDriverParameters);

  const quadraticSamplerX = Animation.samplers.easeInOutQuad(data.mouthCenter.x - textOffset, data.mouthCenter.x + (Random.random() - 0.5) / jitterRatio);
  const translationAnimationX = Animation.animate(timeDriver, quadraticSamplerX);
  symbol.transform.x = translationAnimationX;

  const quadraticSamplerY = Animation.samplers.easeInOutQuad(data.mouthCenter.y + textOffset + data.mouthOpenness * 0.01, data.mouthCenter.y + (Random.random() - 0.5) / jitterRatio);
  const translationAnimationY = Animation.animate(timeDriver, quadraticSamplerY);
  symbol.transform.y = translationAnimationY;

  const quadraticSamplerZ = Animation.samplers.easeInOutQuad(data.mouthCenter.z, 0.1 + Random.random() / 2);
  const translationAnimationZ = Animation.animate(timeDriver, quadraticSamplerZ);
  symbol.transform.z = translationAnimationZ;
  // _objs.symbol.transform.z = face.cameraTransform.applyToPoint(mouth.center).z.add(translationAnimation).add(0.1);

  timeDriver.start();
}
