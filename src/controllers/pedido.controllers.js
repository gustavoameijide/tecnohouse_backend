import { pool } from "../db.js";

//obtener presupuestos
export const getPresupuestos = async (req, res, next) => {
  const result = await pool.query("SELECT * FROM pedido WHERE user_id = $1", [
    req.userId,
  ]);
  return res.json(result.rows);
};

//obtener pedido
export const getPresupuesto = async (req, res) => {
  const result = await pool.query("SELECT * FROM pedido WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun pedido con ese id",
    });
  }

  return res.json(result.rows[0]);
};

//crear pedido
export const createPresupuesto = async (req, res, next) => {
  const { cliente, pedido, detalle } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO pedido (cliente, pedido,detalle user_id) VALUES ($1, $2, $3,$4) RETURNING *",
      [cliente, pedido, detalle, req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un pedido con ese id",
      });
    }
    next(error);
  }
};

//actualizar cliente
export const actualizarPresupuesto = async (req, res) => {
  const id = req.params.id;
  const { pedido } = req.body;

  const result = await pool.query(
    "UPDATE pedido SET pedido = $1 WHERE id = $2",
    [pedido, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun pedido con ese id",
    });
  }

  return res.json({
    message: "Presupuesto actualizado",
  });
};

//actualizar eliminar
export const eliminarPresupuesto = async (req, res) => {
  const result = await pool.query("DELETE FROM pedido WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun pedido con ese id",
    });
  }

  return res.sendStatus(204);
};

//generar presupuesto factura
// export const facturaPresupuesto = async (req, res) => {
//   const result = await pool.query("SELECT * FROM presupuesto WHERE id = $1", [
//     req.params.id,
//   ]);

//   if (result.rowCount === 0) {
//     return res.status(404).json({
//       message: "No existe ningun presupuestro con ese id",
//     });
//   }

//   return res.json(result.rows[0]);
// };
