function genFileId(path, file) {
  return `${path}/${file}`.replace(/\//g, '_');
}

export default function groupAst(astList) {
  let files = {};

  astList.forEach((item) => {
    if (item.meta && item.meta.filename && item.meta.path) {
      let id = genFileId(item.meta.path, item.meta.filename);
      files[id] = files[id] || [];
      files[id].push(item);
    }
  });

  return files;
}
