module.exports = {
     getPagination : (page, size) => {
        const limit = size ? +size : 5;
        const offset = page ? (page-1) * limit : 0;
      
        return { limit, offset };
      },
     getPagingData : (data, page, limit) => {
        const { count: totalrows, rows: pageData } = data;
        const currentPage = page ? +page : 1;
        const totalPages = Math.ceil(totalrows / limit);
      
        return { totalrows, pageData, totalPages, currentPage };
      }
}
