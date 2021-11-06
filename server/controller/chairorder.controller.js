const db = require('server/helper/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll() {
  return await db.ChairOrder.findAll({
    include: [{ model: db.User, as: 'salesman', attributes: ['email'] }],
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getChairOrder(id);
}

async function create(params) {
  const {
    chairBrandId,
    chairModelId,
    frameColorId,
    backColorId,
    seatColorId,
    chairRemark,
    ...restParams
  } = params;
  const stockParams = {
    chairBrandId,
    chairModelId,
    frameColorId,
    backColorId,
    seatColorId,
    chairRemark,
  };
  let chairStock = await db.ChairStock.findOne({
    where: stockParams,
  });
  if (!chairStock)
    chairStock = await db.ChairStock.create({ QTY: 0, ...stockParams });
  restParams.stockId = chairStock.id;
  await db.ChairOrder.create(restParams);
}

async function update(id, params) {
  const chairOrder = await getChairOrder(id);
  Object.assign(chairOrder, params);
  await chairOrder.save();
  return chairOrder.get();
}

async function _delete(id) {
  const chairOrder = await getChairOrder(id);
  await chairOrder.destroy();
}

async function _bulkDelete(where) {
  return await db.ChairOrder.destroy({ where });
}

//helper function

async function getChairOrder(id) {
  const chairOrder = await db.ChairOrder.findByPk(id);
  if (!chairOrder) throw 'ChairOrder was not found.';
  return chairOrder;
}
