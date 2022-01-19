import * as moment from 'moment';

export const serialize = ({ address, name, cpf, birthdate, coins, created_at, updated_at }): object => {
  for (const iterator of coins) {
    delete iterator.idCoin;
  }
  return {
    address: address,
    name: name,
    cpf: cpf,
    birthdate: moment(birthdate).format('DD/MM/YYYY'),
    coins: coins,
    createAt: created_at,
    updatedAt: updated_at
  };
};

export const SerializeWalletCreate = ({ address, name, cpf, birthdate, created_at, updated_at }): object => {
  return {
    address: address,
    name: name,
    cpf: cpf,
    birthdate: moment(birthdate).format('DD/MM/YYYY'),
    createAt: created_at,
    updatedAt: updated_at
  };
};

export const paginatedSerializeWallet = ({ items, meta }): object => {
  return {
    wallets: items.map(serialize),
    total: meta.totalItems,
    limit: meta.itemsPerPage,
    offset: meta.currentPage,
    offsets: meta.totalPages
  };
};
