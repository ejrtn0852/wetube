import Video from "../models/Video";

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "home" });
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
