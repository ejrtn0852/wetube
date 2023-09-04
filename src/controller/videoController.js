import Video from "../models/Video";

export const trending = async (req, res) => {
  const videos = await Video.find({});
  console.log(videos);
  return res.render("home", { pageTitle: "home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Wathing` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.render("edit", { pageTitle: `Editing:` });
};
export const postEdit = (req, res) => {
  return res.redirect(`/video/${id}`);
};

export const getVideo = (req, res) =>
  res.render("upload", { pageTitle: `Upload Video` });

export const postUpload = (req, res) => {
  const { title } = req.body;
  return res.redirect("/");
};
