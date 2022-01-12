const serialize = ({
    address,
    name,
    cpf,
    birthdate
}): object => {
    return { address, name, cpf, birthdate};
};

export const paginatedSerializeWallet = ({ items, meta }): object => {
return {
    wallet: items.map(serialize),
    total: meta.totalItems,
    limit: meta.itemsPerPage,
    offset: meta.currentPage,
    offsets: meta.totalPages,
};
};
  