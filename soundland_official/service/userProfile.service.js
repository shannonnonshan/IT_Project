export default
{
    findAll()
    {
        return[
            {UserID: 1, UserName: 'Cam', NoOfFollower:2, NoOfFollowing: 5, PublicPlaylist:2},
            {UserID: 2, UserName: 'Cam', NoOfFollower:2, NoOfFollowing: 5, PublicPlaylist:3},
            {UserID: 3, UserName: 'Cam', NoOfFollower:2, NoOfFollowing: 5, PublicPlaylist:4},
            {UserID: 4, UserName: 'Cam', NoOfFollower:2, NoOfFollowing: 5, PublicPlaylist:5},
            {UserID: 5, UserName: 'Cam', NoOfFollower:2, NoOfFollowing: 5, PublicPlaylist:6},
            {UserID: 6, UserName: 'Cam', NoOfFollower:2, NoOfFollowing: 5, PublicPlaylist:7},
            {UserID: 7, UserName: 'Cam', NoOfFollower:2, NoOfFollowing: 5, PublicPlaylist:8},
        ];
    },
    Artist()
    {
        return[
            {ArtistName: "Gracie Abrams", ArtistID: 1, ArtistPic:"/static/imgs/artist/1/main.jpg"},
            {ArtistName: "Gracie Abrams", ArtistID: 2, ArtistPic:"/static/imgs/artist/1/main.jpg"},
            {ArtistName: "Gracie Abrams", ArtistID: 3, ArtistPic:"/static/imgs/artist/1/main.jpg"},
            {ArtistName: "Gracie Abrams", ArtistID: 4, ArtistPic:"/static/imgs/artist/1/main.jpg"},
            {ArtistName: "Gracie Abrams", ArtistID: 5, ArtistPic:"/static/imgs/artist/1/main.jpg"},
        ];
    },
    Album()
    {
        return[
            {AlbumName: "Chill", AlbumID: 1, AlbumPic:"/static/imgs/album/1/main.jpg"},
            {AlbumName: "Study", AlbumID: 2, AlbumPic:"/static/imgs/album/1/main.jpg"},
            {AlbumName: "Pop", AlbumID: 3, AlbumPic:"/static/imgs/album/1/main.jpg"},
            {AlbumName: "Kpop", AlbumID: 4, AlbumPic:"/static/imgs/album/1/main.jpg"},
        ];
    },
    Dashboard()
    {
        return[
            {userID: 1, NoListenPrevious: 10345,  TimeChange:5},
            {userID: 2, NoListenPrevious: 10345,  TimeChange:5},
            {userID: 3, NoListenPrevious: 10345,  TimeChange:5},
            {userID: 4, NoListenPrevious: 10345,  TimeChange:5},
            {userID: 5, NoListenPrevious: 10345,  TimeChange:5},
        ]
    }

}