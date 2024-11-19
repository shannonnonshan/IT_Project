import express from 'express';
import userProfileService from '../service/userProfile.service.js';
const router = express.Router();

router.get('/', async function(req,res)
{
// res.send('hello world');
    const list = await userProfileService.findAll();
    const Artistlist = await userProfileService.Artist();
    const Albumlist = await userProfileService.Album();
    const UserDashboardlist = await userProfileService.Dashboard();
    res.render('layouts/component/UserProfile', 
        {
            list:list,
            artists:Artistlist,
            album: Albumlist,
            userdashboard: UserDashboardlist,
        });
    
});
export default router;