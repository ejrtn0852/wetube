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
export const edit = (req, res) => res.render("edit", {pageTitle: "edit"});
export const search = (req, res) => res.send("search!");
export const upload = (req, res) => res.send("upload!");
export const deleteVideo = (req, res) => {
    return res.send("deleteVideo!");
}
