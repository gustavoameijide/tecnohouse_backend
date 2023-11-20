import Router from "express-promise-router";
import {
  actualizarPresupuesto,
  createPresupuesto,
  getPresupuesto,
  getPresupuestos,
  eliminarPresupuesto,
  eliminarPresupuestoProducto,
  editarPresupuestoProducto,
  obtenerValorUnico,
  CrearProducto,
} from "../controllers/pedido.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/pedido", isAuth, getPresupuestos);

router.get("/pedido/:id", isAuth, getPresupuesto);

router.post(
  "/pedido",
  isAuth,
  // validateSchema(createPerfilSchema),
  createPresupuesto
);

router.put("/pedido/:id", isAuth, actualizarPresupuesto);

router.delete("/pedido-delete/:id", isAuth, eliminarPresupuestoProducto);

router.put("/pedido-edit/:id", isAuth, editarPresupuestoProducto);

router.delete("/pedido/:id", isAuth, eliminarPresupuesto);

router.get("/pedido-unico/:id", isAuth, obtenerValorUnico);

router.post("/pedido-create", isAuth, CrearProducto);

export default router;
