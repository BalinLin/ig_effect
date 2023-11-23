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
const Materials = require('Materials');
const Scene = require('Scene');
const Reactive = require('Reactive');
const HandTracking = require('HandTracking');
const Textures = require('Textures');
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

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

let _objs = {};
let _snapShot = {};
let count = 0.01;

(async function () {  // Enables async/await in JS [part 1]

  Diagnostics.log('Console message logged from the script.');

  await Start();
  const interval = Time.setIntervalWithSnapshot(_snapShot, outputSymbol, timeInMilliseconds);

})(); // Enables async/await in JS [part 2]

async function Start () {
  const [plane, material] = await Promise.all([
    Scene.root.findFirst('plane0'),
    Materials.findFirst('material0')
  ]);

  _objs.hand = HandTracking.hand(0);
  _objs.plane = plane;
  _objs.material = material;

  _objs.plane.material = _objs.material;

  _snapShot.handRotationX = _objs.hand.cameraTransform.rotationX;
  _snapShot.handRotationY = _objs.hand.cameraTransform.rotationY;
  _snapShot.handRotationZ = _objs.hand.cameraTransform.rotationZ;

  _snapShot.bbox = _objs.hand.boundingBox;

  _snapShot.planeX = _objs.plane.x;
  _snapShot.planeY = _objs.plane.y;
  _snapShot.planeHeight = _objs.plane.height;
  _snapShot.planeWidth = _objs.plane.width;
}

function outputSymbol (time, data) {

  // let hid = Reactive.lt(data.mouthOpenness, 0.2);
  count = (count + 0.01) % 1;
  _objs.material.opacity = count;

  const distance = Reactive.distance(data.bbox.center, Reactive.point(data.planeX, data.planeY));

  // if (distance < (object1Bounds.width + object2Bounds.width) / 2) {
  //   // Collision happened
  //   // Add your code here
  // }

  // plane.hidden = handCount.eq(0);
  // symbol.transform.rotationX = data.faceRotationX;
  // symbol.transform.rotationY = data.faceRotationY;
  // symbol.transform.rotationZ = data.faceRotationZ;

  // Create a time driver using the parameters
  // const timeDriver = Animation.timeDriver(timeDriverParameters);

  // const quadraticSamplerX = Animation.samplers.easeInOutQuad(data.mouthCenter.x - textOffset, data.mouthCenter.x + (Random.random() - 0.5) / jitterRatio);
  // const translationAnimationX = Animation.animate(timeDriver, quadraticSamplerX);
  // symbol.transform.x = translationAnimationX;

  // const quadraticSamplerY = Animation.samplers.easeInOutQuad(data.mouthCenter.y + textOffset + data.mouthOpenness * 0.01, data.mouthCenter.y + (Random.random() - 0.5) / jitterRatio);
  // const translationAnimationY = Animation.animate(timeDriver, quadraticSamplerY);
  // symbol.transform.y = translationAnimationY;

  // const quadraticSamplerZ = Animation.samplers.easeInOutQuad(data.mouthCenter.z, 0.1 + Random.random() / 2);
  // const translationAnimationZ = Animation.animate(timeDriver, quadraticSamplerZ);
  // symbol.transform.z = translationAnimationZ;
  // _objs.symbol.transform.z = face.cameraTransform.applyToPoint(mouth.center).z.add(translationAnimation).add(0.1);

  // timeDriver.start();
}