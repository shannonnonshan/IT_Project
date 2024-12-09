// import fs from 'fs';
// import path from 'path';
// import { detectFace } from './faceRecognitionService.js';

// export async function loadArtistsImages(artistDir) {
//     const artists = {};
//     const folders = fs.readdirSync(artistDir);

//     for (const folder of folders) {
//         const folderPath = path.join(artistDir, folder);
//         if (fs.statSync(folderPath).isDirectory()) {
//             const imagePaths = fs.readdirSync(folderPath).map(file => path.join(folderPath, file));
//             const faceDescriptors = [];

//             for (const imagePath of imagePaths) {
//                 const descriptor = await detectFace(imagePath);
//                 if (descriptor) faceDescriptors.push(descriptor);
//             }

//             artists[folder] = faceDescriptors;
//         }
//     }

//     return artists;
// }

// export async function identifyArtist(uploadedImagePath, artistsData) {
//     const uploadedDescriptor = await detectFace(uploadedImagePath);
//     if (!uploadedDescriptor) return null;

//     let bestMatch = { artist: null, distance: Infinity };

//     for (const [artist, descriptors] of Object.entries(artistsData)) {
//         for (const descriptor of descriptors) {
//             const distance = faceapi.euclideanDistance(uploadedDescriptor, descriptor);
//             if (distance < bestMatch.distance) {
//                 bestMatch = { artist, distance };
//             }
//         }
//     }

//     return bestMatch.artist;
// }
