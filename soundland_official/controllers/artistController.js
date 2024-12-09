// import { recognizeArtist } from '../services/faceRecognitionService.js'; // Import dịch vụ nhận diện nghệ sĩ

// export async function handleArtistRecognition(req, res) {
//     try {
//         const uploadedImagePath = req.file.path;  // Đường dẫn đến ảnh tải lên (nếu sử dụng multer để upload ảnh)
//         const artistsFolderPath = './artists';  // Đường dẫn đến thư mục chứa ảnh nghệ sĩ

//         const artist = await recognizeArtist(uploadedImagePath, artistsFolderPath);
        
//         res.json({
//             message: `Nghệ sĩ nhận diện: ${artist}`
//         });
//     } catch (error) {
//         console.error('Lỗi khi nhận diện nghệ sĩ:', error);
//         res.status(500).json({
//             message: 'Có lỗi xảy ra khi nhận diện nghệ sĩ.'
//         // });
//     }
// }
