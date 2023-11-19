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
  const { cliente, productos, detalle } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO pedido (cliente, productos, detalle, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [cliente, productos, detalle, req.userId]
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
  const { productos } = req.body;

  const result = await pool.query(
    "UPDATE pedido SET productos = $1 WHERE id = $2",
    [productos, id]
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

//actualizar eliminar
export const eliminarPresupuestoProducto = async (req, res) => {
  const productIdToDelete = req.params.id;

  try {
    // Fetch the current JSON data from the database
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE productos @> $1",
      [`{"respuesta": [{"id": ${productIdToDelete}}]}`]
    );

    if (result.rows.length === 0) {
      pool.release();
      return res.status(404).json({
        message: "No existe ningún producto con ese id",
      });
    }

    const existingJson = result.rows[0].tu_columna_json;

    // Remove the item with the specified id from the array
    const updatedRespuesta = existingJson.respuesta.filter(
      (item) => item.id !== parseInt(productIdToDelete)
    );

    // Update the database with the modified JSON
    await pool.query("UPDATE pedido SET productos = $1 WHERE productos @> $2", [
      JSON.stringify({ respuesta: updatedRespuesta }),
      `{"respuesta": [{"id": ${productIdToDelete}}]}`,
    ]);

    pool.release();
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error during delete operation:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
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
