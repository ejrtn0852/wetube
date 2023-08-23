
export const trending = (req, res) => {
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
        rating : 5,
        comments : 2,
        createdAt: "2 minutes ago",
        views: 105,
        id: 3,
    },     
        
        
];
    return res.render("home", {pageTitle: "home", videos});
}
export const see = (req, res) =>  res.render("watch", {pageTitle: "watch"});
export const edit = (req, res) => res.render("edit", {pageTitle: "edit"});
export const search = (req, res) => res.send("search!");
export const upload = (req, res) => res.send("upload!");
export const deleteVideo = (req, res) => {
    return res.send("deleteVideo!");
}
