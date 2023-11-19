import Router from "express-promise-router";
import {
  actualizarPresupuesto,
  createPresupuesto,
  getPresupuesto,
  getPresupuestos,
  eliminarPresupuesto,
  eliminarPresupuestoProducto,
} from "../controllers/pedido.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";
// import { validateSchema } from "../middlewares/validate.middleware.js";
// import {
//   createPerfilSchema,
//   updatePerfilSchema,
// } from "../schemas/productos.schema.js";

const router = Router();

router.get("/pedido", isAuth, getPresupuestos);

router.get("/pedido/:id", isAuth, getPresupuesto);

router.post(
  "/pedido",
  isAuth,
  // validateSchema(createPerfilSchema),
  createPresupuesto
);

router.put(
  "/pedido/:id",
  isAuth,
  // validateSchema(updatePerfilSchema),
  actualizarPresupuesto
);

router.delete(
  "/pedido-delete/:id",
  isAuth,
  // validateSchema(updatePerfilSchema),
  eliminarPresupuestoProducto
);

router.delete("/pedido/:id", isAuth, eliminarPresupuesto);

export default router;
