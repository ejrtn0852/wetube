const videos = [
    {
        title : "First Video",
        rating : 5,
        comments : 2,
        createdAt: "2 minutes ago",
        views: 9,
        id: 1,
    },
    {
        title : "Second Video",
        rating : 5,
        comments : 2,
        createdAt: "2 minutes ago",
        views: 32,
        id: 2,
    },
    {
        title : "Third Video",
        rating : 4,
        comments : 2,
        createdAt: "2 minutes ago",
        views: 105,
        id: 3,
    },
    
];


export const trending = (req, res) => {
    return res.render("home", {pageTitle: "home", videos});
}
export const watch = (req, res) =>  {
    const { id } = req.params;
    const video = videos[id-1];
    return res.render("watch", {pageTitle: `Wathing ${video.title}`, video});
}
export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1];
    return res.render("edit", {pageTitle: `Editing: ${video.title}`,video});
}
export const postEdit = (req,res) => {
    const { id } = req.params;
    const { title } = req.body;
    const { rating } = req.body;
    videos[id-1].rating = rating;
    videos[id -1].title = title;
    return res.redirect(`/video/${id}`);
};

export const getVideo = (req,res) => res.render("upload", {pageTitle:`Upload Video`});

export const postUpload = (req,res) => {
    const { title } = req.body;
    const newVideos = 
        {
            title,
            rating : 0,
            comments : 0,
            createdAt: "1 minutes ago",
            views: 0,
            id: videos.length+1,
        }
        videos.push(newVideos);
    return res.redirect("/");
}