// import * as faceapi from '@vladmandic/face-api';
// import { Canvas, Image, ImageData } from 'canvas';
// import fs from 'fs';

// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// export async function loadFaceModels(modelPath) {
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
//     await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
//     await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
// }

// export async function detectFace(imagePath) {
//     const img = new Canvas.Image();
//     img.src = fs.readFileSync(imagePath);
//     const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
//     return detection ? detection.descriptor : null;
// }
