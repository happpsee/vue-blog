const FILTER_MAP = {
  "Article": (article, user) => {
    console.log(article, user, 'article, user');
    return article;
  }
}

module.exports = {FILTER_MAP};