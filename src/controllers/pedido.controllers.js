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
    // Obtener los datos JSONB actuales de la base de datos
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE (productos->'respuesta')::jsonb @> $1",
      [`[{"id": ${productIdToDelete}}]`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe ningún producto con ese id",
      });
    }

    const existingJson = result.rows[0].productos;

    // Filtrar el elemento con el id especificado del array
    const updatedProductos = existingJson.respuesta.filter(
      (item) => item.id !== parseInt(productIdToDelete)
    );

    // Actualizar la base de datos con el JSON modificado
    await pool.query(
      "UPDATE pedido SET productos = $1 WHERE (productos->'respuesta')::jsonb @> $2",
      [{ respuesta: updatedProductos }, `[{ "id": ${productIdToDelete} }]`]
    );

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error durante la operación de eliminación:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const editarPresupuestoProducto = async (req, res) => {
  const productIdToEdit = req.params.id;
  const updatedProductData = req.body; // Suponiendo que recibes los nuevos datos del producto en el cuerpo de la solicitud

  try {
    // Obtener los datos JSONB actuales de la base de datos
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE (productos->'respuesta')::jsonb @> $1",
      [`[{"id": ${productIdToEdit}}]`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe ningún producto con ese id",
      });
    }

    const existingJson = result.rows[0].productos;

    // Actualizar el elemento con el id especificado en el array con los nuevos datos
    const updatedProductos = existingJson.respuesta.map((item) => {
      if (item.id === parseInt(productIdToEdit)) {
        return { ...item, ...updatedProductData };
      }
      return item;
    });

    // Actualizar la base de datos con el JSON modificado
    await pool.query(
      "UPDATE pedido SET productos = $1 WHERE (productos->'respuesta')::jsonb @> $2",
      [{ respuesta: updatedProductos }, `[{ "id": ${productIdToEdit} }]`]
    );

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error durante la operación de edición:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const obtenerValorUnico = async (req, res) => {
  const productId = req.params.id;

  try {
    // Obtener los datos JSONB actuales de la base de datos
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE (productos->'respuesta')::jsonb @> $1",
      [`[{"id": ${productId}}]`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe ningún producto con ese id",
      });
    }

    const existingJson = result.rows[0].productos;

    // En este ejemplo, asumiré que deseas obtener el valor del campo "nombre"
    const fieldValue = existingJson.respuesta[0];

    if (!fieldValue) {
      return res.status(404).json({
        message: "No existe ningún valor para el campo especificado",
      });
    }

    // Devolver el valor específico
    return res.json({
      valorUnico: fieldValue,
    });
  } catch (error) {
    console.error("Error durante la operación de obtención del valor:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
