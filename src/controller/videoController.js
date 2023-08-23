
export const trending = (req, res) => {
    const videos = [
        {
        title : "Hello",
        },
        {
            title: "Video #2",
        },
        {
            title:"Whatsup",
        }
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
