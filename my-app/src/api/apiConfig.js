
  
  const apiConfig = {
    baseUrl: 'http://localhost:8000',
    articlesEndpoint: '/article/up_articles/',
    articleEndpoint: '/article/up_article/',
    pdfEndpoint: '/article/up_article/serve-unpublished-article-pdf/',
    deleteArticleEndPoint:'/article/up_article/delete/',
    validateArticleEndPoint:'/article/up_article/validate/',
    updateArticleEndPoint:'/article/up_article/update/',
    uploadDrive: '/myapp/uploadDrive/',
    getUserDataEndpoint: '/api/get-data',
    logoutEndPoint: '/api/logout/',
    changeUserNameEndPoint:'/api/update-username/',
    checkUserTypeEndPoint:'/api/check',
    getFavoritesEndPoint:'/api/favorite-list/',
    addFavorite:'/api/add-favorite/',
    removeFavorite:'/api/remove-favorite/'
  };
  
  export default apiConfig;
  
  