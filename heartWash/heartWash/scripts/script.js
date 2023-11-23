const Scene = require('Scene');
const Patches = require('Patches');
const Reactive = require('Reactive');

Promise.all([
  Scene.root.findFirst('forehead3D'),
]).then(function (results) {
  const forehead3D = results[0];
  var forehead2D = Scene.projectToScreen(forehead3D.worldTransform.position);

  Patches.outputs.getPoint("forehead3D").then(pointSignal => {
    Patches.inputs.setPoint2D('forehead2D', forehead2D);
  })
})