exports.formatDates = list => {
  return list.map(element => {
    const newElement = { ...element };
    newElement.created_at = new Date(newElement.created_at);
    return newElement;
  });
};

exports.makeRefObj = (list, key1, key2) => {
  return list.reduce((obj, element) => {
    obj[element[key1]] = element[key2];
    return obj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const newComment = { ...comment };
    newComment.author = newComment.created_by;
    delete newComment.created_by;
    newComment.article_id = articleRef[newComment.belongs_to];
    delete newComment.belongs_to;
    return newComment;
  });
};
