module.exports = {
  // controller 使用
  getOffset: (limit = 10, page = 1) => (page - 1) * limit,
  getPagination: (limit = 10, page = 1, total = 50) => {
    const totalPage = Math.ceil(total / limit)
    const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
    let pages = []
    if (totalPage <= 10) {
      pages = Array.from({ length: totalPage }, (_, index) => index + 1)
    } else {
      pages = Array.from({ length: 10 }, (_, index) => index + Math.floor(page / 10) * 10 + 1)
    }
    const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
    const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
    return {
      pages,
      totalPage,
      currentPage,
      prev,
      next
    }
  }

}
