const serialize = ({ value, datetime, sendTo, receiveFrom, currentCotation }): object => {
  return { value, datetime, sendTo, receiveFrom, currentCotation };
};

export const paginatedSerializeWallet = ({ items, meta }): object => {
  return {
    wallet: items.map(serialize),
    total: meta.totalItems,
    limit: meta.itemsPerPage,
    offset: meta.currentPage,
    offsets: meta.totalPages
  };
};
